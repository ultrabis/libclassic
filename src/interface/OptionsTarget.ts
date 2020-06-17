import MagicSchool from '../enum/MagicSchool'
import TargetType from '../enum/TargetType'

export default interface OptionsTarget {
  level: number
  shimmer: MagicSchool
  thunderfury: number
  type: TargetType
  spellResistance: number
  debuffs: string[]
}
