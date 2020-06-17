import TargetType from '../enum/TargetType'
import Faction from '../enum/Faction'
import PvPRank from '../enum/PvPRank'
import MagicSchool from '../enum/MagicSchool'
import SortOrder from '../enum/SortOrder'
import ItemSlot from '../enum/ItemSlot'

import LockedItems from './LockedItems'
import LockedEnchants from './LockedEnchants'

export default interface ItemSearch {
  phase: number
  faction: Faction
  pvpRank: PvPRank
  raids: boolean
  tailoring: boolean
  worldBosses: boolean
  randomEnchants: boolean
  enchantExploit: boolean
  encounterLength: number
  onUseItems: boolean
  magicSchool: MagicSchool
  targetType: TargetType
  lockedItems?: LockedItems
  lockedEnchants?: LockedEnchants
  spellHitWeight: number
  spellCritWeight: number
  spellCastTime: number
  spellCrit: number
  naturesGrace: boolean
  slot: ItemSlot
  sortOrder?: SortOrder
}
