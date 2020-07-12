import utils from './module/utils'
import common from './module/common'
import encounter from './module/encounter'
import gearEnchant from './module/gearEnchant'
import gearItem from './module/gearItem'
import gearItemSuffix from './module/gearItemSuffix'
import gearSettings from './module/gearSettings'
import locked from './module/locked'
import optimal from './module/optimal'
import query from './module/query'
import spell from './module/spell'
import url from './module/url'

/* class: FIXME: get rid of classes */
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

const run = encounter.run
const run2 = encounter.run2
const defaultSettings = encounter.defaultSettings()

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
  run2,
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
