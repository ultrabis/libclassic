/**
 * Assortment of common functions
 * None of these functions require the database files in 'db'
 * The idea is to allow creation of smaller builds
 */
import utils from './utils'
import MoonkinDefaults from '../obj/moonkin-settings.json'

import CalcOpts from '../interface/CalcOpts'
import Settings from '../interface/Settings'
import ManaRegen from '../interface/ManaRegen'
import CommonNumberResult from '../interface/CommonNumberResult'
import CommonStringResult from '../interface/CommonStringResult'
import CastDmgObject from '../interface/CastDmgObject'
import CastDmgValues from '../interface/CastDmgValues'
/*
import SpellDamageTrio from '../interface/SpellDamageTrio'
import StatsTrio from '../interface/StatsTrio'
import Weights from '../interface/Weights'
*/

/* enums. we want common ways to work with these */
import GearSlot from '../enum/GearSlot'
import ItemClass from '../enum/ItemClass'
import ItemQuality from '../enum/ItemQuality'
import ItemSuffixType from '../enum/ItemSuffixType'
import ItemBonusType from '../enum/ItemBonusType'
import ArmorSubclass from '../enum/ArmorSubclass'
import WeaponSubclass from '../enum/WeaponSubclass'
import ItemSlot from '../enum/ItemSlot'
import Raid from '../enum/Raid'
import WorldBoss from '../enum/WorldBoss'
import Buff from '../enum/Buff'
import Faction from '../enum/Faction'
import Gender from '../enum/Gender'
import MagicSchool from '../enum/MagicSchool'
import PlayableClass from '../enum/PlayableClass'
import PlayableRace from '../enum/PlayableRace'
import PlayableSpec from '../enum/PlayableSpec'
import PowerType from '../enum/PowerType'
import PvPRank from '../enum/PvPRank'
import SortOrder from '../enum/SortOrder'
import TargetType from '../enum/TargetType'

/**
 * first lets define some constants
 */
const globalCooldown = 1.5
const playerLevelCap = 60 // FIXME: needs to be a function for tbc/wotlk
const spellHitCap = 16
const spellCritCap = 100

/**
 * Players have some amount of 'base spell crit' based on class.
 *
 * Sources:
 *
 * http://blue.cardplace.com/cache/wow-mage/1009382.htm
 * http://blue.cardplace.com/cache/wow-general/8532087.htm
 * http://blue.cardplace.com/cache/wow-mage/559324.htm
 *
 * FIXME: Convert into function with class input
 *
 */
const baseSpellCrit = 1.8
const baseSpellCritMultiplier = 1.5

/* some common object types */
const commonNumberResultFromDefault = (): CommonNumberResult => {
  return {
    base: 0,
    actual: 0,
    effective: 0
  }
}

const isCommonNumberResult = (result: CommonNumberResult | number): result is CommonNumberResult => {
  return (result as CommonNumberResult).base !== undefined
}

const commonStringResultFromDefault = (): CommonStringResult => {
  return {
    base: '',
    actual: '',
    effective: ''
  }
}

const castDmgValuesFromDefault = (): CastDmgValues => {
  return {
    min: 0,
    max: 0,
    avg: 0,
    text: '',
    tick: 0,
    total: 0,
    dps: 0,
    tickText: '',
    totalText: ''
  }
}

const castDmgObjectFromDefault = (): CastDmgObject => {
  return {
    base: castDmgValuesFromDefault(),
    actual: castDmgValuesFromDefault(),
    effective: castDmgValuesFromDefault()
  }
}

/**
 *
 * returns copy of default Settings. these can be passed to libclassic.run().
 *
 * @param opts.playerSpec optionally specify spec
 */
const defaultSettings = (opts?: { playerSpec: PlayableSpec }): Settings => {
  if (!opts) {
    return utils.cloneObject(MoonkinDefaults)
  }

  switch (opts.playerSpec) {
    case PlayableSpec.Moonkin:
    default:
      return utils.cloneObject(MoonkinDefaults)
  }
}

