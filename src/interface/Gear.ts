import Item from './Item'
import Enchant from './Enchant'

export default interface Gear {
  equipped: [Item, Enchant][]
  items: Item[]
  enchants: Enchant[]
}
