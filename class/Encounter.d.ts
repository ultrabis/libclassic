import Cast from './Cast';
import ClassicOptions from '../interface/ClassicOptions';
import ItemJSON from '../interface/ItemJSON';
import EnchantJSON from '../interface/EnchantJSON';
export default class Encounter {
    spellCast: Cast;
    items: ItemJSON[] | undefined;
    enchants: EnchantJSON[] | undefined;
    constructor(options: ClassicOptions);
    toJSON(): any;
}
