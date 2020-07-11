import calc from './calc'
import settings from './settings'

import gearItem from './gearItem'
import gearEnchant from './gearEnchant'

import EncounterFIXME from '../class/Encounter'

import Encounter from '../interface/Encounter'
import Settings from '../interface/Settings'
import DPS from '../interface/DPS'
import Player from '../interface/Player'
import Gear from '../interface/Gear'
import Resistances from '../interface/Resistances'
import Stats from '../interface/Stats'
import Weights from '../interface/Weights'
import Target from '../interface/Target'
import Spell from '../interface/Spell'
import SpellDamage from '../interface/SpellDamage'
import SpellDamageSimple from '../interface/SpellDamageSimple'

import PlayableSpec from '../enum/PlayableSpec'
import spell from './spell'

// FIXME: remove. just call the thing with settings.defaults.
const defaultSettings = (spec?: PlayableSpec): Settings => {
  return settings.fromDefaults(spec ? { playerSpec: spec } : undefined)
}

const statsDefault = (): Stats => {
  return {
    health: calc.commonNumberResultFromDefault(),
    mana: calc.commonNumberResultFromDefault(),
    stamina: calc.commonNumberResultFromDefault(),
    intellect: calc.commonNumberResultFromDefault(),
    spirit: calc.commonNumberResultFromDefault(),
    mp5: calc.commonNumberResultFromDefault(),
    spellHit: calc.commonNumberResultFromDefault(),
    spellCrit: calc.commonNumberResultFromDefault(),
    spellPenetration: calc.commonNumberResultFromDefault(),
    spellDamage: spellDamageDefault(),
    resistances: resistancesDefault()
  }
}

const resistancesDefault = (): Resistances => {
  return {
    spellResistance: calc.commonNumberResultFromDefault(),
    arcaneResistance: calc.commonNumberResultFromDefault(),
    fireResistance: calc.commonNumberResultFromDefault(),
    frostResistance: calc.commonNumberResultFromDefault(),
    natureResistance: calc.commonNumberResultFromDefault(),
    shadowResistance: calc.commonNumberResultFromDefault()
  }
}

const spellDamageDefault = (): SpellDamage => {
  return {
    spellDamage: calc.commonNumberResultFromDefault(),
    arcaneDamage: calc.commonNumberResultFromDefault(),
    fireDamage: calc.commonNumberResultFromDefault(),
    frostDamage: calc.commonNumberResultFromDefault(),
    natureDamage: calc.commonNumberResultFromDefault(),
    shadowDamage: calc.commonNumberResultFromDefault(),
    holyDamage: calc.commonNumberResultFromDefault()
  }
}

const spellDamageSimpleDefault = (): SpellDamageSimple => {
  return {
    spellDamage: 0,
    arcaneDamage: 0,
    fireDamage: 0,
    frostDamage: 0,
    natureDamage: 0,
    shadowDamage: 0,
    holyDamage: 0
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

const playerDefault = (): Player => {
  return {
    stats: statsDefault()
  }
}

const targetDefault = (): Target => {
  return {
    stats: statsDefault()
  }
}

const dpsDefault = (): DPS => {
  return {
    min: calc.commonNumberResultFromDefault(),
    max: calc.commonNumberResultFromDefault(),
    avg: calc.commonNumberResultFromDefault(),
    text: calc.commonStringResultFromDefault()
  }
}

const gearDefault = () => {
  return {
    equipped: [],
    items: [],
    enchants: []
  }
}

// TODO: shim together with the existing classes, then keep replacing stuff until classes are no more
const run = (settings: Settings): Encounter => {
  const _e: EncounterFIXME = new EncounterFIXME(settings)
  const _sc = _e.spellCast
  const _p = _sc.player
  const targetObj: Target = targetDefault()
  const spellObj: Spell = spell.fromDefault()
  const weightsObj: Weights = weightsDefault()
  const gearObj: Gear = gearDefault()
  const playerObj: Player = playerDefault()
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
    base: calc.baseSpellCrit,
    actual: calc.baseSpellCrit + _sc.player.spellCritFromIntellect + _sc.player.spellCritFromEquipment,
    effective:
      calc.baseSpellCrit +
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

  gearObj.equipped = [
    [gearItem.fromJSON(_p.equipment.head.itemJSON), gearEnchant.fromJSON(_p.equipment.head.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.hands.itemJSON), gearEnchant.fromJSON(_p.equipment.hands.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.neck.itemJSON), gearEnchant.fromJSON(_p.equipment.neck.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.waist.itemJSON), gearEnchant.fromJSON(_p.equipment.waist.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.shoulder.itemJSON), gearEnchant.fromJSON(_p.equipment.shoulder.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.legs.itemJSON), gearEnchant.fromJSON(_p.equipment.legs.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.back.itemJSON), gearEnchant.fromJSON(_p.equipment.back.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.feet.itemJSON), gearEnchant.fromJSON(_p.equipment.feet.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.chest.itemJSON), gearEnchant.fromJSON(_p.equipment.chest.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.wrist.itemJSON), gearEnchant.fromJSON(_p.equipment.wrist.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.finger.itemJSON), gearEnchant.fromJSON(_p.equipment.finger.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.finger2.itemJSON), gearEnchant.fromJSON(_p.equipment.finger2.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.mainhand.itemJSON), gearEnchant.fromJSON(_p.equipment.mainhand.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.offhand.itemJSON), gearEnchant.fromJSON(_p.equipment.offhand.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.trinket.itemJSON), gearEnchant.fromJSON(_p.equipment.trinket.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.trinket2.itemJSON), gearEnchant.fromJSON(_p.equipment.trinket2.enchantJSON)],
    [gearItem.fromJSON(_p.equipment.idol.itemJSON), gearEnchant.fromJSON(_p.equipment.idol.enchantJSON)],
    [gearItem.fromJSON(), gearEnchant.fromJSON()],
    [gearItem.fromJSON(), gearEnchant.fromJSON()]
  ]

  gearObj.items = gearItem.fromJSONArray(_e.items ? _e.items : [])
  gearObj.enchants = gearEnchant.fromJSONArray(_e.enchants ? _e.enchants : [])

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

export default {
  defaultSettings: defaultSettings,
  run: run
}
