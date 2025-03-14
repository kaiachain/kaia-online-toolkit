import { KaButton } from '@kaiachain/kaia-design-system'
import { ReactElement } from 'react'

type FormDownloadProps = {
  title?: string
  fileName: string
  fileData: string
}

export const FormDownload = ({
  title,
  fileName,
  fileData,
}: FormDownloadProps): ReactElement => {
  const onClick = (): void => {
    const date = new Date()
    const filename = `${fileName}-${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}.json`
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' + encodeURIComponent(fileData)
    )
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return <KaButton onClick={onClick}>{title || 'Download'}</KaButton>
}
