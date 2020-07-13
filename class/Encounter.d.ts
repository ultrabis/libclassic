import Cast from './Cast';
import Settings from '../interface/Settings';
import GearItemJSON from '../interface/GearItemJSON';
import GearEnchantJSON from '../interface/GearEnchantJSON';
export default class Encounter {
    spellCast: Cast;
    items: GearItemJSON[] | undefined;
    enchants: GearEnchantJSON[] | undefined;
    constructor(settings: Settings);
}
