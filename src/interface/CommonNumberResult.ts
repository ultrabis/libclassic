/**
 *
 * for wow we want at least three types of numbers: base, actual and effective.
 * they can mean slightly different things depending on context.
 *
 * base - base value e.g. dmg values of in-game spellbook
 * actual - factors in gear, spell coeffients, magic school, etc
 * effective - buffs, debuffs, partial resist penalty, natures grace reduction of castTime, etc
 *
 */

export default interface CommonNumberResult {
  base?: number
  actual?: number
  effective?: number
}
