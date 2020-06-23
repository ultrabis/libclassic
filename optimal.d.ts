import Equipment from './class/Equipment';
import ClassicOptions from './interface/ClassicOptions';
import EquipmentArray from './interface/EquipmentArray';
import ItemJSON from './interface/ItemJSON';
import EnchantJSON from './interface/EnchantJSON';
declare const _default: {
    sortByDPS: (a: EquipmentArray, b: EquipmentArray) => number;
    itemsForSlot: (options: ClassicOptions) => ItemJSON[] | undefined;
    enchantsForSlot: (options: ClassicOptions) => EnchantJSON[] | undefined;
    equipment: (options: ClassicOptions) => Equipment;
};
export default _default;
