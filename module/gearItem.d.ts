import GearItem from '../interface/GearItem';
import GearItemBonus from '../interface/GearItemBonus';
import GearItemJSON from '../interface/GearItemJSON';
import GearItemQuery from '../interface/GearItemQuery';
import GearSlot from '../enum/GearSlot';
import GearItemQuality from '../enum/GearItemQuality';
import PvPRank from '../enum/PvPRank';
import ItemSlot from '../enum/ItemSlot';
declare const _default: {
    fromDefault: () => GearItem;
    fromJSON: (gearItemJSON?: GearItemJSON | undefined) => GearItem;
    fromJSONArray: (gearItemJSONArray: GearItemJSON[]) => GearItem[];
    fromQuery: (opts: GearItemQuery) => GearItem[];
    isFromRaid: (location: string) => boolean;
    pvpRankFromText: (text: string) => PvPRank;
    bonusFromText: (bonus: string) => GearItemBonus;
    slotFromItemSlot: (itemSlot: ItemSlot) => GearSlot;
    qualityFromText: (text: string) => GearItemQuality;
};
export default _default;
