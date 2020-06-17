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

declare type BuffFlagType = keyof typeof Buffs

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

/*
const magicSchoolFromText = (magicSchool: string): MagicSchool => {
  return MagicSchool.magicSchool
}
*/

export default {
  factionFromRace,
  buffListToFlags,
  magicSchoolToText,
  /* all enums */
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
  WeaponSubclass
}
