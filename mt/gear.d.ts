import ItemSuffixType from '../enum/ItemSuffixType';
import ItemBonus from '../interface/ItemBonus';
import ItemSuffixJSON from '../interface/ItemSuffixJSON';
declare const _default: {
    itemBonusFromText: (bonus: string) => ItemBonus;
    itemSuffixTypeFromItemName: (itemName: string) => ItemSuffixType;
    itemSuffixFromText: (id: string, type: string, bonus: string, bonus2?: string | undefined, bonus3?: string | undefined) => ItemSuffixJSON;
    itemSuffixFromItemNameAndBonusValue: (itemName: string, bonusValue: number) => ItemSuffixJSON | undefined;
    itemSuffixesFromItemName: (itemName: string) => ItemSuffixJSON[];
};
export default _default;
