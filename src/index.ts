/* common */
import common from './common'
const calc = common.calc
const enums = common.enums
const settings = common.settings
const utils = common.utils

/* mt. : */
import mt from './mt'
const gear = mt.gear
const locked = mt.locked
const optimal = mt.optimal
const query = mt.query
const url = mt.url
const encounter = mt.encounter
const run = mt.encounter.run
const defaultSettings = settings.defaults

/* class */
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

/* TODO: Remove this after adding some tests */
const sum = (a: number, b: number): number => {
  if ('development' === process.env.NODE_ENV) {
    console.log('bap')
  }
  return a + b
}

export default {
  sum,
  /* modules */
  common,
  calc,
  enums,
  settings,
  utils,
  mt,
  encounter,
  run,
  defaultSettings,
  gear,
  locked,
  optimal,
  query,
  url,
  /* entry functions. will replace classes. */

  // Stupid csim. XML format so goofy it lags rollup trying to generate it
  // ClassicSim
  /* classes */
  Character,
  Item,
  Equipment,
  Target,
  Spell,
  Cast,
  Encounter
}
