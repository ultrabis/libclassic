/* generic calculations that don't need the database (items and spells data)
   all functions have an optional last argument, the `CalcOpts` object.
   see param definitions in function comments 
 */

import utils from './utils'

import MagicSchool from '../enum/MagicSchool'

import CalcOpts from '../interface/CalcOpts'
import Settings from '../interface/Settings'
import ManaRegen from '../interface/ManaRegen'
import CommonNumberResult from '../interface/CommonNumberResult'
import CommonStringResult from '../interface/CommonStringResult'
import CastDmgObject from '../interface/CastDmgObject'
import CastDmgValues from '../interface/CastDmgValues'
import SpellDamage from '../interface/SpellDamage'
import Stats from '../interface/Stats'
import Weights from '../interface/Weights'
import PlayableClass from '../enum/PlayableClass'
import TargetType from '../enum/TargetType'

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

const globalCooldown = 1.5
const playerLevelCap = 60 /* FIXME: needs to be a function for tbc/wotlk */
const spellHitCap = 16
const spellCritCap = 100

/**
 * At level 60, caster classes have some expected amount of Int that will put them at 5% spell crit.
 * For example, to have 5% crit at 60 a mage needs 286 Int.  A 60 mage also needs 59.5 int to gain
 * 1 additional spell crit.  286/59.5=4.8067 which is less than 5, meaning mages have a base spell
 * crit of 5-(286/59.5)=0.1933. Likewise, a Shaman needs 160 int @ 60 for 5% crit, and 59.2 int for
 * 1 crit.  160/59.2=2.703 -> 5-(160/59.2)=2.2973 base spell crit
 *
 * http://blue.cardplace.com/cache/wow-mage/1009382.htm
 * http://blue.cardplace.com/cache/wow-general/8532087.htm
 * http://blue.cardplace.com/cache/wow-mage/559324.htm
 *
 */
const baseSpellCrit = 1.8 /* FIXME: should be a function with class as input*/
const baseSpellCritMultiplier = 1.5

/**
 *
 * Returns the chance of a spell hitting a target, not accounting for the players spellHit stat.
 *
 * @remarks
 * TODO: Assumes level 60 player level
 *
 * @param targetLevel
 * @param opts
 */
const spellBaseChanceToHit = (targetLevel: number, opts?: CalcOpts) => {
  switch (targetLevel) {
    case 63:
      return 83
    case 62:
      return 94
    case 61:
      return 95
    case 60:
      return 96
    case 59:
      return 97
    case 58:
      return 98
    default:
      return 99
  }
}

/**
 *
 * Returns chance of hitting a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 player level
 * Example: console.log(libclassic.calc.spellChanceToHit(63, 5))
 *
 * @param targetLevel target level
 * @param spellHit player spell hit (total effective)
 * @param opts
 * @returns A number between '0' and '99'.
 */
const spellChanceToHit = (targetLevel: number, spellHit: number, opts?: CalcOpts): number => {
  return Math.min(99, spellBaseChanceToHit(targetLevel, opts) + spellHit)
}

/**
 *
 * Returns chance of missing a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 player level
 *
 * @param targetLevel
 * @param spellHit
 * @param opts
 * @returns A number between '1' and '100'.
 */
const spellChanceToMiss = (targetLevel: number, spellHit: number, opts?: CalcOpts): number => {
  return Math.max(1, 100 - spellChanceToHit(targetLevel, spellHit, opts))
}

/**
 *
 * Returns chance of critical striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 player level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns spellCrit multiplied by the chance of hitting.
 */
const spellChanceToCrit = (targetLevel: number, spellHit: number, spellCrit: number, opts?: CalcOpts): number => {
  return spellCrit * (spellChanceToHit(targetLevel, spellHit, opts) / 100)
}

/**
 *
 * Returns chance of normal striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 player level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns Chance of hitting minus chance of critting.
 */
const spellChanceToNormal = (targetLevel: number, spellHit: number, spellCrit: number, opts?: CalcOpts): number => {
  return spellChanceToHit(targetLevel, spellHit, opts) - spellChanceToCrit(targetLevel, spellHit, spellCrit, opts)
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

// base is total from gear, actual applies magic school, effective applies bonus (flasks and elixir)
// FIXME: add missing schools
const spellDamage = (baseSpellDamage: SpellDamage, magicSchool: MagicSchool, effectiveBonus: number): SpellDamage => {
  const mySpellDamage: SpellDamage = utils.cloneObject(baseSpellDamage)

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

// const playerStats = () => {}

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
const commonNumberResultFromDefault = (): CommonNumberResult => {
  return {
    base: 0,
    actual: 0,
    effective: 0
  }
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

export default {
  globalCooldown,
  playerLevelCap,
  baseSpellCrit,
  baseSpellCritMultiplier,
  spellHitCap,
  spellCritCap,
  commonNumberResultFromDefault,
  commonStringResultFromDefault,
  castDmgValuesFromDefault,
  castDmgObjectFromDefault,
  calcOptsFromSettings,
  spellChanceToHit,
  spellChanceToMiss,
  spellChanceToCrit,
  spellChanceToNormal,
  spellPartialResistAvg,
  spellCritBonusMultiplier,
  spellCritMultiplier,
  spellDmgMultiplier,
  spellDmgBase,
  spellBaseChanceToHit,
  spellDamage,
  playerManaRegen,
  targetSpellResistanceFromLevel,
  targetSpellResistance
}
