import SpellDamage from './SpellDamage'
import Resistances from './Resistances'

export default interface Stats {
  health?: number
  mana?: number
  stamina?: number
  intellect?: number
  spirit?: number
  mp5?: number
  armor?: number
  spellHit?: number
  spellCrit?: number
  spellPenetration?: number
  spellHealing?: number
  spellDamage?: SpellDamage
  resistances?: Resistances
}
