import GearItem from './GearItem'
import GearEnchant from './GearEnchant'

/*
export default interface GearSlotData {
  item: GearItem
  enchant: GearEnchant
}
*/

export default interface Gear {
  equipped: [GearItem, GearEnchant][]
  items: GearItem[]
  enchants: GearEnchant[]
}
