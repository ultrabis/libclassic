import Item from './Item';
import Enchant from './Enchant';
export default interface Gear {
    custom: [Item, Enchant][];
    items: Item[];
    enchants: Enchant[];
}
