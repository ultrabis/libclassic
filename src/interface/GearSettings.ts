import ItemSlot from '../enum/ItemSlot'

import LockedItems from './LockedItems'
import LockedEnchants from './LockedEnchants'

export default interface GearSettings {
  equipped: number[][] // [GearSlot][itemId, suffixId, enchantId]. itemId and enchantId can also be (0 = BIS, 1 = Naked).
  lockedItems: LockedItems // FIXME: replace
  lockedEnchants: LockedEnchants // FIXME: replace
  itemSearchSlot: ItemSlot // if slot valid will fill settings.gear.items[] in BiS order
  enchantSearchSlot: ItemSlot // if slot valid will fill settings.gear.enchants[] in BiS order
  raids: boolean // toggle raids in item searches
  tailoring: boolean // toggle tailoring bonuses in item searches
  worldBosses: boolean // toggle worldBosses in item searches
  randomEnchants: boolean // toggle random enchant items (items with suffixId)
  enchantExploit: boolean // toggle enchant exploit (Blizzard fixed this, so leave it to false)
  onUseItems: boolean // toggles on use items (activated trinkets, etc)
}
