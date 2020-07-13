/** database */

import GearItemBonus from './GearItemBonus'
import GearItemSuffixType from '../enum/GearItemSuffixType'

export default interface GearItemSuffix {
  id: number
  type: GearItemSuffixType
  bonus: GearItemBonus[]
}
