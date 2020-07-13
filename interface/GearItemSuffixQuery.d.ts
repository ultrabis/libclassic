import GearItemSuffixType from '../enum/GearItemSuffixType';
export default interface GearItemSuffixQuery {
    id?: number;
    type?: GearItemSuffixType;
    bonusValue?: number;
}
