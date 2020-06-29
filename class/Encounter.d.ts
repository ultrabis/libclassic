import Cast from './Cast';
import Settings from '../interface/Settings';
import ItemJSON from '../interface/ItemJSON';
import EnchantJSON from '../interface/EnchantJSON';
export default class Encounter {
    spellCast: Cast;
    items: ItemJSON[] | undefined;
    enchants: EnchantJSON[] | undefined;
    constructor(settings: Settings);
}
