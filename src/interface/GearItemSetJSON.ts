import GearItemJSON from './GearItemJSON'

export default interface GearItemSetJSON {
  name: string
  phase: number
  raid: boolean
  tailoring: boolean
  spellHit?: number
  spellCrit?: number
  spellDamage?: number
  itemNames: string[]
  items?: GearItemJSON[]
  score?: number
}
