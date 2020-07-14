import ItemSuffixType from '../enum/ItemSuffixType'

export default interface ItemSuffixQuery {
  id?: number
  type?: ItemSuffixType
  bonusValue?: number
}
