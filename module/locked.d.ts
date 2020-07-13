import LockedItems from '../interface/LockedItems';
import LockedEnchants from '../interface/LockedEnchants';
import GearItemJSON from '../interface/GearItemJSON';
import GearEnchantJSON from '../interface/GearEnchantJSON';
import ItemSlot from '../enum/ItemSlot';
declare const _default: {
    getItemId: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => number;
    getEnchantId: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => number;
    getItem: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => GearItemJSON | undefined;
    getEnchant: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => GearEnchantJSON | undefined;
    setItem: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot, value: number) => number;
    setEnchant: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot, value: number) => number;
    lockItem: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot, value: number) => number;
    lockEnchant: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot, value: number) => number;
    unequipItem: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => number;
    unequipEnchant: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => number;
    unlockItem: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => number;
    unlockEnchant: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => number;
    unequipItems: (lockedItems: LockedItems | undefined) => number;
    unequipEnchants: (lockedEnchants: LockedEnchants | undefined) => number;
    unlockItems: (lockedItems: LockedItems | undefined) => number;
    unlockEnchants: (lockedEnchants: LockedEnchants) => number;
    itemLocked: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => boolean;
    enchantLocked: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => boolean;
    itemEquipped: (lockedItems: LockedItems | undefined, itemSlot: ItemSlot) => boolean;
    enchantEquipped: (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot) => boolean;
};
export default _default;
