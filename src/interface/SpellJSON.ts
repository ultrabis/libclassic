import MagicSchool from '../enum/MagicSchool'
/**
 * Object format of spells stored in db/spells.
 * Spells are stored as YAML, but converted to
 * JSON at build time.
 */
export default interface SpellJSON {
  name: string // "{name} Rank {rank}"
  type: string // direct, periodic or hybrid
  reqLvl: number
  castTime: number // 0 = instant
  magicSchool: MagicSchool
  range: number
  manaCost: number
  phase: number
  icon: string
  minDmg?: number // direct and hybrid spells only
  maxDmg?: number // direct and hybrid spells only
  tickDmg?: number // periodic and hybrid spells only
  tickRate?: number // periodic and hybrid spells only
  duration?: number // periodic and hybrid spells only
  secondary?: string // spells with secondary effects (TODO: the actual affects don't do anything)
}
