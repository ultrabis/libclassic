import Equipment from '../class/Equipment';
import Settings from '../interface/Settings';
import EquipmentArray from '../interface/EquipmentArray';
import ItemJSON from '../interface/ItemJSON';
import EnchantJSON from '../interface/EnchantJSON';
declare const _default: {
    sortByDPS: (a: EquipmentArray, b: EquipmentArray) => number;
    itemsForSlot: (settings: Settings) => ItemJSON[] | undefined;
    enchantsForSlot: (settings: Settings) => EnchantJSON[] | undefined;
    equipment: (settings: Settings) => Equipment;
};
export default _default;
