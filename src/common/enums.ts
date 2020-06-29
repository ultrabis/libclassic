/*
- in game lists (e.g. list of raids, bosses, races, classes, etc ) are represented as enums.
- also included are helper functions to return enum value(s) from fuzzy text e.g. case / white space insensitive
*/
import utils from './utils'

import Raid from '../enum/Raid'
import WorldBoss from '../enum/WorldBoss'
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

// FIXME: replace with function in calc
import SpellCritFromIntellectDivisor from '../enum/SpellCritFromIntellectDivisor'

import TargetType from '../enum/TargetType'
import WeaponSubclass from '../enum/WeaponSubclass'
import ItemSuffixType from '../enum/ItemSuffixType'
import ItemBonusType from '../enum/ItemBonusType'
import GearSlot from '../enum/GearSlot'

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

declare type BuffFlagType = keyof typeof Buffs

const buffListToFlags = (buffList: string[]): Buffs => {
  let buffs: Buffs = Buffs.None

  for (const buffName of buffList) {
    buffs |= Buffs[buffName as BuffFlagType]
  }
  return buffs
}

// console.log(libclassic.enums.gearSlotFromText('waist'))
const gearSlotFromText = (text: string): GearSlot => {
  const _ = (text: string): typeof GearSlot[keyof typeof GearSlot] => {
    return Number(utils.getEnumValueFromFuzzyText(GearSlot, text))
  }
  return _(text)
}

// console.log(libclassic.enums.raidFromText('zulgurub'))
const raidFromText = (text: string): Raid => {
  const _ = (text: string): typeof Raid[keyof typeof Raid] => {
    return Number(utils.getEnumValueFromFuzzyText(Raid, text))
  }
  return _(text)
}

// console.log(libclassic.enums.raidsFromText('zulgurub'))
const raidsFromText = (text: string): Raid[] => {
  const _ = (text: string): typeof Raid[keyof typeof Raid][] => {
    return utils.getEnumValuesFromFuzzyText(Raid, text)
  }
  return _(text)
}

// console.log(libclassic.enums.worldBossFromText('azuregos'))
const worldBossFromText = (text: string): WorldBoss => {
  const _ = (text: string): typeof WorldBoss[keyof typeof WorldBoss] => {
    return Number(utils.getEnumValueFromFuzzyText(WorldBoss, text))
  }
  return _(text)
}

// console.log(libclassic.enums.worldBossesFromText('azuregos'))
const worldBossesFromText = (text: string): WorldBoss[] => {
  const _ = (text: string): typeof WorldBoss[keyof typeof WorldBoss][] => {
    return utils.getEnumValuesFromFuzzyText(WorldBoss, text)
  }
  return _(text)
}

// console.log(libclassic.enums.pvpRankFromText('scout'))
const pvpRankFromText = (text: string): PvPRank => {
  const _ = (text: string): typeof PvPRank[keyof typeof PvPRank] => {
    return Number(utils.getEnumValueFromFuzzyText(PvPRank, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableRaceFromText('nightelf'))
const playableRaceFromText = (text: string): PlayableRace => {
  const _ = (text: string): typeof PlayableRace[keyof typeof PlayableRace] => {
    return Number(utils.getEnumValueFromFuzzyText(PlayableRace, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableClassFromText('rogue'))
const playableClassFromText = (text: string): PlayableClass => {
  const _ = (text: string): typeof PlayableClass[keyof typeof PlayableClass] => {
    return Number(utils.getEnumValueFromFuzzyText(PlayableClass, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableClassesFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const playableClassesFromText = (text: string): PlayableClass[] => {
  const _ = (text: string): typeof PlayableClass[keyof typeof PlayableClass][] => {
    return utils.getEnumValuesFromFuzzyText(PlayableClass, text)
  }
  return _(text)
}
// console.log(libclassic.enums.itemBonusTypeFromText('arcane spell damage'))
const itemBonusTypeFromText = (text: string): ItemBonusType => {
  const _ = (text: string): typeof ItemBonusType[keyof typeof ItemBonusType] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemBonusType, text))
  }
  return _(text)
}

// console.log(libclassic.enums.itemSuffixTypeFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const itemSuffixTypeFromText = (text: string): ItemSuffixType => {
  const _ = (text: string): typeof ItemSuffixType[keyof typeof ItemSuffixType] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemSuffixType, text))
  }
  return _(text)
}

// console.log(libclassic.enums.itemQualitypeFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const itemQualityFromText = (text: string): ItemQuality => {
  const _ = (text: string): typeof ItemQuality[keyof typeof ItemQuality] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemQuality, text))
  }
  return _(text)
}

export default {
  /* enums */
  ArmorSubclass,
  Buffs,
  Faction,
  Gender,
  ItemClass,
  ItemQuality,
  ItemSlot,
  MagicSchool,
  PlayableClass,
  PlayableRace,
  PowerType,
  PvPRank,
  SortOrder,
  SpellCritFromIntellectDivisor,
  TargetType,
  WeaponSubclass,
  ItemSuffixType,
  Raid,
  WorldBoss,
  /* functions */
  factionFromRace,
  buffListToFlags,
  gearSlotFromText,
  raidFromText,
  raidsFromText,
  worldBossFromText,
  worldBossesFromText,
  pvpRankFromText,
  playableRaceFromText,
  playableClassFromText,
  playableClassesFromText,
  itemBonusTypeFromText,
  itemSuffixTypeFromText,
  itemQualityFromText
}