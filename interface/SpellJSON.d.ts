import MagicSchool from '../enum/MagicSchool';
import SpellType from '../enum/SpellType';
/**
 * spells stored in JSON 'database'. the smaller this can get, the better.
 */
export default interface SpellJSON {
    name: string;
    type: SpellType;
    reqLvl: number;
    castTime: number;
    magicSchool: MagicSchool;
    range: number;
    manaCost: number;
    phase: number;
    icon: string;
    minDmg?: number;
    maxDmg?: number;
    tickDmg?: number;
    tickRate?: number;
    duration?: number;
    secondary?: string;
}
