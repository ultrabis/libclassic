/**
 * interface for JSON files in db/
 */
import SpellJSON from './interface/SpellJSON';
import ItemJSON from './interface/ItemJSON';
import ItemSetJSON from './interface/ItemSetJSON';
import EnchantJSON from './interface/EnchantJSON';
import ItemQuery from './interface/ItemQuery';
import SpellQuery from './interface/SpellQuery';
declare const _default: {
    item: (opts: ItemQuery) => ItemJSON | undefined;
    items: (opts: ItemQuery) => ItemJSON[];
    itemSet: (opts: ItemQuery) => ItemSetJSON | undefined;
    itemSets: (opts: ItemQuery) => ItemSetJSON[];
    enchant: (opts: ItemQuery) => EnchantJSON | undefined;
    enchants: (opts: ItemQuery) => EnchantJSON[];
    spell: (opts: SpellQuery) => SpellJSON | undefined;
    spells: (opts: SpellQuery) => SpellJSON[];
};
export default _default;
