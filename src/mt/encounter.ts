import common from '../common'
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

// FIXME:
const gearItemDefault = () => {
  return {
    id: 0,
    suffixId: 0,
    name: '',
    class: 0,
    subclass: 0,
    gearSlot: 0,
    itemSlot: 0,
    quality: 0,
    level: 0,
    reqLevel: 0,
    bop: false,
    unique: false,
    allowableClasses: [],
    targetTypes: 0,
    phase: 0,
    pvpRank: 0,
    icon: '',
    location: '',
    boss: '',
    raid: false,
    worldBoss: false,
    faction: 0,
    spellDamage: 0,
    arcaneDamage: 0,
    natureDamage: 0,
    spellHealing: 0,
    spellHit: 0,
    spellCrit: 0,
    spellPenetration: 0,
    stamina: 0,
    intellect: 0,
    spirit: 0,
    mp5: 0,
    armor: 0,
    durability: 0,
    minDmg: 0,
    maxDmg: 0,
    speed: 0,
    dps: 0,
    onUse: {}
  }
}

const gearDefault = () => {
  return {
    equipped: [],
    items: [],
    enchants: []
  }
}

const gearItemsFromItemJSONArray = (itemJSONArray: ItemJSON[]) => {
  const gearItems: GearItem[] = []

  for (let x = 0; x <= itemJSONArray.length; x++) {
    gearItems.push(gearItemFromItemJSON(itemJSONArray[x]))
  }

  return gearItems
}

const gearEnchantsFromEnchantJSONArray = (enchantJSONArray: EnchantJSON[]) => {
  const gearEnchants: GearEnchant[] = []

  for (let x = 0; x <= enchantJSONArray.length; x++) {
    gearEnchants.push(gearEnchantFromEnchantJSON(enchantJSONArray[x]))
  }

  return gearEnchants
}

// FIXME: These are really stupid. Just make default functions for both item and enchant,
// and use if() to set values. That way there's only one "default".
const gearItemFromItemJSON = (itemJSON?: ItemJSON) => {
  const gearItem: GearItem = gearItemDefault()

  if (!itemJSON) {
    return gearItem
  }

  gearItem.id = itemJSON.id ? itemJSON.id : 0
  gearItem.suffixId = itemJSON.suffixId ? itemJSON.suffixId : 0
  gearItem.name = itemJSON.name ? itemJSON.name : ''
  gearItem.class = itemJSON.class ? itemJSON.class : 0
  gearItem.subclass = itemJSON.subclass ? itemJSON.subclass : 0
  gearItem.itemSlot = itemJSON.itemSlot
  gearItem.gearSlot = common.enums.gearSlotFromItemSlot(gearItem.itemSlot)
  gearItem.quality = itemJSON.quality ? itemJSON.quality : 0
  gearItem.level = itemJSON.level ? itemJSON.level : 0
  gearItem.reqLevel = itemJSON.reqLevel ? itemJSON.reqLevel : 0
  gearItem.bop = itemJSON.bop ? itemJSON.bop : false
  gearItem.unique = itemJSON.unique ? itemJSON.unique : false
  gearItem.allowableClasses = itemJSON.allowableClasses ? itemJSON.allowableClasses : []
  gearItem.targetTypes = itemJSON.targetTypes ? itemJSON.targetTypes : 0
  gearItem.phase = itemJSON.phase ? itemJSON.phase : 0
  gearItem.pvpRank = itemJSON.pvpRank ? itemJSON.pvpRank : 0
  gearItem.icon = itemJSON.icon ? itemJSON.icon : ''
  gearItem.location = itemJSON.location ? itemJSON.location : ''
  gearItem.boss = itemJSON.boss ? itemJSON.boss : ''
  gearItem.raid = itemJSON.raid ? itemJSON.raid : false
  gearItem.worldBoss = itemJSON.worldBoss ? itemJSON.worldBoss : false
  gearItem.faction = itemJSON.faction ? itemJSON.faction : 0
  gearItem.spellDamage = itemJSON.spellDamage ? itemJSON.spellDamage : 0
  gearItem.arcaneDamage = itemJSON.arcaneDamage ? itemJSON.arcaneDamage : 0
  gearItem.natureDamage = itemJSON.natureDamage ? itemJSON.natureDamage : 0
  gearItem.spellHealing = itemJSON.spellHealing ? itemJSON.spellHealing : 0
  gearItem.spellHit = itemJSON.spellHit ? itemJSON.spellHit : 0
  gearItem.spellCrit = itemJSON.spellCrit ? itemJSON.spellCrit : 0
  gearItem.spellPenetration = itemJSON.spellPenetration ? itemJSON.spellPenetration : 0
  gearItem.stamina = itemJSON.stamina ? itemJSON.stamina : 0
  gearItem.intellect = itemJSON.intellect ? itemJSON.intellect : 0
  gearItem.spirit = itemJSON.spirit ? itemJSON.spirit : 0
  gearItem.mp5 = itemJSON.mp5 ? itemJSON.mp5 : 0
  gearItem.armor = itemJSON.armor ? itemJSON.armor : 0
  gearItem.durability = itemJSON.durability ? itemJSON.durability : 0
  gearItem.maxDmg = itemJSON.maxDmg ? itemJSON.maxDmg : 0
  gearItem.minDmg = itemJSON.minDmg ? itemJSON.minDmg : 0
  gearItem.speed = itemJSON.speed ? itemJSON.speed : 0
  gearItem.dps = itemJSON.dps ? itemJSON.dps : 0
  gearItem.onUse = itemJSON.onUse ? itemJSON.onUse : {}

  return gearItem
}

