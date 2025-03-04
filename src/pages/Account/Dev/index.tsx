import { ReactElement, useState } from 'react'
import { KaText } from '@kaiachain/kaia-design-system'

import { View, Container } from '@/components'

import { Web3, TxType, AccountKeyType } from '@kaiachain/web3js-ext'

import _ from 'lodash'

const Basic = (): ReactElement => {
  const senderPriv =
    '0x91c526783a34a78232eb493c5bcff213ce59d172bda8c9efc49533cfcd1a0964'

  const provider = new Web3.providers.HttpProvider(
    'https://public-en-kairos.node.kaia.io'
  )
  const web3 = new Web3(provider)
  const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPriv)

  const [signedTx, setSignedTx] = useState('')
  const [receipt, setReceipt] = useState({})
  const [errMsg, setErrMsg] = useState('')

  async function sendTx() {
    setErrMsg('')
    setSignedTx('')
    setReceipt({})
    try {
      const tx = {
        type: TxType.AccountUpdate,
        from: senderAccount.address,
        key: {
          type: AccountKeyType.Legacy,
        },
      }

      const signResult = await senderAccount.signTransaction(tx)
      setSignedTx(signResult.transactionHash)
      const _receipt = await web3.eth.sendSignedTransaction(
        signResult.rawTransaction
      )
      setReceipt(_receipt)
    } catch (error) {
      console.log('error', JSON.stringify(error, null, 2))
      setErrMsg(JSON.stringify(error, null, 2))
    }
  }

  return (
    <Container title="Dev">
      <button onClick={sendTx}>Send Transaction</button>
      <KaText fontType="body/md_700">signedTx:{signedTx}</KaText>
      <KaText fontType="body/md_700">
        receipt:
        {_.map(receipt, (val, key) => {
          const value =
            typeof val === 'bigint' ? `${BigInt(val).toString()}n` : val
          return (
            <View key={`receipt-${key}`}>
              {key}:{value}
            </View>
          )
        })}
      </KaText>
      <KaText fontType="body/md_700">errMsg:{errMsg}</KaText>
    </Container>
  )
}

export default Basic
