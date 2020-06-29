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

/* class */
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

import Settings from './interface/Settings'
import EncounterResults from './interface/EncounterResults'

/* TODO: Remove this after adding some tests */
const sum = (a: number, b: number): number => {
  if ('development' === process.env.NODE_ENV) {
    console.log('bap')
  }
  return a + b
}

/* entry functions */
const getDefaultSettings = (): Settings => {
  return common.settings.defaults()
}

const run = (settings?: Settings): EncounterResults => {
  const mySettings = settings ? settings : getDefaultSettings()
  const encounter = new Encounter(mySettings)

  const encounterResults: EncounterResults = {
    dps: encounter.spellCast.dps.effective.avg,
    spellHitWeight: encounter.spellCast.spellHitWeight,
    spellCritWeight: encounter.spellCast.spellCritWeight,
    intWeight: encounter.spellCast.intWeight,
    gearTable: encounter.spellCast.character.equipment.itemsAsBlessedTable,
    spell: new Spell(mySettings.spellName),
    manaReturn: calc.manaPerTick(
      encounter.spellCast.character.level,
      encounter.spellCast.character.spirit,
      encounter.spellCast.character.mp5
    )
  }
  return encounterResults
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
  gear,
  locked,
  optimal,
  query,
  url,
  /* entry functions */
  run,
  getDefaultSettings,
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
