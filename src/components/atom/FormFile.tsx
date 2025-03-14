import { ReactElement } from 'react'
import styled from 'styled-components'

const StyledFile = styled.input``

type FormFileProps = {
  accept: string
  onChange: (accept?: FileList) => void
  placeholder?: string
}

export const FormFile = ({
  accept,
  placeholder,
  onChange,
}: FormFileProps): ReactElement => (
  <StyledFile
    style={{ color: 'white' }}
    type="file"
    accept={accept}
    onChange={(e): void => onChange(e.target.files || undefined)}
    placeholder={placeholder}
  />
)