const gearEnchantFromEnchantJSON = (enchantJSON?: EnchantJSON): GearEnchant => {
  return {
    id: enchantJSON ? enchantJSON.id : 0,
    name: enchantJSON ? enchantJSON.name : '',
    gearSlot: enchantJSON ? common.enums.gearSlotFromItemSlot(enchantJSON.itemSlot) : 0,
    itemSlot: enchantJSON ? enchantJSON.itemSlot : 0,
    phase: enchantJSON ? enchantJSON.phase : 0,
    icon: enchantJSON ? enchantJSON.icon : '',
    score: 0,
    text: enchantJSON ? enchantJSON.text : '',
    exploit: enchantJSON && enchantJSON.exploit ? enchantJSON.exploit : false,
    spellHealing: enchantJSON && enchantJSON.spellHealing ? enchantJSON.spellHealing : 0,
    armor: enchantJSON && enchantJSON.armor ? enchantJSON.armor : 0,
    spellDamage: enchantJSON && enchantJSON.spellDamage ? enchantJSON.spellDamage : 0,
    arcaneDamage: enchantJSON && enchantJSON.arcaneDamage ? enchantJSON.arcaneDamage : 0,
    natureDamage: enchantJSON && enchantJSON.natureDamage ? enchantJSON.natureDamage : 0,
    spellHit: enchantJSON && enchantJSON.spellHit ? enchantJSON.spellHit : 0,
    spellCrit: enchantJSON && enchantJSON.spellCrit ? enchantJSON.spellCrit : 0,
    spellPenetration: enchantJSON && enchantJSON.spellPenetration ? enchantJSON.spellPenetration : 0,
    stamina: enchantJSON && enchantJSON.stamina ? enchantJSON.stamina : 0,
    intellect: enchantJSON && enchantJSON.intellect ? enchantJSON.intellect : 0,
    spirit: enchantJSON && enchantJSON.spirit ? enchantJSON.spirit : 0,
    mp5: enchantJSON && enchantJSON.mp5 ? enchantJSON.mp5 : 0
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
    [gearItemFromItemJSON(_p.equipment.head.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.head.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.hands.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.hands.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.neck.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.neck.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.waist.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.waist.enchantJSON)],
    [
      gearItemFromItemJSON(_p.equipment.shoulder.itemJSON),
      gearEnchantFromEnchantJSON(_p.equipment.shoulder.enchantJSON)
    ],
    [gearItemFromItemJSON(_p.equipment.legs.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.legs.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.back.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.back.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.feet.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.feet.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.chest.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.chest.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.wrist.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.wrist.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.finger.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.finger.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.finger2.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.finger2.enchantJSON)],
    [
      gearItemFromItemJSON(_p.equipment.mainhand.itemJSON),
      gearEnchantFromEnchantJSON(_p.equipment.mainhand.enchantJSON)
    ],
    [gearItemFromItemJSON(_p.equipment.offhand.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.offhand.enchantJSON)],
    [gearItemFromItemJSON(_p.equipment.trinket.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.trinket.enchantJSON)],
    [
      gearItemFromItemJSON(_p.equipment.trinket2.itemJSON),
      gearEnchantFromEnchantJSON(_p.equipment.trinket2.enchantJSON)
    ],
    [gearItemFromItemJSON(_p.equipment.idol.itemJSON), gearEnchantFromEnchantJSON(_p.equipment.idol.enchantJSON)],
    [gearItemFromItemJSON(), gearEnchantFromEnchantJSON()],
    [gearItemFromItemJSON(), gearEnchantFromEnchantJSON()]
  ]

  gear.items = gearItemsFromItemJSONArray(_e.items ? _e.items : [])
  gear.enchants = gearEnchantsFromEnchantJSONArray(_e.enchants ? _e.enchants : [])

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
