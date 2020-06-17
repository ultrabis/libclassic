/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 */
import Vendor from './module/Vendor'
import Constants from './module/Constants'
import Common from './module/Common'
import Tools from './module/Tools'
import Query from './module/Query'
import Locked from './module/Locked'
import Optimal from './module/Optimal'
import URL from './module/URL'

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

/* class */
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

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
  Vendor,
  Common,
  Constants,
  Tools,
  Query,
  Locked,
  Optimal,
  URL,
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
