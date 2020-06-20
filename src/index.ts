/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 */
import vendor from './module/vendor'
import utils from './module/utils'
import common from './module/common'
import query from './module/query'
import locked from './module/locked'
import optimal from './module/optimal'
import url from './module/url'

/* class */
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

/* enum */
import ArmorSubclass from './enum/ArmorSubclass'
import Buffs from './enum/Buffs'
import Faction from './enum/Faction'
import Gender from './enum/Gender'
import ItemClass from './enum/ItemClass'
import ItemQuality from './enum/ItemQuality'
import ItemSlot from './enum/ItemSlot'
import MagicSchool from './enum/MagicSchool'
import PlayableClass from './enum/PlayableClass'
import PlayableRace from './enum/PlayableRace'
import PowerType from './enum/PowerType'
import PvPRank from './enum/PvPRank'
import SortOrder from './enum/SortOrder'
import SpellCritFromIntellectDivisor from './enum/SpellCritFromIntellectDivisor'
import TargetType from './enum/TargetType'
import WeaponSubclass from './enum/WeaponSubclass'

/* interface */
import CastDmgObject from './interface/CastDmgObject'
import CastDmgValues from './interface/CastDmgValues'
import ClassicOptions from './interface/ClassicOptions'
import EnchantJSON from './interface/EnchantJSON'
import EquipmentArray from './interface/EquipmentArray'
import ItemJSON from './interface/ItemJSON'
import ItemOnUseJSON from './interface/ItemOnUseJSON'
import ItemQuery from './interface/ItemQuery'
import ItemSearch from './interface/ItemSearch'
import ItemSetJSON from './interface/ItemSetJSON'
import LockedEnchants from './interface/LockedEnchants'
import LockedItems from './interface/LockedItems'
import ParaminOptions from './interface/ParaminOptions'
import SpellCoefficient from './interface/SpellCoefficient'
import SpellJSON from './interface/SpellJSON'
import SpellQuery from './interface/SpellQuery'
import WeaponComboJSON from './interface/WeaponComboJSON'
import Weights from './interface/Weights'

/* TODO: Remove this after adding some tests */
const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('bap')
  }
  return a + b
}

export default {
  sum,
  /* modules */
  vendor,
  common,
  utils,
  query,
  locked,
  optimal,
  url,
  // Stupid csim. XML format so goofy it lags rollup trying to generate it
  // ClassicSim
  /* classes */
  Character,
  Item,
  Equipment,
  Target,
  Spell,
  Cast,
  Encounter,
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
  WeaponSubclass
}
