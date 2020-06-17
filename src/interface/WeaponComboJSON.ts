import ItemJSON from './ItemJSON'
import EnchantJSON from './EnchantJSON'

export default interface WeaponComboJSON {
  mainHand: ItemJSON
  offHand?: ItemJSON
  enchant: EnchantJSON
}
