import common from '../common'
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
import CommonNumberResult from '../interface/CommonNumberResult'
import CommonStringResult from '../interface/CommonStringResult'
import SpellDamage from '../interface/SpellDamage'
import SpellDamageSimple from '../interface/SpellDamageSimple'

import PlayableSpec from '../enum/PlayableSpec'
import spell from './spell'

// FIXME: remove. just call the thing with settings.defaults.
const defaultSettings = (spec?: PlayableSpec): Settings => {
  return common.settings.fromDefaults(spec ? { playerSpec: spec } : undefined)
}

const statsDefault = (): Stats => {
  return {
    health: common.calc.commonNumberResultFromDefault(),
    mana: common.calc.commonNumberResultFromDefault(),
    stamina: common.calc.commonNumberResultFromDefault(),
    intellect: common.calc.commonNumberResultFromDefault(),
    spirit: common.calc.commonNumberResultFromDefault(),
    mp5: common.calc.commonNumberResultFromDefault(),
    spellHit: common.calc.commonNumberResultFromDefault(),
    spellCrit: common.calc.commonNumberResultFromDefault(),
    spellPenetration: common.calc.commonNumberResultFromDefault(),
    spellDamage: spellDamageDefault(),
    resistances: resistancesDefault()
  }
}

const resistancesDefault = (): Resistances => {
  return {
    spellResistance: common.calc.commonNumberResultFromDefault(),
    arcaneResistance: common.calc.commonNumberResultFromDefault(),
    fireResistance: common.calc.commonNumberResultFromDefault(),
    frostResistance: common.calc.commonNumberResultFromDefault(),
    natureResistance: common.calc.commonNumberResultFromDefault(),
    shadowResistance: common.calc.commonNumberResultFromDefault()
  }
}

const spellDamageDefault = (): SpellDamage => {
  return {
    spellDamage: common.calc.commonNumberResultFromDefault(),
    arcaneDamage: common.calc.commonNumberResultFromDefault(),
    fireDamage: common.calc.commonNumberResultFromDefault(),
    frostDamage: common.calc.commonNumberResultFromDefault(),
    natureDamage: common.calc.commonNumberResultFromDefault(),
    shadowDamage: common.calc.commonNumberResultFromDefault(),
    holyDamage: common.calc.commonNumberResultFromDefault()
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
    min: common.calc.commonNumberResultFromDefault(),
    max: common.calc.commonNumberResultFromDefault(),
    avg: common.calc.commonNumberResultFromDefault(),
    text: common.calc.commonStringResultFromDefault()
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
    base: common.calc.baseSpellCrit,
    actual: common.calc.baseSpellCrit + _sc.player.spellCritFromIntellect + _sc.player.spellCritFromEquipment,
    effective:
      common.calc.baseSpellCrit +
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
    [gearItem.fromItemJSON(_p.equipment.head.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.head.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.hands.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.hands.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.neck.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.neck.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.waist.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.waist.enchantJSON)],
    [
      gearItem.fromItemJSON(_p.equipment.shoulder.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.shoulder.enchantJSON)
    ],
    [gearItem.fromItemJSON(_p.equipment.legs.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.legs.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.back.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.back.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.feet.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.feet.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.chest.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.chest.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.wrist.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.wrist.enchantJSON)],
    [gearItem.fromItemJSON(_p.equipment.finger.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.finger.enchantJSON)],
    [
      gearItem.fromItemJSON(_p.equipment.finger2.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.finger2.enchantJSON)
    ],
    [
      gearItem.fromItemJSON(_p.equipment.mainhand.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.mainhand.enchantJSON)
    ],
    [
      gearItem.fromItemJSON(_p.equipment.offhand.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.offhand.enchantJSON)
    ],
    [
      gearItem.fromItemJSON(_p.equipment.trinket.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.trinket.enchantJSON)
    ],
    [
      gearItem.fromItemJSON(_p.equipment.trinket2.itemJSON),
      gearEnchant.fromEnchantJSON(_p.equipment.trinket2.enchantJSON)
    ],
    [gearItem.fromItemJSON(_p.equipment.idol.itemJSON), gearEnchant.fromEnchantJSON(_p.equipment.idol.enchantJSON)],
    [gearItem.fromItemJSON(), gearEnchant.fromEnchantJSON()],
    [gearItem.fromItemJSON(), gearEnchant.fromEnchantJSON()]
  ]

  gearObj.items = gearItem.fromItemJSONArray(_e.items ? _e.items : [])
  gearObj.enchants = gearEnchant.fromEnchantJSONArray(_e.enchants ? _e.enchants : [])

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
