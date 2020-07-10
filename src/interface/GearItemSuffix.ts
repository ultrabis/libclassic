import ItemBonus from './ItemBonus'
import ItemSuffixType from '../enum/ItemSuffixType'

export default interface GearItemSuffix {
  id: number
  type: ItemSuffixType
  bonus: ItemBonus[]
}
