import common from './common'

import item from './item'
import enchant from './enchant'

import EncounterFIXME from '../class/Encounter'

import Encounter from '../interface/Encounter'
import Settings from '../interface/Settings'
import DPS from '../interface/DPS'
import PlayerTrio from '../interface/PlayerTrio'
import TargetTrio from '../interface/TargetTrio'
import ResistancesTrio from '../interface/ResistancesTrio'
import StatsTrio from '../interface/StatsTrio'
import SpellDamageTrio from '../interface/SpellDamageTrio'
import Gear from '../interface/Gear'
import Weights from '../interface/Weights'
import Spell from '../interface/SpellTrio'

import PlayableSpec from '../enum/PlayableSpec'
import spell from './spell'

// FIXME: remove. just call the thing with settings.defaults.
const defaultSettings = (spec?: PlayableSpec): Settings => {
  return common.defaultSettings(spec ? { playerSpec: spec } : undefined)
}

const statsDefault = (): StatsTrio => {
  return {
    health: common.commonNumberResultFromDefault(),
    mana: common.commonNumberResultFromDefault(),
    stamina: common.commonNumberResultFromDefault(),
    intellect: common.commonNumberResultFromDefault(),
    spirit: common.commonNumberResultFromDefault(),
    mp5: common.commonNumberResultFromDefault(),
    spellHit: common.commonNumberResultFromDefault(),
    spellCrit: common.commonNumberResultFromDefault(),
    spellPenetration: common.commonNumberResultFromDefault(),
    spellHealing: common.commonNumberResultFromDefault(),
    spellDamage: spellDamageDefault(),
    resistances: resistancesDefault()
  }
}

const resistancesDefault = (): ResistancesTrio => {
  return {
    spellResistance: common.commonNumberResultFromDefault(),
    arcaneResistance: common.commonNumberResultFromDefault(),
    fireResistance: common.commonNumberResultFromDefault(),
    frostResistance: common.commonNumberResultFromDefault(),
    natureResistance: common.commonNumberResultFromDefault(),
    shadowResistance: common.commonNumberResultFromDefault()
  }
}

const spellDamageDefault = (): SpellDamageTrio => {
  return {
    spellDamage: common.commonNumberResultFromDefault(),
    arcaneDamage: common.commonNumberResultFromDefault(),
    fireDamage: common.commonNumberResultFromDefault(),
    frostDamage: common.commonNumberResultFromDefault(),
    natureDamage: common.commonNumberResultFromDefault(),
    shadowDamage: common.commonNumberResultFromDefault(),
    holyDamage: common.commonNumberResultFromDefault()
  }
}

const weightsDefault = (): Weights => {
  return {
    spellDamage: 1,
    spellHit: 0,
    spellCrit: 0,
    intellect: 0
  }
}

const playerDefault = (): PlayerTrio => {
  return {
    stats: statsDefault(),
    talents: {}
  }
}

const targetDefault = (): TargetTrio => {
  return {
    stats: statsDefault()
  }
}

const dpsDefault = (): DPS => {
  return {
    min: common.commonNumberResultFromDefault(),
    max: common.commonNumberResultFromDefault(),
    avg: common.commonNumberResultFromDefault(),
    text: common.commonStringResultFromDefault()
  }
}

const gearDefault = () => {
  return {
    custom: [],
    items: [],
    enchants: []
  }
}

