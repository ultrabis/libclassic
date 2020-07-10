import CommonNumberResult from './CommonNumberResult'
import SpellDamage from './SpellDamage'
import Resistances from './Resistances'

export default interface Stats {
  health: CommonNumberResult
  mana: CommonNumberResult
  stamina: CommonNumberResult
  intellect: CommonNumberResult
  spirit: CommonNumberResult
  mp5: CommonNumberResult
  spellHit: CommonNumberResult
  spellCrit: CommonNumberResult
  spellPenetration: CommonNumberResult
  spellDamage: SpellDamage
  resistances: Resistances
}
