import common from '../common'
import gearItem from '../mt/gearItem'
import gearEnchant from '../mt/gearEnchant'

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
import CastDmgObject from '../interface/CastDmgObject'
import CommonNumberResult from '../interface/CommonNumberResult'
import CommonStringResult from '../interface/CommonStringResult'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'
import GearItem from '../interface/GearItem'
import GearEnchant from '../interface/GearEnchant'
import SpellDamage from '../interface/SpellDamage'
import SpellDamageSimple from '../interface/SpellDamageSimple'

import PlayableSpec from '../enum/PlayableSpec'

// FIXME: remove. just call the thing with settings.defaults.
const defaultSettings = (spec?: PlayableSpec): Settings => {
  return common.settings.defaults(spec ? { playerSpec: spec } : undefined)
}

const commonNumberDefault = (): CommonNumberResult => {
  return {
    base: 0,
    actual: 0,
    effective: 0
  }
}

const commonStringDefault = (): CommonStringResult => {
  return {
    base: '',
    actual: '',
    effective: ''
  }
}

// fixme
const castDmgObjectDefault = (): CastDmgObject => {
  return {
    base: {
      min: 0,
      max: 0,
      avg: 0,
      tick: 0,
      total: 0,
      dps: 0,
      text: '',
      tickText: '',
      totalText: ''
    },
    actual: {
      min: 0,
      max: 0,
      avg: 0,
      tick: 0,
      total: 0,
      dps: 0,
      text: '',
      tickText: '',
      totalText: ''
    },
    effective: {
      min: 0,
      max: 0,
      avg: 0,
      tick: 0,
      total: 0,
      dps: 0,
      text: '',
      tickText: '',
      totalText: ''
    }
  }
}

const statsDefault = (): Stats => {
  return {
    health: commonNumberDefault(),
    mana: commonNumberDefault(),
    stamina: commonNumberDefault(),
    intellect: commonNumberDefault(),
    spirit: commonNumberDefault(),
    mp5: commonNumberDefault(),
    spellHit: commonNumberDefault(),
    spellCrit: commonNumberDefault(),
    spellPenetration: commonNumberDefault(),
    spellDamage: spellDamageDefault(),
    resistances: resistancesDefault()
  }
}

const resistancesDefault = (): Resistances => {
  return {
    spellResistance: commonNumberDefault(),
    arcaneResistance: commonNumberDefault(),
    fireResistance: commonNumberDefault(),
    frostResistance: commonNumberDefault(),
    natureResistance: commonNumberDefault(),
    shadowResistance: commonNumberDefault()
  }
}

const spellDamageDefault = (): SpellDamage => {
  return {
    spellDamage: commonNumberDefault(),
    arcaneDamage: commonNumberDefault(),
    fireDamage: commonNumberDefault(),
    frostDamage: commonNumberDefault(),
    natureDamage: commonNumberDefault(),
    shadowDamage: commonNumberDefault(),
    holyDamage: commonNumberDefault()
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
    min: commonNumberDefault(),
    max: commonNumberDefault(),
    avg: commonNumberDefault(),
    text: commonStringDefault()
  }
}

const spellDefault = (): Spell => {
  return {
    name: '',
    rank: 0,
    type: '',
    magicSchool: 0,
    range: 0,
    manaCost: 0,
    reqLvl: 0,
    coefficient: {
      direct: 0,
      periodic: 0
    },
    isBinary: false,
    secondaryEffect: '',
    canCrit: false,
    canMiss: false,
    canPartialResist: false,
    castTime: {
      base: 0,
      actual: 0,
      effective: 0
    },
    dmg: {
      normal: castDmgObjectDefault(),
      crit: castDmgObjectDefault(),
      periodic: castDmgObjectDefault()
    }
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
  const target: Target = targetDefault()
  const spell: Spell = spellDefault()
  const weights: Weights = weightsDefault()
  const gear: Gear = gearDefault()
  const player: Player = playerDefault()
  const dps: DPS = dpsDefault()

  /* spell */
  spell.name = _sc.spell.name
  spell.rank = Number(_sc.spell.rank)
  spell.type = _sc.spell.type
  spell.magicSchool = _sc.spell.magicSchool
  spell.range = _sc.spell.range
  spell.manaCost = _sc.spell.manaCost
  spell.reqLvl = _sc.spell.reqLvl
  spell.coefficient = _sc.spell.coefficient
  spell.isBinary = _sc.spell.isBinary
  spell.secondaryEffect = _sc.spell.secondaryEffect ? _sc.spell.secondaryEffect : ''
  spell.canCrit = _sc.spell.canCrit
  spell.canMiss = _sc.spell.canMiss
  spell.canPartialResist = _sc.spell.canPartialResist
  spell.castTime = {
    base: _sc.spell.castTime,
    actual: _sc.castTime,
    effective: _sc.effectiveCastTime
  }

  spell.dmg = {
    normal: _sc.normalDmg,
    crit: _sc.critDmg,
    periodic: _sc.periodicDmg
  }

  /* DPS */
  dps.min.base = _sc.dps.base.min
  dps.min.actual = _sc.dps.actual.min
  dps.min.effective = _sc.dps.effective.min
  dps.max.base = _sc.dps.base.max
  dps.max.actual = _sc.dps.actual.max
  dps.max.effective = _sc.dps.effective.max
  dps.avg.base = _sc.dps.base.avg
  dps.avg.actual = _sc.dps.actual.avg
  dps.avg.effective = _sc.dps.effective.avg
  dps.text.base = `${_sc.dps.base.avg} (${_sc.dps.base.min} - ${_sc.dps.base.max})`
  dps.text.actual = `${_sc.dps.actual.avg} (${_sc.dps.actual.min} - ${_sc.dps.actual.max})`
  dps.text.effective = `${_sc.dps.effective.avg} (${_sc.dps.effective.min} - ${_sc.dps.effective.max})`

  /* Player */
  player.stats.health.effective = _sc.player.health
  player.stats.mana.effective = _sc.player.mana
  player.stats.stamina.effective = _sc.player.stamina
  player.stats.intellect.effective = _sc.player.intellect
  player.stats.spirit.effective = _sc.player.spirit
  player.stats.mp5.effective = _sc.player.mp5
  player.stats.spellCrit = {
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
  weights.spellHit = _sc.spellHitWeight
  weights.spellCrit = _sc.spellCritWeight
  weights.intellect = _sc.intWeight

  /* gear */
  // gear.equipped = [[0, 0]]

  gear.equipped = [
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

  gear.items = gearItem.fromItemJSONArray(_e.items ? _e.items : [])
  gear.enchants = gearEnchant.fromEnchantJSONArray(_e.enchants ? _e.enchants : [])

  const encounter: Encounter = {
    dps: dps,
    weights: weights,
    gear: gear,
    player: player,
    spell: spell,
    target: target
  }

  return encounter
}

export default {
  defaultSettings: defaultSettings,
  run: run
}