/**
 * FIXME: A dumb function to be replaced with Talent object.
 * in the future functions will take objects as input e.g.
 * Talent, Spell, Player, etc
 */
const calcOptsFromSettings = (s: Settings): CalcOpts => {
  const o: CalcOpts = {}

  if (s.game.type) {
    o.gameType = s.game.type
  }

  if (s.player.talents.vengeanceRank) {
    o.vengeanceRank = s.player.talents.vengeanceRank
  }

  if (s.player.talents.moonFuryRank) {
    o.moonFuryRank = s.player.talents.moonFuryRank
  }

  if (s.player.talents.improvedMoonfireRank) {
    o.improvedMoonfireRank = s.player.talents.improvedMoonfireRank
  }

  if (s.player.talents.reflectionRank) {
    o.reflectionRank = s.player.talents.reflectionRank
  }

  return o
}

/**
 *
 *
 * @param playerClass e.g. `PlayableClass.Druid`
 */
const spellCritFromIntellectDivisor = (playerClass: PlayableClass): number => {
  switch (playerClass) {
    case PlayableClass.Druid:
      return 60
    case PlayableClass.Warlock:
      return 60.6
    case PlayableClass.Shaman:
      return 59.5
    case PlayableClass.Mage:
      return 59.5
    case PlayableClass.Priest:
      return 59.2
    case PlayableClass.Paladin:
      return 54
    default:
      return -1
  }
}

/**
 *
 * Returns the chance of a spell hitting a target, not accounting for the players spellHit stat.
 *
 * @remarks
 *
 * @param playerLevel
 * @param targetLevel
 */
const spellBaseChanceToHit = (playerLevel: number, targetLevel: number): number => {
  const x = targetLevel - playerLevel

  switch (x) {
    case -3:
      return 99
    case -2:
      return 98
    case -1:
      return 97
    case 0:
      return 96
    case 1:
      return 95
    case 2:
      return 94
    case 3:
      return 83
    default:
      return x > 3 ? 83 : 99
  }
}

/**
 *
 * Returns chance of hitting a target with a spell.
 *
 * @remarks
 * Example: console.log(libclassic.common.spellChanceToHit(60, 63, 12))
 *
 * @param playerLevel player level
 * @param targetLevel target level
 * @param spellHit player spell hit (total effective)
 * @returns A number between '0' and '99'.
 */
const spellChanceToHit = (playerLevel: number, targetLevel: number, spellHit: number): number => {
  return Math.min(99, spellBaseChanceToHit(playerLevel, targetLevel) + spellHit)
}

/**
 *
 * Returns chance of missing a target with a spell.
 *
 * @remarks
 *
 * @param playerLevel
 * @param targetLevel
 * @param spellHit
 * @returns A number between '1' and '100'.
 */
const spellChanceToMiss = (playerLevel: number, targetLevel: number, spellHit: number): number => {
  return Math.max(1, 100 - spellChanceToHit(playerLevel, targetLevel, spellHit))
}

/**
 *
 * Returns chance of critical striking a target with a spell.
 *
 * @param playerLevel
 * @param targetLevel
 * @param spellHit
 * @param spellCrit can be base, actual or effective
 * @returns spellCrit multiplied by the chance of hitting.
 */
const spellChanceToCrit = (playerLevel: number, targetLevel: number, spellHit: number, spellCrit: number): number => {
  return spellCrit * (spellChanceToHit(playerLevel, targetLevel, spellHit) / 100)
}

/**
 *
 * Returns chance of normal striking a target with a spell.
 *
 *
 * @param playerLevel
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns Chance of hitting minus chance of critting.
 */
const spellChanceToNormal = (playerLevel: number, targetLevel: number, spellHit: number, spellCrit: number): number => {
  return (
    spellChanceToHit(playerLevel, targetLevel, spellHit) -
    spellChanceToCrit(playerLevel, targetLevel, spellHit, spellCrit)
  )
}

