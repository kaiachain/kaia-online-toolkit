import { RoutePath } from './route'

export enum UtilityTypeEnum {
  CONVERTER = 'Converter',
  VERIFICATION = 'Verification',
  ADDRESS = 'Address',
}

export type UtilityItemType = {
  id: string
  type: UtilityTypeEnum
  to: RoutePath
  title: string
  description: string
}
