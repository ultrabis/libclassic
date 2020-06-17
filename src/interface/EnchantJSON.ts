import ItemSlot from '../enum/ItemSlot'

export default interface EnchantJSON {
  id: number
  customId: string
  name: string
  slot: ItemSlot
  phase: number
  icon: string
  score: number
  text: string
  exploit?: boolean
  spellHealing?: number
  armor?: number
  spellDamage: number
  arcaneDamage: number
  natureDamage: number
  spellHit: number
  spellCrit: number
  spellPenetration: number
  stamina: number
  intellect: number
  spirit: number
  mp5: number
}
