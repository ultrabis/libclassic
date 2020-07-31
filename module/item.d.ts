import Item from '../interface/Item';
import ItemJSON from '../interface/ItemJSON';
import ItemQuery from '../interface/ItemQuery';
import GearSlot from '../enum/GearSlot';
import ItemQuality from '../enum/ItemQuality';
import PvPRank from '../enum/PvPRank';
import ItemSlot from '../enum/ItemSlot';
declare const _default: {
    fromDefault: () => Item;
    fromJSON: (itemJSON?: ItemJSON | undefined) => Item;
    fromJSONArray: (itemJSONArray: ItemJSON[]) => Item[];
    fromQuery: (opts: ItemQuery) => Item[];
    isFromRaid: (location: string) => boolean;
    pvpRankFromText: (text: string) => PvPRank;
    slotFromItemSlot: (slot: ItemSlot) => GearSlot;
    qualityFromText: (text: string) => ItemQuality;
};
export default _default;
