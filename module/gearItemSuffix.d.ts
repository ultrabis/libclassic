import GearItemSuffix from '../interface/GearItemSuffix';
declare const _default: {
    fromText: (id: string, type: string, bonus: string, bonus2?: string | undefined, bonus3?: string | undefined) => GearItemSuffix;
    fromItemNameAndBonusValue: (itemName: string, bonusValue: number) => GearItemSuffix | undefined;
    fromItemName: (itemName: string) => GearItemSuffix[];
};
export default _default;
