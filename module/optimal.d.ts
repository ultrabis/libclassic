import Equipment from '../class/Equipment';
import Settings from '../interface/Settings';
import EquipmentArray from '../interface/EquipmentArray';
import GearItemJSON from '../interface/GearItemJSON';
import GearEnchantJSON from '../interface/GearEnchantJSON';
declare const _default: {
    sortByDPS: (a: EquipmentArray, b: EquipmentArray) => number;
    itemsForSlot: (settings: Settings) => GearItemJSON[] | undefined;
    enchantsForSlot: (settings: Settings) => GearEnchantJSON[] | undefined;
    equipment: (settings: Settings) => Equipment;
};
export default _default;
