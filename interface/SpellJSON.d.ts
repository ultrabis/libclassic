import MagicSchool from '../enum/MagicSchool';
/**
 * Object format of spells stored in db/spells.
 * Spells are stored as YAML, but converted to
 * JSON at build time.
 */
export default interface SpellJSON {
    name: string;
    type: string;
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
