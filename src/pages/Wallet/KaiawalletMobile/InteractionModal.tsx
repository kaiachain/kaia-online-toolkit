import { KaText, useKaTheme } from '@kaiachain/kaia-design-system'
import axios from 'axios'
import _ from 'lodash'
import { QRCodeSVG } from 'qrcode.react'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { toast } from 'react-toastify'

import { KmApi } from '@/common'
import { FormModal, Loading, View } from '@/components'
import { KwmApi, KmRequestType } from '@/types'
import { UseKaiawalletMobilePageReturn } from '@/hooks/page/useKaiawalletMobilePage'

const StyledQrBox = styled(View)`
  padding: 5px;
  background-color: white;
  outline: 2px solid red;
`

const MAX_WAITING_TIME = 60

const InteractionModal = ({
  request,
  useKaiawalletMobilePageReturn,
}: {
  request: KmRequestType
  useKaiawalletMobilePageReturn: UseKaiawalletMobilePageReturn
}): ReactElement => {
  const { setAddress, setSignResult, setSendKaiaResult } =
    useKaiawalletMobilePageReturn
  const { requestKey, type: requestType } = request
  const { getTheme } = useKaTheme()
  const { setRequest } = useKaiawalletMobilePageReturn

  const [remains, setRemains] = useState(MAX_WAITING_TIME)

  const modalTitlePrefix = useMemo(
    () => (isMobile ? 'Connecting wallet' : 'Please Scan the QR'),
    [isMobile]
  )
  const interval = useRef<NodeJS.Timer | null>(null)
  const timeOut = useRef<NodeJS.Timeout | null>(null)

  const clearAllTimeout = (): void => {
    if (interval.current || timeOut.current) {
      clearInterval(interval.current as NodeJS.Timeout)
      clearTimeout(timeOut.current as NodeJS.Timeout)
      interval.current = null
      timeOut.current = null
    }
  }

  const onCloseLoading = (errMessage?: string) => {
    setRequest(undefined)
    clearAllTimeout()
    if (errMessage) {
      toast(errMessage, { type: 'error' })
    }
  }

  const onCompleted = async (data: KwmApi.ResultReturnType): Promise<void> => {
    if (data.type === 'auth' && requestType === 'auth') {
      setAddress(data.result.klaytn_address)
    } else if (data.type === 'sign' && requestType === 'sign') {
      setSignResult(data.result.signed_data)
    } else if (
      (data.type === 'execute_contract' &&
        requestType === 'execute_contract') ||
      (data.type === 'send_klay' && requestType === 'send_klay')
    ) {
      if (data.status === 'completed') {
        setSendKaiaResult(data.result.tx_hash)
      } else {
        setSendKaiaResult('execute_contract failed')
      }
    }
  }

  const kmApiRequest = async () => {
    axios
      .get<KwmApi.ResultReturnType>(KmApi.resultApi(requestKey))
      .then(async ({ data }) => {
        if (data.status === 'completed') {
          onCloseLoading()
          onCompleted(data)
        } else if (data.status === 'canceled') {
          if (requestType === 'auth' || requestType === 'sign') {
            setAddress(undefined)
          }

          let title = 'Login'
          if (requestType === 'execute_contract') {
            title = 'Transaction'
          }
          onCloseLoading(`${title} has been canceled.`)
        } else if (data.status === 'error') {
          onCloseLoading('Something went wrong.\nPlease try login again.')
        }
      })
      .catch((error) => {
        onCloseLoading(_.toString(error))
      })
  }

  useEffect(() => {
    if (isMobile) {
      window.location.href = `kaiawallet://wallet/api?request_key=${requestKey}`
    }

    interval.current = setInterval(() => {
      setRemains((prev) => prev - 1)

      kmApiRequest()

      // it must be called every 1 sec
    }, 1000)

    timeOut.current = setTimeout(() => {
      onCloseLoading(
        'You have been timed out due to inactivity.\nPlease try logging in again.'
      )
    }, MAX_WAITING_TIME * 1000)
    return (): void => {
      clearAllTimeout()
    }
  }, [])

  return (
    <FormModal
      isOpen
      onClickClose={(): void => {
        onCloseLoading(
          'The wallet connection has been canceled due to the window being closed.'
        )
      }}
    >
      <View style={{ alignItems: 'center', rowGap: 12 }}>
        {!isMobile && <Loading />}
        <KaText fontType="body/xl_700" center>
          {requestType === 'auth' && `${modalTitlePrefix}\nto connect wallet`}
          {requestType === 'sign' && `${modalTitlePrefix}\nto sign connection`}
          {requestType === 'execute_contract' &&
            `${modalTitlePrefix}\nto confirm transaction`}
        </KaText>
        <KaText fontType="body/md_700" color={getTheme('brand', '5')}>
          {_.padStart(remains.toString(), 2, '0')}s remaining...
        </KaText>

        {requestKey && !isMobile ? (
          <StyledQrBox>
            <QRCodeSVG
              size={190}
              value={`https://app.kaiawallet.io/a/${requestKey}`}
            />
          </StyledQrBox>
        ) : (
          <View
            style={{
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loading />
          </View>
        )}

        <KaText fontType="body/sm_400" color={getTheme('gray', '6')} center>
          {`Automatic timeout will occur\nif you are unable to confirm within 60 secs.`}
        </KaText>
      </View>
    </FormModal>
  )
}

export default InteractionModal