/**
 * The spell crit multiplier bonus of certain talents, etc
 *
 * @param opts.veneanceRank
 */
const spellCritBonusMultiplier = (opts?: CalcOpts): number => {
  let x = 0

  if (opts && opts.vengeanceRank) {
    switch (opts.vengeanceRank) {
      case 1:
        x += 0.1 // rank 1: Increases the critical strike damage bonus by 20%
        break
      case 2:
        x += 0.2 // rank 2: Increases the critical strike damage bonus by 40%
        break
      case 3:
        x += 0.3 // rank 3: Increases the critical strike damage bonus by 60%
        break
      case 4:
        x += 0.4 // rank 4: Increases the critical strike damage bonus by 80%
        break
      case 5:
        x += 0.5 // rank 5: Increases the critical strike damage bonus by 100%
        break
    }
  }

  return x
}

/**
 * The effective spell crit multiplier
 *
 * @param spellName
 * @param opts
 */
const spellCritMultiplier = (opts?: CalcOpts): number => {
  return baseSpellCritMultiplier + spellCritBonusMultiplier(opts)
}

/**
 * The dmg multiplier applied to spell
 *
 * @param spellName
 * @param additional
 * @param opts.moonFuryRank
 * @param opts.improvedMoonfireRank
 */
const spellDmgMultiplier = (spellName: string, additionalMultipliers: number, opts?: CalcOpts): CommonNumberResult => {
  const r = {} as CommonNumberResult
  r.base = 1.0

  if (opts && utils.fuzzyIncludes(spellName, 'moonfire, starfire, wrath')) {
    switch (opts.moonFuryRank) {
      case 1:
        r.base *= 1.02 // rank 1: 2% bonus
        break
      case 2:
        r.base *= 1.04 // rank 2: 4% bonus
        break
      case 3:
        r.base *= 1.06 // rank 3: 6% bonus
        break
      case 4:
        r.base *= 1.08 // rank 4: 8% bonus
        break
      case 5:
        r.base *= 1.1 // rank 5: 10% bonus
        break
    }
  }

  if (opts && utils.fuzzyIncludes(spellName, 'moonfire')) {
    switch (opts.improvedMoonfireRank) {
      case 1:
        r.base *= 1.02 // rank 1: 2% bonus
        break
      case 2:
        r.base *= 1.04 // rank 2: 4% bonus
        break
      case 3:
        r.base *= 1.06 // rank 3: 6% bonus
        break
      case 4:
        r.base *= 1.08 // rank 4: 8% bonus
        break
      case 5:
        r.base *= 1.1 // rank 5: 10% bonus
        break
    }
  }

  r.effective = r.base * Math.min(additionalMultipliers, 1.0)
  return r
}

/*
const spellDmg = (spellName: string, dmg: number, additionalMultipliers: number, opts?: CalcOpts) => {
  const r: CommonNumberResult = {} as CommonNumberResult
  const m: CommonNumberResult = spellDmgMultiplier(spellName, additionalMultipliers, opts)

  r.base = dmg * (m.base ? m.base : 1.0)
  r.effective = dmg * (m.effective ? m.effective : 1.0)
}
*/

/**
 *
 * This is the spells damage listed in the spellbook. `dmg` can be minDmg, maxDmg, or avgDmg
 *
 * @param spellName
 * @param dmg
 * @param opts.moonFuryRank
 * @param opts.improvedMoonfireRank
 */
const spellDmgBase = (spellName: string, dmg: number, opts?: CalcOpts): number => {
  const m: CommonNumberResult = spellDmgMultiplier(spellName, 0, opts)
  return dmg * (m.base ? m.base : 1.0)
}

/**
 * For non-binary spells only: Each difference in level gives a 2% resistance chance that cannot
 * be negated (by spell penetration or otherwise).
 *
 * @param playerLevel
 * @param targetLevel
 * @returns Unmitigatable target resistance
 */
