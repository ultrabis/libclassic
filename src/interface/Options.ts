import OptionsCharacter from './OptionsCharacter'
import OptionsTarget from './OptionsTarget'
import ItemSlot from '../enum/ItemSlot'

export default interface Options {
  debug: boolean
  experimental: boolean
  phase: number
  raids: boolean
  tailoring: boolean
  worldBosses: boolean
  randomEnchants: boolean
  enchantExploit: boolean
  onUseItems: boolean
  encounterLength: number
  spellName: string
  itemSearchSlot: ItemSlot
  enchantSearchSlot: ItemSlot
  castTimePenalty: number
  character: OptionsCharacter
  target: OptionsTarget
}
