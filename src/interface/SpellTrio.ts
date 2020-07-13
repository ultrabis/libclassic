import SpellCoefficient from './SpellCoefficient'
import CastDmgObject from './CastDmgObject'
import CommonNumberResult from './CommonNumberResult'

import MagicSchool from '../enum/MagicSchool'
import SpellType from '../enum/SpellType'

/* spell object */
export default interface Spell {
  name: string
  rank: number
  type: SpellType
  magicSchool: MagicSchool
  range: number
  manaCost: number
  reqLvl: number
  coefficient: SpellCoefficient
  isBinary: boolean
  secondaryEffect: string
  canCrit: boolean
  canMiss: boolean
  canPartialResist: boolean
  castTime: CommonNumberResult
  dmg: {
    normal: CastDmgObject
    crit: CastDmgObject
    periodic: CastDmgObject
  }
}
