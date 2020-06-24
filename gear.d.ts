import ItemSuffixType from './enum/ItemSuffixType';
import ItemBonusType from './enum/ItemBonusType';
import ItemBonus from './interface/ItemBonus';
import ItemSuffixJSON from './interface/ItemSuffixJSON';
declare const _default: {
    itemBonusTypeFromText: (text: string) => ItemBonusType;
    itemBonusFromText: (bonus: string) => ItemBonus;
    itemSuffixTypeFromText: (text: string) => ItemSuffixType;
    itemSuffixTypeFromItemName: (itemName: string) => ItemSuffixType;
    itemSuffixJSONFromText: (id: string, type: string, bonus: string, bonus2?: string | undefined, bonus3?: string | undefined) => ItemSuffixJSON;
};
export default _default;
