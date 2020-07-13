import ItemSlot from '../enum/ItemSlot';
import LockedItems from './LockedItems';
import LockedEnchants from './LockedEnchants';
export default interface GearSettings {
    equipped: number[][];
    lockedItems: LockedItems;
    lockedEnchants: LockedEnchants;
    itemSearchSlot: ItemSlot;
    enchantSearchSlot: ItemSlot;
    raids: boolean;
    tailoring: boolean;
    worldBosses: boolean;
    randomEnchants: boolean;
    enchantExploit: boolean;
    onUseItems: boolean;
}
