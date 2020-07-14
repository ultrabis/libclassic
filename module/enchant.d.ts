import EnchantJSON from '../interface/EnchantJSON';
import Enchant from '../interface/Enchant';
declare const _default: {
    fromDefault: () => Enchant;
    fromJSON: (enchantJSON?: EnchantJSON | undefined) => Enchant;
    fromJSONArray: (enchantJSONArray: EnchantJSON[]) => Enchant[];
};
export default _default;
