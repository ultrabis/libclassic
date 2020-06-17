import ItemJSON from '../interface/ItemJSON'

export default interface ItemSetJSON {
  name: string
  phase: number
  raid: boolean
  tailoring: boolean
  spellHit?: number
  spellCrit?: number
  spellDamage?: number
  itemNames: string[]
  items?: ItemJSON[]
  score?: number
}