const targetSpellResistanceFromLevel = (playerLevel: number, targetLevel: number, binarySpell: boolean): number => {
  if (binarySpell) {
    return 0
  }

  return (targetLevel > playerLevel ? targetLevel - playerLevel : 0) * parseFloat((0.1333 * playerLevel).toFixed(2))
}

/**
 *
 * Total spell resistance of target. Factors in binary vs non-binary spell and
 * the targets unmitigatable resistance based on level.
 *
 * @param playerLevel
 * @param playerSpellPenetration
 * @param targetLevel
 * @param targetBaseSpellResistance
 *
 */
const targetSpellResistance = (
  playerLevel: number,
  playerSpellPenetration: number,
  targetLevel: number,
  targetBaseSpellResistance: number,
  binarySpell: boolean
): number => {
  const fromLevel = targetSpellResistanceFromLevel(playerLevel, targetLevel, binarySpell)
  const sr = Math.min(targetBaseSpellResistance, 5 * playerLevel - fromLevel)
  return sr - Math.min(playerSpellPenetration, sr) + fromLevel
}

/**
 *
 * Average partial resistance penalty of spells that hit target
 *
 * https://dwarfpriest.wordpress.com/2008/01/07/spell-hit-spell-penetration-and-resistances/#more-176
 *
 * @param playerLevel
 * @param playerSpellPenetration
 * @param targetLevel
 * @param targetBaseSpellResistance
 * @param binarySpell
 *
 * @returns Multiplier to be applied over the spells total damage
 */
const spellPartialResistAvg = (
  playerLevel: number,
  playerSpellPenetration: number,
  targetLevel: number,
  targetBaseSpellResistance: number,
  binarySpell: boolean
): number => {
  const sr = targetSpellResistance(
    playerLevel,
    playerSpellPenetration,
    targetLevel,
    targetBaseSpellResistance,
    binarySpell
  )
  return (0.75 * sr) / (5 * playerLevel)
}

/**
 *
 * Mana restored each tick
 *
 * @param playerLevel
 * @param playerSpirit
 * @param playerMp5
 * @param opts.reflectionRank
 */
const playerManaRegen = (playerLevel: number, playerSpirit: number, playerMp5: number, opts?: CalcOpts): ManaRegen => {
  const manaRegen: ManaRegen = {} as ManaRegen

  let reflectionBonus = 0
  if (opts) {
    switch (opts.reflectionRank) {
      case 1:
        reflectionBonus = 0.05
        break
      case 2:
        reflectionBonus = 0.1
        break
      case 3:
        reflectionBonus = 0.15
        break
    }
  }

  /* not casting */
  manaRegen.notCasting.base = (15 * playerLevel) / 60
  manaRegen.notCasting.fromSpirit = playerSpirit / 5
  manaRegen.notCasting.fromMp5 = playerMp5 ? (playerMp5 / 5) * 2 : 0
  manaRegen.notCasting.effective =
    manaRegen.notCasting.base + manaRegen.notCasting.fromSpirit + manaRegen.notCasting.fromMp5

  /* casting */
  manaRegen.casting.base = manaRegen.notCasting.base * reflectionBonus
  manaRegen.casting.fromSpirit = manaRegen.notCasting.fromSpirit * reflectionBonus
  manaRegen.casting.fromMp5 = manaRegen.notCasting.fromMp5
  manaRegen.casting.effective = manaRegen.casting.base + manaRegen.casting.fromSpirit + manaRegen.casting.fromMp5

  /* other */
  manaRegen.innervate = manaRegen.notCasting.effective * 4
  manaRegen.innervateFullDuration = manaRegen.innervate * 10

  return manaRegen
}

