/**
 * Common values and functions. These are general game related things that could apply
 * to various classes / specs. They should be relatively low level and self-contained,
 * not requiring any higher level modules or classes.
 *
 * In the future, i'd like more common methods extracted from classes and placed here.
 */

import tools from '../module/tools'

import ArmorSubclass from '../enum/ArmorSubclass'
import Buffs from '../enum/Buffs'
import Faction from '../enum/Faction'
import Gender from '../enum/Gender'
import ItemClass from '../enum/ItemClass'
import ItemQuality from '../enum/ItemQuality'
import ItemSlot from '../enum/ItemSlot'
import MagicSchool from '../enum/MagicSchool'
import PlayableClass from '../enum/PlayableClass'
import PlayableRace from '../enum/PlayableRace'
import PowerType from '../enum/PowerType'
import PvPRank from '../enum/PvPRank'
import SortOrder from '../enum/SortOrder'
import SpellCritFromIntellectDivisor from '../enum/SpellCritFromIntellectDivisor'
import TargetType from '../enum/TargetType'
import WeaponSubclass from '../enum/WeaponSubclass'
import ClassicOptions from 'interface/ClassicOptions'

declare type BuffFlagType = keyof typeof Buffs

/* define some constants */
const globalCooldown = 1.5
const playerLevelCap = 60
const spellHitCap = 16
const spellCritCap = 100
/**
 * At level 60, caster classes have some expected amount of Int that will put them at 5% spell crit.
 * For example, to have 5% crit at 60 a mage needs 286 Int.  A 60 mage also needs 59.5 int to gain
 * 1 additional spell crit.  286/59.5=4.8067 which is less than 5, meaning mages have a base spell
 * crit of 5-(286/59.5)=0.1933. Likewise, a Shaman needs 160 int @ 60 for 5% crit, and 59.2 int for
 * 1 crit.  160/59.2=2.703 -> 5-(160/59.2)=2.2973 base spell crit
 *
 * http://blue.cardplace.com/cache/wow-mage/1009382.htm
 * http://blue.cardplace.com/cache/wow-general/8532087.htm
 * http://blue.cardplace.com/cache/wow-mage/559324.htm
 *
 */
const baseSpellCrit = 1.8 /* FIXME: should be a function with class as input*/
const baseSpellCritMultiplier = 1.5

let defaultOptions: ClassicOptions = {
  debug: false,
  experimental: false,
  phase: 4,
  encounterLength: 100,
  spellName: 'Starfire Rank 6',
  castTimePenalty: 0.05, // This is an artifact from Ayz's spell damage calculator. No one knows what it is. Human factor? Latency factor?
  equipment: {
    raids: true,
    tailoring: true,
    worldBosses: false,
    randomEnchants: true,
    enchantExploit: false,
    onUseItems: true,
    itemSearchSlot: ItemSlot.None,
    enchantSearchSlot: ItemSlot.None,
    lockedItems: {
      head: '',
      hands: '',
      neck: '',
      waist: '',
      shoulder: '',
      legs: '',
      back: '',
      feet: '',
      chest: '',
      wrist: '',
      finger: '',
      finger2: '',
      mainhand: '',
      offhand: '',
      trinket: '',
      trinket2: '',
      idol: ''
    },
    lockedEnchants: {
      head: '',
      hands: '',
      shoulder: '',
      legs: '',
      back: '',
      feet: '',
      chest: '',
      wrist: '',
      mainhand: ''
    }
  },
  character: {
    level: 60,
    gender: Gender.Male,
    race: PlayableRace.Tauren,
    class: PlayableClass.Druid,
    pvpRank: 1,
    talents: {
      naturesGraceRank: 1,
      moonFuryRank: 5,
      vengeanceRank: 5,
      improvedWrathRank: 5,
      improvedStarfireRank: 5,
      improvedMoonfireRank: 5,
      reflectionRank: 3
    },
    buffs: [
      'MoonkinAura',
      'FlaskOfSupremePower',
      'GreaterArcaneElixir',
      'CerebralCortexCompound',
      'RunnTumTuberSurprise',
      'RallyingCryOfTheDragonSlayer',
      'SlipkiksSavvy',
      'ArcaneBrilliance',
      'SongflowerSerenade',
      'BlessingOfKings',
      'ImprovedGiftOfTheWild',
      'SpiritOfZandalar'
    ]
  },
  target: {
    level: 63,
    type: TargetType.Elemental,
    spellResistance: 75,
    shimmer: 0,
    thunderfury: 0,
    debuffs: ['CurseOfShadow']
  }
}

const factionFromRace = (race: PlayableRace): Faction => {
  switch (race) {
    case PlayableRace.Tauren:
    case PlayableRace.Orc:
    case PlayableRace.Undead:
    case PlayableRace.Troll:
      return Faction.Horde
    default:
      return Faction.Alliance
  }
}

const buffListToFlags = (buffList: string[]): Buffs => {
  let buffs: Buffs = Buffs.None

  for (let buffName of buffList) {
    buffs |= Buffs[buffName as BuffFlagType]
  }
  return buffs
}

const magicSchoolToText = (magicSchool: MagicSchool): string => {
  return MagicSchool[magicSchool]
}

const magicSchoolFromText = (magicSchool: string): MagicSchool => {
  return parseInt(tools.getEnumKeyByEnumValue(MagicSchool, magicSchool), 0)
}

/**
 *
 * Returns the chance of a spell hitting a target, not accounting for the players spellHit stat.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 */
const spellBaseChanceToHit = (targetLevel: number) => {
  switch (targetLevel) {
    case 63:
      return 83
    case 62:
      return 94
    case 61:
      return 95
    case 60:
      return 96
    case 59:
      return 97
    case 58:
      return 98
    default:
      return 99
  }
}

/**
 *
 * Returns chance of hitting a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @returns A number between '0' and '99'.
 */
const spellChanceToHit = (targetLevel: number, spellHit: number): number => {
  return Math.min(99, spellBaseChanceToHit(targetLevel) + spellHit)
}

/**
 *
 * Returns chance of missing a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @returns A number between '1' and '100'.
 */
const spellChanceToMiss = (targetLevel: number, spellHit: number): number => {
  return Math.max(1, 100 - spellChanceToHit(targetLevel, spellHit))
}

/**
 *
 * Returns chance of critical striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns spellCrit multiplied by the chance of hitting.
 */
const spellChanceToCrit = (targetLevel: number, spellHit: number, spellCrit: number): number => {
  return spellCrit * (spellChanceToHit(targetLevel, spellHit) / 100)
}

/**
 *
 * Returns chance of normal striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns Chance of hitting minus chance of critting.
 */
const spellChanceToNormal = (targetLevel: number, spellHit: number, spellCrit: number): number => {
  return spellChanceToHit(targetLevel, spellHit) - spellChanceToCrit(targetLevel, spellHit, spellCrit)
}

export default {
  /* constants */
  globalCooldown,
  playerLevelCap,
  spellHitCap,
  spellCritCap,
  baseSpellCrit,
  baseSpellCritMultiplier,
  defaultOptions,
  /* functions */
  factionFromRace,
  buffListToFlags,
  magicSchoolFromText,
  magicSchoolToText
}
