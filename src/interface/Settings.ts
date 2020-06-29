import LockedItems from './LockedItems'
import LockedEnchants from './LockedEnchants'

import ItemSlot from '../enum/ItemSlot'
import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import PvPRank from '../enum/PvPRank'
import MagicSchool from '../enum/MagicSchool'
import TargetType from '../enum/TargetType'
import Game from '../enum/Game'

export default interface Setings {
  game: Game
  phase: number
  spellName: string
  encounterLength: number
  castTimePenalty: number
  equipment: {
    raids: boolean
    tailoring: boolean
    worldBosses: boolean
    randomEnchants: boolean
    enchantExploit: boolean
    onUseItems: boolean
    itemSearchSlot: ItemSlot
    enchantSearchSlot: ItemSlot
    lockedItems: LockedItems
    lockedEnchants: LockedEnchants
    gear: number[][]
  }
  character: {
    level: number
    gender: Gender
    race: PlayableRace
    class: PlayableClass
    pvpRank: PvPRank
    buffs: string[]
    talents: {
      naturesGraceRank: number
      moonFuryRank: number
      vengeanceRank: number
      improvedWrathRank: number
      improvedStarfireRank: number
      improvedMoonfireRank: number
      reflectionRank: number
    }
  }
  target: {
    level: number
    shimmer: MagicSchool
    thunderfury: number
    type: TargetType
    spellResistance: number
    debuffs: string[]
  }
  debug: boolean
  experimental: boolean
}
