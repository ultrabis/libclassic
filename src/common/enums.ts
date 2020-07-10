/*
- in game lists (e.g. list of raids, bosses, races, classes, etc ) are represented as enums.
- also included are helper functions to return enum value(s) from fuzzy text e.g. case / white space insensitive
*/
import utils from './utils'

import Raid from '../enum/Raid'
import WorldBoss from '../enum/WorldBoss'
import ArmorSubclass from '../enum/ArmorSubclass'
import Buff from '../enum/Buff'
import Faction from '../enum/Faction'
import Gender from '../enum/Gender'
import ItemClass from '../enum/ItemClass'
import ItemQuality from '../enum/ItemQuality'
import ItemSlot from '../enum/ItemSlot'
import GearSlot from '../enum/GearSlot'
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
import GearItemSuffixType from '../enum/GearItemSuffixType'
import GearItemBonusType from '../enum/GearItemBonusType'

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

// console.log(libclassic.enums.gearSlotFromText('waist'))
const gearSlotFromText = (text: string): GearSlot => {
  const _ = (text: string): typeof GearSlot[keyof typeof GearSlot] => {
    return Number(utils.getEnumValueFromFuzzyText(GearSlot, text))
  }
  return _(text)
}

const gearSlotFromItemSlot = (itemSlot: ItemSlot): GearSlot => {
  switch (itemSlot) {
    case ItemSlot.Onehand:
    case ItemSlot.Twohand:
    case ItemSlot.Mainhand:
      return GearSlot.Mainhand
    case ItemSlot.Head:
      return GearSlot.Head
    case ItemSlot.Neck:
      return GearSlot.Neck
    case ItemSlot.Shoulder:
      return GearSlot.Shoulder
    case ItemSlot.Chest:
      return GearSlot.Chest
    case ItemSlot.Waist:
      return GearSlot.Waist
    case ItemSlot.Legs:
      return GearSlot.Legs
    case ItemSlot.Feet:
      return GearSlot.Feet
    case ItemSlot.Wrist:
      return GearSlot.Wrist
    case ItemSlot.Hands:
      return GearSlot.Hands
    case ItemSlot.Finger:
      return GearSlot.Finger
    case ItemSlot.Finger2:
      return GearSlot.Finger2
    case ItemSlot.Trinket:
      return GearSlot.Trinket
    case ItemSlot.Trinket2:
      return GearSlot.Trinket
    case ItemSlot.Ranged:
      return GearSlot.Ranged
    case ItemSlot.Offhand:
      return GearSlot.Offhand
    case ItemSlot.Ranged:
      return GearSlot.Ranged
    case ItemSlot.Relic:
      return GearSlot.Relic
    case ItemSlot.Quiver:
      return GearSlot.Quiver
    default:
      return 0
  }
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
const itemBonusTypeFromText = (text: string): GearItemBonusType => {
  const _ = (text: string): typeof GearItemBonusType[keyof typeof GearItemBonusType] => {
    return Number(utils.getEnumValueFromFuzzyText(GearItemBonusType, text))
  }
  return _(text)
}

// console.log(libclassic.enums.GearItemSuffixTypeFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const GearItemSuffixTypeFromText = (text: string): GearItemSuffixType => {
  const _ = (text: string): typeof GearItemSuffixType[keyof typeof GearItemSuffixType] => {
    return Number(utils.getEnumValueFromFuzzyText(GearItemSuffixType, text))
  }
  return _(text)
}

const GearItemSuffixTypeFromItemName = (itemName: string): GearItemSuffixType => {
  const of = itemName.toUpperCase().indexOf(' OF ')
  if (of === -1) {
    return GearItemSuffixType.Invalid
  }

  const right = itemName.slice(of + 4)
  return GearItemSuffixTypeFromText(right)
}

// console.log(libclassic.enums.itemQualitypeFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const itemQualityFromText = (text: string): ItemQuality => {
  const _ = (text: string): typeof ItemQuality[keyof typeof ItemQuality] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemQuality, text))
  }
  return _(text)
}

// console.log(libclassic.enums.buffFromText('moonkin aura'))
const buffFromText = (text: string): Buff => {
  const _ = (text: string): typeof Buff[keyof typeof Buff] => {
    return Number(utils.getEnumValueFromFuzzyText(Buff, text))
  }
  return _(text)
}

// console.log(libclassic.enums.buffsFromText('moonkin aura, power infusion'))
const buffsFromText = (text: string): Buff[] => {
  const _ = (text: string): typeof Buff[keyof typeof Buff][] => {
    return utils.getEnumValuesFromFuzzyText(Buff, text)
  }
  return _(text)
}

// console.log(libclassic.enums.buffMaskFromText('moonkin aura, power infusion'))
const buffMaskFromText = (text: string): number => {
  return utils.getEnumBitmaskFromFuzzyText(Buff, text)
}

// console.log(libclassic.enums.buffMaskIncludes(buffMask, Buff.MoonkinAura))
const buffMaskIncludes = (buffMask: number, buff: Buff): boolean => {
  return utils.bitMaskIncludes(buffMask, buff)
}

export default {
  /* enums */
  ArmorSubclass,
  Buff,
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
  GearItemSuffixType,
  Raid,
  WorldBoss,
  /* functions */
  factionFromRace,
  gearSlotFromText,
  gearSlotFromItemSlot,
  raidFromText,
  raidsFromText,
  worldBossFromText,
  worldBossesFromText,
  pvpRankFromText,
  playableRaceFromText,
  playableClassFromText,
  playableClassesFromText,
  itemBonusTypeFromText,
  GearItemSuffixTypeFromItemName,
  GearItemSuffixTypeFromText,
  itemQualityFromText,
  buffFromText,
  buffsFromText,
  buffMaskFromText,
  buffMaskIncludes
}