/*
// base is total from gear, actual applies magic school, effective applies bonus (flasks and elixir)
// FIXME: add missing schools
const spellDamage = (baseSpellDamage: SpellDamage, magicSchool: MagicSchool, effectiveBonus: number): SpellDamage => {
  const mySpellDamage: SpellDamage = utils.cloneObject(baseSpellDamage)

  if (isCommonNumberResult(baseSpellDamage.spellDamage)) {
    return mySpellDamage
  }

  switch (magicSchool) {
    case MagicSchool.Arcane:
      mySpellDamage.arcaneDamage.actual =
        (mySpellDamage.spellDamage.base ? mySpellDamage.spellDamage.base : 0) +
        (mySpellDamage.arcaneDamage.base ? mySpellDamage.arcaneDamage.base : 0)
      mySpellDamage.arcaneDamage.effective = mySpellDamage.arcaneDamage.actual + effectiveBonus
      mySpellDamage.spellDamage.actual = mySpellDamage.arcaneDamage.actual
      mySpellDamage.spellDamage.effective = mySpellDamage.arcaneDamage.effective
      break
    case MagicSchool.Nature:
      mySpellDamage.natureDamage.actual =
        (mySpellDamage.spellDamage.base ? mySpellDamage.spellDamage.base : 0) +
        (mySpellDamage.natureDamage.base ? mySpellDamage.natureDamage.base : 0)
      mySpellDamage.natureDamage.effective = mySpellDamage.natureDamage.actual + effectiveBonus
      mySpellDamage.spellDamage.actual = mySpellDamage.natureDamage.actual
      mySpellDamage.spellDamage.effective = mySpellDamage.natureDamage.effective
      break
    case MagicSchool.Fire:
    case MagicSchool.Frost:
    case MagicSchool.Shadow:
    case MagicSchool.Holy:
      break
  }

  return mySpellDamage
}
*/

/*
const weightScore = (stats: Stats, weights: Weights) {


}
*/

/*
const weightScore = (stats: Stats, Weights: Weights, playerClass: PlayableClass, targetType: TargetType, magicSchool: MagicSchool) => {

  const total = stats.spellDamage.spellDamage.effective

  static score(
    magicSchool: MagicSchool,
    spellDamage: number,
    arcaneDamage: number,
    natureDamage: number,
    spellHit: number,
    spellCrit: number,
    intellect: number,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    const totalScore =
      spellDamage +
      (magicSchool && magicSchool === MagicSchool.Arcane ? arcaneDamage : 0) +
      (magicSchool && magicSchool === MagicSchool.Nature ? natureDamage : 0) +
      spellHit * spellHitWeight +
      spellCrit * spellCritWeight +
      (intellect / SpellCritFromIntellectDivisor.Druid) * spellCritWeight

    return parseFloat(totalScore.toFixed(3))
  }
}

*/

const factionFromRace = (race: PlayableRace): Faction => {
  switch (race) {
    case PlayableRace.Tauren:
    case PlayableRace.Orc:
    case PlayableRace.Undead:
    case PlayableRace.Troll:
      return Faction.Horde
    default:
      return Faction.Alliance
  }
}

// console.log(libclassic.enums.gearSlotFromText('waist'))
const gearSlotFromText = (text: string): GearSlot => {
  const _ = (text: string): typeof GearSlot[keyof typeof GearSlot] => {
    return Number(utils.getEnumValueFromFuzzyText(GearSlot, text))
  }
  return _(text)
}

const gearSlotFromItemSlot = (itemSlot: ItemSlot): GearSlot => {
  switch (itemSlot) {
    case ItemSlot.Onehand:
    case ItemSlot.Twohand:
    case ItemSlot.Mainhand:
      return GearSlot.Mainhand
    case ItemSlot.Head:
      return GearSlot.Head
    case ItemSlot.Neck:
      return GearSlot.Neck
    case ItemSlot.Shoulder:
      return GearSlot.Shoulder
    case ItemSlot.Chest:
      return GearSlot.Chest
    case ItemSlot.Waist:
      return GearSlot.Waist
    case ItemSlot.Legs:
      return GearSlot.Legs
    case ItemSlot.Feet:
      return GearSlot.Feet
    case ItemSlot.Wrist:
      return GearSlot.Wrist
    case ItemSlot.Hands:
      return GearSlot.Hands
    case ItemSlot.Finger:
      return GearSlot.Finger
    case ItemSlot.Finger2:
      return GearSlot.Finger2
    case ItemSlot.Trinket:
      return GearSlot.Trinket
    case ItemSlot.Trinket2:
      return GearSlot.Trinket
    case ItemSlot.Ranged:
      return GearSlot.Ranged
    case ItemSlot.Offhand:
      return GearSlot.Offhand
    case ItemSlot.Ranged:
      return GearSlot.Ranged
    case ItemSlot.Relic:
      return GearSlot.Relic
    case ItemSlot.Quiver:
      return GearSlot.Quiver
    default:
      return 0
  }
}