// TODO: shim together with the existing classes, then keep replacing stuff until classes are no more
const run = (settings: Settings): Encounter => {
  const _e: EncounterFIXME = new EncounterFIXME(settings)
  const _sc = _e.spellCast
  const _p = _sc.player
  const targetObj: TargetTrio = targetDefault()
  const spellObj: Spell = spell.fromDefault()
  const weightsObj: Weights = weightsDefault()
  const gearObj: Gear = gearDefault()
  const playerObj: PlayerTrio = playerDefault()
  const dpsObj: DPS = dpsDefault()

  /* spell */
  spellObj.name = _sc.spell.name
  spellObj.rank = Number(_sc.spell.rank)
  spellObj.type = _sc.spell.type
  spellObj.magicSchool = _sc.spell.magicSchool
  spellObj.range = _sc.spell.range
  spellObj.manaCost = _sc.spell.manaCost
  spellObj.reqLvl = _sc.spell.reqLvl
  spellObj.coefficient = _sc.spell.coefficient
  spellObj.isBinary = _sc.spell.isBinary
  spellObj.secondaryEffect = _sc.spell.secondaryEffect ? _sc.spell.secondaryEffect : ''
  spellObj.canCrit = _sc.spell.canCrit
  spellObj.canMiss = _sc.spell.canMiss
  spellObj.canPartialResist = _sc.spell.canPartialResist
  spellObj.castTime = {
    base: _sc.spell.castTime,
    actual: _sc.castTime,
    effective: _sc.effectiveCastTime
  }

  spellObj.dmg = {
    normal: _sc.normalDmg,
    crit: _sc.critDmg,
    periodic: _sc.periodicDmg
  }

  /* DPS */
  dpsObj.min.base = _sc.dps.base.min
  dpsObj.min.actual = _sc.dps.actual.min
  dpsObj.min.effective = _sc.dps.effective.min
  dpsObj.max.base = _sc.dps.base.max
  dpsObj.max.actual = _sc.dps.actual.max
  dpsObj.max.effective = _sc.dps.effective.max
  dpsObj.avg.base = _sc.dps.base.avg
  dpsObj.avg.actual = _sc.dps.actual.avg
  dpsObj.avg.effective = _sc.dps.effective.avg
  dpsObj.text.base = `${_sc.dps.base.avg} (${_sc.dps.base.min} - ${_sc.dps.base.max})`
  dpsObj.text.actual = `${_sc.dps.actual.avg} (${_sc.dps.actual.min} - ${_sc.dps.actual.max})`
  dpsObj.text.effective = `${_sc.dps.effective.avg} (${_sc.dps.effective.min} - ${_sc.dps.effective.max})`

  /* Player */
  playerObj.stats.health.effective = _sc.player.health
  playerObj.stats.mana.effective = _sc.player.mana
  playerObj.stats.stamina.effective = _sc.player.stamina
  playerObj.stats.intellect.effective = _sc.player.intellect
  playerObj.stats.spirit.effective = _sc.player.spirit
  playerObj.stats.mp5.effective = _sc.player.mp5
  playerObj.stats.spellCrit = {
    base: common.baseSpellCrit,
    actual: common.baseSpellCrit + _sc.player.spellCritFromIntellect + _sc.player.spellCritFromEquipment,
    effective:
      common.baseSpellCrit +
      _sc.player.spellCritFromIntellect +
      _sc.player.spellCritFromEquipment +
      _sc.improvedMoonfireSpellCritBonus
  }

  // FIXME: add spellHitNoCap
  /* weights */
  weightsObj.spellHit = _sc.spellHitWeight
  weightsObj.spellCrit = _sc.spellCritWeight
  weightsObj.intellect = _sc.intWeight

  /* gear */
  // gear.equipped = [[0, 0]]
  gearObj.custom = [
    [item.fromJSON(_p.equipment.head.itemJSON), enchant.fromJSON(_p.equipment.head.enchantJSON)],
    [item.fromJSON(_p.equipment.hands.itemJSON), enchant.fromJSON(_p.equipment.hands.enchantJSON)],
    [item.fromJSON(_p.equipment.neck.itemJSON), enchant.fromJSON(_p.equipment.neck.enchantJSON)],
    [item.fromJSON(_p.equipment.waist.itemJSON), enchant.fromJSON(_p.equipment.waist.enchantJSON)],
    [item.fromJSON(_p.equipment.shoulder.itemJSON), enchant.fromJSON(_p.equipment.shoulder.enchantJSON)],
    [item.fromJSON(_p.equipment.legs.itemJSON), enchant.fromJSON(_p.equipment.legs.enchantJSON)],
    [item.fromJSON(_p.equipment.back.itemJSON), enchant.fromJSON(_p.equipment.back.enchantJSON)],
    [item.fromJSON(_p.equipment.feet.itemJSON), enchant.fromJSON(_p.equipment.feet.enchantJSON)],
    [item.fromJSON(_p.equipment.chest.itemJSON), enchant.fromJSON(_p.equipment.chest.enchantJSON)],
    [item.fromJSON(_p.equipment.wrist.itemJSON), enchant.fromJSON(_p.equipment.wrist.enchantJSON)],
    [item.fromJSON(_p.equipment.finger.itemJSON), enchant.fromJSON(_p.equipment.finger.enchantJSON)],
    [item.fromJSON(_p.equipment.finger2.itemJSON), enchant.fromJSON(_p.equipment.finger2.enchantJSON)],
    [item.fromJSON(_p.equipment.mainhand.itemJSON), enchant.fromJSON(_p.equipment.mainhand.enchantJSON)],
    [item.fromJSON(_p.equipment.offhand.itemJSON), enchant.fromJSON(_p.equipment.offhand.enchantJSON)],
    [item.fromJSON(_p.equipment.trinket.itemJSON), enchant.fromJSON(_p.equipment.trinket.enchantJSON)],
    [item.fromJSON(_p.equipment.trinket2.itemJSON), enchant.fromJSON(_p.equipment.trinket2.enchantJSON)],
    [item.fromJSON(_p.equipment.idol.itemJSON), enchant.fromJSON(_p.equipment.idol.enchantJSON)],
    [item.fromJSON(), enchant.fromJSON()],
    [item.fromJSON(), enchant.fromJSON()]
  ]

  gearObj.items = item.fromJSONArray(_e.items ? _e.items : [])
  gearObj.enchants = enchant.fromJSONArray(_e.enchants ? _e.enchants : [])

  const encounter: Encounter = {
    dps: dpsObj,
    weights: weightsObj,
    gear: gearObj,
    player: playerObj,
    spell: spellObj,
    target: targetObj
  }

  return encounter
}

/* go through all current steps of moonkin-calc, and re-write them straight into this single function.
 * after that we can see the best way to modularize. */
const run2 = (settings: Settings): Encounter => {
  const encounter = {} as Encounter

  if (settings.debug) {
    console.log(`hey it's debug`)
  }

  return encounter
}

export default {
  defaultSettings: defaultSettings,
  run: run,
  run2: run2
}
