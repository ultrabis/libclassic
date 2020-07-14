import ItemSuffix from '../interface/ItemSuffix';
declare const _default: {
    fromText: (id: string, type: string, bonus: string, bonus2?: string | undefined, bonus3?: string | undefined) => ItemSuffix;
    fromItemNameAndBonusValue: (itemName: string, bonusValue: number) => ItemSuffix | undefined;
    fromItemName: (itemName: string) => ItemSuffix[];
};
export default _default;