// console.log(libclassic.enums.raidFromText('zulgurub'))
const raidFromText = (text: string): Raid => {
  const _ = (text: string): typeof Raid[keyof typeof Raid] => {
    return Number(utils.getEnumValueFromFuzzyText(Raid, text))
  }
  return _(text)
}

// console.log(libclassic.enums.raidsFromText('zulgurub'))
const raidsFromText = (text: string): Raid[] => {
  const _ = (text: string): typeof Raid[keyof typeof Raid][] => {
    return utils.getEnumValuesFromFuzzyText(Raid, text)
  }
  return _(text)
}

// console.log(libclassic.enums.worldBossFromText('azuregos'))
const worldBossFromText = (text: string): WorldBoss => {
  const _ = (text: string): typeof WorldBoss[keyof typeof WorldBoss] => {
    return Number(utils.getEnumValueFromFuzzyText(WorldBoss, text))
  }
  return _(text)
}

// console.log(libclassic.enums.worldBossesFromText('azuregos'))
const worldBossesFromText = (text: string): WorldBoss[] => {
  const _ = (text: string): typeof WorldBoss[keyof typeof WorldBoss][] => {
    return utils.getEnumValuesFromFuzzyText(WorldBoss, text)
  }
  return _(text)
}

// console.log(libclassic.enums.pvpRankFromText('scout'))
const pvpRankFromText = (text: string): PvPRank => {
  const _ = (text: string): typeof PvPRank[keyof typeof PvPRank] => {
    return Number(utils.getEnumValueFromFuzzyText(PvPRank, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableRaceFromText('nightelf'))
const playableRaceFromText = (text: string): PlayableRace => {
  const _ = (text: string): typeof PlayableRace[keyof typeof PlayableRace] => {
    return Number(utils.getEnumValueFromFuzzyText(PlayableRace, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableClassFromText('rogue'))
const playableClassFromText = (text: string): PlayableClass => {
  const _ = (text: string): typeof PlayableClass[keyof typeof PlayableClass] => {
    return Number(utils.getEnumValueFromFuzzyText(PlayableClass, text))
  }
  return _(text)
}

// console.log(libclassic.enums.playableClassesFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const playableClassesFromText = (text: string): PlayableClass[] => {
  const _ = (text: string): typeof PlayableClass[keyof typeof PlayableClass][] => {
    return utils.getEnumValuesFromFuzzyText(PlayableClass, text)
  }
  return _(text)
}
// console.log(libclassic.enums.itemBonusTypeFromText('arcane spell damage'))
const itemBonusTypeFromText = (text: string): ItemBonusType => {
  const _ = (text: string): typeof ItemBonusType[keyof typeof ItemBonusType] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemBonusType, text))
  }
  return _(text)
}

// console.log(libclassic.common.itemSuffixTypeFromText('cape of arcane wrath'))
// console.log(libclassic.common.itemSuffixTypeFromText('Talisman of Ephemeral Power'))

const itemSuffixTypeFromText = (text: string): ItemSuffixType => {
  const of = text.toUpperCase().indexOf(' OF ')
  // console.log(`of = ${of}, r = ${r}, t = ${t}`)

  if (of === -1) {
    // text is not an item name with a suffix e.g. "High Warlord's Destroyer"
    // in that case we do a loose search for any matching key, which will return Invalid
    return Number(utils.getEnumValueFromFuzzyText(ItemSuffixType, text))
  }

  // text is an item name with a suffix e.g. "Talisman of Ephemeral Power"
  // in that case it will strict search for "Ephemeral Power", which will return Invalid
  return Number(utils.getEnumValueFromFuzzyText(ItemSuffixType, text.slice(of + 4), true))
}

/**
 *
 * Convert names like "Master's Hat of Arcane Wrath" to "Master's Hat"
 * Names without a real suffix will keep their original
 *
 * @param itemName
 */
const itemBaseName = (itemName: string): string => {
  const itemSuffixType = itemSuffixTypeFromText(itemName)
  if (itemSuffixType === ItemSuffixType.Invalid) {
    return itemName
  }

  const of = itemName.toUpperCase().indexOf(' OF ')
  return itemName.slice(0, of)
}

// console.log(libclassic.enums.itemQualitypeFromText('Classes: Priest, Shaman, Mage, Warlock, Druid'))
const itemQualityFromText = (text: string): ItemQuality => {
  const _ = (text: string): typeof ItemQuality[keyof typeof ItemQuality] => {
    return Number(utils.getEnumValueFromFuzzyText(ItemQuality, text))
  }
  return _(text)
}

// console.log(libclassic.enums.buffFromText('moonkin aura'))
const buffFromText = (text: string): Buff => {
  const _ = (text: string): typeof Buff[keyof typeof Buff] => {
    return Number(utils.getEnumValueFromFuzzyText(Buff, text))
  }
  return _(text)
}

// console.log(libclassic.enums.buffsFromText('moonkin aura, power infusion'))
const buffsFromText = (text: string): Buff[] => {
  const _ = (text: string): typeof Buff[keyof typeof Buff][] => {
    return utils.getEnumValuesFromFuzzyText(Buff, text)
  }
  return _(text)
}

// console.log(libclassic.enums.buffMaskFromText('moonkin aura, power infusion'))
const buffMaskFromText = (text: string): number => {
  return utils.getEnumBitmaskFromFuzzyText(Buff, text)
}

// console.log(libclassic.enums.buffMaskIncludes(buffMask, Buff.MoonkinAura))
const buffMaskIncludes = (buffMask: number, buff: Buff): boolean => {
  return utils.bitMaskIncludes(buffMask, buff)
}

export default {
  /* enums */
  ArmorSubclass,
  Buff,
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
  TargetType,
  WeaponSubclass,
  ItemSuffixType,
  Raid,
  WorldBoss,
  /* from old 'enums' module */
  factionFromRace,
  gearSlotFromText,
  gearSlotFromItemSlot,
  raidFromText,
  raidsFromText,
  worldBossFromText,
  worldBossesFromText,
  pvpRankFromText,
  playableRaceFromText,
  playableClassFromText,
  playableClassesFromText,
  itemBaseName,
  itemBonusTypeFromText,
  itemSuffixTypeFromText,
  itemQualityFromText,
  buffFromText,
  buffsFromText,
  buffMaskFromText,
  buffMaskIncludes,
  /* from old 'calc' module */
  globalCooldown,
  playerLevelCap,
  baseSpellCrit,
  baseSpellCritMultiplier,
  spellHitCap,
  spellCritCap,
  defaultSettings,
  calcOptsFromSettings,
  commonNumberResultFromDefault,
  commonStringResultFromDefault,
  castDmgValuesFromDefault,
  castDmgObjectFromDefault,
  spellChanceToHit,
  spellChanceToMiss,
  spellChanceToCrit,
  spellChanceToNormal,
  spellPartialResistAvg,
  spellCritBonusMultiplier,
  spellCritMultiplier,
  spellCritFromIntellectDivisor,
  spellDmgMultiplier,
  spellDmgBase,
  spellBaseChanceToHit,
  // spellDamage,
  playerManaRegen,
  targetSpellResistanceFromLevel,
  targetSpellResistance
}
