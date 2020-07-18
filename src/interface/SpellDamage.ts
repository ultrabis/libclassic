/**
 * common object for functions dealing with the spell damage stats.
 * e.g. player stats, stats from gear, etc
 *
 * :FIXME
 * spellDamageBase = geared but unbuffed player
 * spellDamageActual = with buffs (and flasks, elixer, etc)
 * spellDamageEffective = specific to this encounter e.g.
 * if casting Starfire, spellDamageEffective = spellDamage + arcaneDamage
 */

export default interface SpellDamage {
  spellDamage?: number
  arcaneDamage?: number
  fireDamage?: number
  frostDamage?: number
  natureDamage?: number
  shadowDamage?: number
  holyDamage?: number
}
