import ItemBonus from './GearItemBonus'
import GearItemSuffixType from '../enum/GearItemSuffixType'

export default interface GearItemSuffix {
  id: number
  type: GearItemSuffixType
  bonus: ItemBonus[]
}
