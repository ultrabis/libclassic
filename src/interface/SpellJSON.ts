import MagicSchool from '../enum/MagicSchool'
import SpellType from '../enum/SpellType'
/**
 * spells stored in JSON 'database'. the smaller this can get, the better.
 */
export default interface SpellJSON {
  name: string // "{name} Rank {rank}"
  type: SpellType // direct, periodic or hybrid
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
