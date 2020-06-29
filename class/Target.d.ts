import Settings from '../interface/Settings';
import Buffs from '../enum/Buffs';
import MagicSchool from '../enum/MagicSchool';
export default class Target {
    settings: Settings;
    debuffFlags: Buffs;
    constructor(settings: Settings);
    get level(): number;
    get hitChance(): number;
    get spellResistance(): number;
    get shimmer(): MagicSchool;
    get spellVulnBonus(): number;
    /**
     * ...reducing Shadow and Arcane resistances by 75...
     */
    get curseOfShadowResistBonus(): number;
    /**
     * ...reducing nature resistances 25 per "jump"...
     */
    get thunderfuryResistBonus(): number;
    /**
     * ...and increasing Shadow and Arcane damage taken by 10%...
     */
    get curseOfShadowDamageBonus(): number;
    /**
     * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
     */
    get stormStrikeBonus(): number;
    get arcaneSpellResistance(): number;
    get natureSpellResistance(): number;
    get fireSpellResistance(): number;
    get frostSpellResistance(): number;
    get shadowSpellResistance(): number;
    toJSON(): any;
}
