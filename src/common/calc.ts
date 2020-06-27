/* generic calculations that don't need the database (items and spells data) */

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
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 */
const spellBaseChanceToHit = (targetLevel: number) => {
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
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @returns A number between '0' and '99'.
 */
const spellChanceToHit = (targetLevel: number, spellHit: number): number => {
  return Math.min(99, spellBaseChanceToHit(targetLevel) + spellHit)
}

/**
 *
 * Returns chance of missing a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @returns A number between '1' and '100'.
 */
const spellChanceToMiss = (targetLevel: number, spellHit: number): number => {
  return Math.max(1, 100 - spellChanceToHit(targetLevel, spellHit))
}

/**
 *
 * Returns chance of critical striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns spellCrit multiplied by the chance of hitting.
 */
const spellChanceToCrit = (targetLevel: number, spellHit: number, spellCrit: number): number => {
  return spellCrit * (spellChanceToHit(targetLevel, spellHit) / 100)
}

/**
 *
 * Returns chance of normal striking a target with a spell.
 *
 * @remarks
 * TODO: Assumes level 60 character level
 *
 * @param targetLevel
 * @param spellHit
 * @param spellCrit
 * @returns Chance of hitting minus chance of critting.
 */
const spellChanceToNormal = (targetLevel: number, spellHit: number, spellCrit: number): number => {
  return spellChanceToHit(targetLevel, spellHit) - spellChanceToCrit(targetLevel, spellHit, spellCrit)
}

/**
 * The spell crit multiplier bonus of certain talents, etc
 *
 * @param opts
 */
const spellCritBonusMultiplier = (opts?: { vengeanceRank?: number }): number => {
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
const spellCritMultiplier = (opts?: { vengeanceRank?: number }): number => {
  return baseSpellCritMultiplier + spellCritBonusMultiplier(opts)
}

/**
 *
 * The base damage multiplier of a spell. Some talents provide a bonus.
 *
 * @param spellName
 * @param opts
 */
const spellBaseDmgMultiplier = (
  spellName: string,
  opts?: { moonFuryRank: number; improvedMoonFireRank: number }
): number => {
  if (!opts) {
    return 1.0
  }

  let moonFuryBonus = 1.0
  switch (opts.moonFuryRank) {
    case 1:
      moonFuryBonus = 1.02 // rank 1: 2% bonus
      break
    case 2:
      moonFuryBonus = 1.04 // rank 2: 4% bonus
      break
    case 3:
      moonFuryBonus = 1.06 // rank 3: 6% bonus
      break
    case 4:
      moonFuryBonus = 1.08 // rank 4: 8% bonus
      break
    case 5:
      moonFuryBonus = 1.1 // rank 5: 10% bonus
      break
  }

  let improvedMoonFireBonus = 1.0
  switch (opts.improvedMoonFireRank) {
    case 1:
      improvedMoonFireBonus = 1.02 // rank 1: 2% bonus
      break
    case 2:
      improvedMoonFireBonus = 1.04 // rank 2: 4% bonus
      break
    case 3:
      improvedMoonFireBonus = 1.06 // rank 3: 6% bonus
      break
    case 4:
      improvedMoonFireBonus = 1.08 // rank 4: 8% bonus
      break
    case 5:
      improvedMoonFireBonus = 1.1 // rank 5: 10% bonus
      break
  }

  if (spellName.toUpperCase().includes('MOONFIRE')) {
    return moonFuryBonus * improvedMoonFireBonus
  } else if (spellName.toUpperCase().includes('STARFIRE')) {
    return moonFuryBonus
  } else if (spellName.toUpperCase().includes('WRATH')) {
    return moonFuryBonus
  }

  return 1.0
}

/**
 *
 * This is the spells damage listed in the spellbook. `dmg` can be minDmg, maxDmg, or avgDmg
 *
 * @param spellName
 * @param dmg
 * @param opts
 */
const spellBaseDmg = (
  spellName: string,
  dmg: number,
  opts?: { moonFuryRank: number; improvedMoonFireRank: number }
): number => {
  return dmg * spellBaseDmgMultiplier(spellName, opts)
}

/**
 * For non-binary spells only: Each difference in level gives a 2% resistance chance that cannot
 * be negated (by spell penetration or otherwise).
 *
 * @param targetLevel
 * @param characterLevel
 * @param isBinarySpell
 * @returns Unmitigatable target resistance
 */
const targetSpellResistanceFromLevel = (
  targetLevel: number,
  characterLevel: number,
  isBinarySpell?: boolean
): number => {
  if (isBinarySpell) {
    return 0
  }

  return (
    (targetLevel > characterLevel ? targetLevel - characterLevel : 0) * parseFloat((0.1333 * characterLevel).toFixed(2))
  )
}

/**
 *
 * Total spell resistance of target. Factors in binary vs non-binary spell and
 * the targets unmitigatable resistance based on level.
 *
 * @param targetLevel
 * @param targetBaseSpellResistance
 * @param characterLevel
 * @param characterSpellPenetration
 * @param isBinarySpell
 *
 */
const targetSpellResistance = (
  targetLevel: number,
  targetBaseSpellResistance: number,
  characterLevel: number,
  characterSpellPenetration: number,
  isBinarySpell?: boolean
): number => {
  const base = targetSpellResistanceFromLevel(targetLevel, characterLevel, isBinarySpell)
  const sr = Math.min(targetBaseSpellResistance, 5 * characterLevel - base)
  return sr - Math.min(characterSpellPenetration, sr) + base
}

/**
 *
 * Average partial resistance penalty of spells that hit target
 *
 * https://dwarfpriest.wordpress.com/2008/01/07/spell-hit-spell-penetration-and-resistances/#more-176
 *
 * @param targetLevel
 * @param targetBaseSpellResistance
 * @param characterLevel
 * @param characterSpellPenetration
 * @param isBinarySpell
 *
 * @returns Multiplier to be applied over the spells total damage
 */
const spellPartialResistAvg = (
  targetLevel: number,
  targetBaseSpellResistance: number,
  characterLevel: number,
  characterSpellPenetration: number,
  isBinarySpell?: boolean
): number => {
  const sr = targetSpellResistance(
    targetLevel,
    targetBaseSpellResistance,
    characterLevel,
    characterSpellPenetration,
    isBinarySpell
  )
  return (0.75 * sr) / (5 * characterLevel)
}

export default {
  globalCooldown,
  playerLevelCap,
  baseSpellCrit,
  baseSpellCritMultiplier,
  spellHitCap,
  spellCritCap,
  spellChanceToHit,
  spellChanceToMiss,
  spellChanceToCrit,
  spellChanceToNormal,
  spellPartialResistAvg,
  spellCritBonusMultiplier,
  spellCritMultiplier,
  spellBaseDmgMultiplier,
  spellBaseDmg,
  targetSpellResistanceFromLevel,
  targetSpellResistance
}
