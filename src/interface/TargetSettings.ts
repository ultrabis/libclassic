import MagicSchool from '../enum/MagicSchool'
import TargetType from '../enum/TargetType'

export default interface TargetSettings {
  level: number
  shimmer: MagicSchool
  thunderfury: number
  type: TargetType
  spellResistance: number
  debuffs: string[]
}
