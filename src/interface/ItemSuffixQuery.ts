import GearItemSuffixType from '../enum/GearItemSuffixType'

export default interface ItemSuffixQuery {
  id?: number
  type?: GearItemSuffixType
  bonusValue?: number
}
