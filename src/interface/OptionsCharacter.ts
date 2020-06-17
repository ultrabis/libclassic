import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import PvPRank from '../enum/PvPRank'
import LockedItems from './LockedItems'
import LockedEnchants from './LockedEnchants'

export default interface OptionsCharacter {
  level: number
  gender: Gender
  race: PlayableRace
  class: PlayableClass
  pvpRank: PvPRank
  buffs: string[]
  lockedItems: LockedItems
  lockedEnchants: LockedEnchants
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
