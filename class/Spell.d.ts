import SpellCoefficient from '../interface/SpellCoefficient';
import SpellJSON from '../interface/SpellJSON';
import MagicSchool from '../enum/MagicSchool';
/**
 * Spell details. These are base values that don't factor in talents, spellpower, buffs, debuffs, etc.
 */
export default class Spell {
    name: string;
    spellJSON: SpellJSON | undefined;
    constructor(name: string);
    /**
     * Return base (short) name, parsed from name.
     */
    get baseName(): string;
    /**
     * Return spell rank, parsed from name.
     */
    get rank(): string;
    /**
     * Spell is Starfire
     */
    get isStarfire(): boolean;
    /**
     * Spell is Warth
     */
    get isWrath(): boolean;
    /**
     * Spell is Moonfire
     */
    get isMoonfire(): boolean;
    /**
     * Spell is Insect Swarm
     */
    get isInsectSwarm(): boolean;
    /**
     * Spell is Hurricane
     */
    get isHurricane(): boolean;
    get canCrit(): boolean;
    get canMiss(): boolean;
    get canPartialResist(): boolean;
    get icon(): string;
    /**
     * Return spell type (direct, periodic or hybrid)
     */
    get type(): string;
    /**
     * Return spell reqLvl, unmodified.
     */
    get reqLvl(): number;
    /**
     * Return cast time, limited to globalCoolDown FIXME: dont limit to gcd here
     */
    get castTime(): number;
    /**
     * Return spell magicSchool, unmodified.
     */
    get magicSchool(): MagicSchool;
    get magicSchoolText(): string;
    /**
     * is spell nature damage?
     */
    get isNature(): boolean;
    /**
     * is spell arcane damage?
     */
    get isArcane(): boolean;
    /**
     * Return spell range, unmodified.
     */
    get range(): number;
    /**
     * Return mana cost, unmodified.
     */
    get manaCost(): number;
    /**
     * Return spell minimum damage, unmodified.
     */
    get minDmg(): number;
    /**
     * Return spell max damage, unmodified.
     */
    get maxDmg(): number;
    /**
     * avg spell damage (minDmg + maxDmg) / 2.
     */
    get avgDmg(): number;
    get tickDmg(): number;
    get tickRate(): number;
    get ticks(): number;
    get duration(): number;
    get periodicDmg(): number;
    get secondaryEffect(): string | undefined;
    get isBinary(): boolean;
    /**
     * Return spell coefficients. There are three types of spells, each with their
     * own coefficient formulas: direct, periodic, and hybrid (direct + periodic). Spells also
     * suffer penalties when they're below level 20 or have secondary spell
     * effects (e.g. insect swarm)
     *
     * Source: https://classicwow.live/guides/670/ozgar-s-downranking-guide-tool
     */
    get coefficient(): SpellCoefficient;
    toJSON(): any;
}
