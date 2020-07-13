import CommonNumberResult from './CommonNumberResult'
import SpellDamageTrio from './SpellDamageTrio'
import ResistancesTrio from './ResistancesTrio'

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
  spellHealing: CommonNumberResult
  spellDamage: SpellDamageTrio
  resistances: ResistancesTrio
}
