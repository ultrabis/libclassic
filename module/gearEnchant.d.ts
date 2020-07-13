import GearEnchantJSON from '../interface/GearEnchantJSON';
import GearEnchant from '../interface/GearEnchant';
declare const _default: {
    fromDefault: () => GearEnchant;
    fromJSON: (enchantJSON?: GearEnchantJSON | undefined) => GearEnchant;
    fromJSONArray: (gearEnchantJSONArray: GearEnchantJSON[]) => GearEnchant[];
};
export default _default;
