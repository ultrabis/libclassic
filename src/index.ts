import calc from './module/calc'
import encounter from './module/encounter'
import enums from './module/enums'
import gearEnchant from './module/gearEnchant'
import gearItem from './module/gearItem'
import gearItemSuffix from './module/gearItemSuffix'
import gearSettings from './module/gearSettings'
import locked from './module/locked'
import optimal from './module/optimal'
import query from './module/query'
import settings from './module/settings'
import spell from './module/spell'
import url from './module/url'
import utils from './module/utils'

const common = {
  utils: utils,
  calc: calc,
  enums: enums,
  settings: settings
}

const mt = {
  locked: locked,
  optimal: optimal,
  query: query,
  url: url,
  encounter: encounter,
  gearEnchant: gearEnchant,
  gearItem: gearItem,
  gearItemSuffix: gearItemSuffix,
  gearSettings: gearSettings,
  spell: spell
}

const run = mt.encounter.run
const defaultSettings = settings.fromDefaults

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
  common, // common doesn't query items or spells
  mt, // requires 'database' queries
  calc,
  enums,
  settings,
  utils,
  gearEnchant,
  gearItem,
  gearItemSuffix,
  gearSettings,
  spell: spell,
  locked,
  optimal,
  query,
  url,
  encounter,
  /* entry functions. will replace classes. */
  run,
  defaultSettings,

  // Stupid csim. XML format so goofy it lags rollup trying to generate it
  // ClassicSim

  /* classes: FIXME: replacing classes with modules */
  Character,
  Item,
  Equipment,
  Target,
  Spell,
  Cast,
  Encounter
}
