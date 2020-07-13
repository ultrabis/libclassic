/**
 * interface for JSON files in db/
 */
import SpellJSON from '../interface/SpellJSON';
import GearItemJSON from '../interface/GearItemJSON';
import GearItemSetJSON from '../interface/GearItemSetJSON';
import GearEnchantJSON from '../interface/GearEnchantJSON';
import GearItemSuffix from '../interface/GearItemSuffix';
import GearItemQuery from '../interface/GearItemQuery';
import SpellQuery from '../interface/SpellQuery';
declare const _default: {
    item: (opts: GearItemQuery) => GearItemJSON | undefined;
    items: (opts: GearItemQuery) => GearItemJSON[];
    itemSet: (opts: GearItemQuery) => GearItemSetJSON | undefined;
    itemSets: (opts: GearItemQuery) => GearItemSetJSON[];
    itemSuffixes: (opts: any) => GearItemSuffix[];
    enchant: (opts: GearItemQuery) => GearEnchantJSON | undefined;
    enchants: (opts: GearItemQuery) => GearEnchantJSON[];
    spell: (opts: SpellQuery) => SpellJSON | undefined;
    spells: (opts: SpellQuery) => SpellJSON[];
};
export default _default;
