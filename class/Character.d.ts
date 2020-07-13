import Equipment from './Equipment';
import Faction from '../enum/Faction';
import Settings from '../interface/Settings';
/**
 * Stores player attributes, Talents, Gear, and Buff
 */
export default class Character {
    settings: Settings;
    equipment: Equipment;
    buffMask: number;
    constructor(settings: Settings, equipment: Equipment);
    get level(): number;
    get faction(): Faction;
    get isHorde(): boolean;
    get isAlliance(): boolean;
    get isTauren(): boolean;
    get isNightElf(): boolean;
    /**
     * TODO: https://classicwow.live/guides/46/basic-stats-sheet
     */
    get health(): number;
    get mana(): number;
    get stamina(): number;
    get intellect(): number;
    get spirit(): number;
    get mp5(): number;
    get spellDamage(): number;
    get arcaneDamage(): number;
    get natureDamage(): number;
    get spellCritFromIntellect(): number;
    get spellCritFromEquipment(): number;
    get spellCritUnbuffed(): number;
    /**
     * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
     */
    get spellCrit(): number;
    /**
     * TODO: Return total spell hit rating (equipment + talents + buffs)
     */
    get effectiveSpellHit(): number;
    get spellHit(): number;
    get moonkinAuraBonus(): number;
    get flaskOfSupremePowerBonus(): number;
    get greaterArcaneElixirBonus(): number;
    get cerebralCortexCompoundBonus(): number;
    get runnTumTuberSurpriseBonus(): number;
    get powerInfusionBonus(): number;
    get ephemeralPowerBonus(): number;
    get rallyingCryOfTheDragonSlayerSpellCritBonus(): number;
    get slipkiksSavvyBonus(): number;
    get songflowerSerenadeSpellCritBonus(): number;
    get songflowerSerenadeAttributeBonus(): number;
    get saygesDarkFortuneBonus(): number;
    get tracesOfSilithystBonus(): number;
    get spiritOfZandalarBonus(): number;
    get arcaneBrillianceBonus(): number;
    get blessingOfKingsBonus(): number;
    get improvedGiftOfTheWildAttributeBonus(): number;
    get improvedGiftOfTheWildArmorBonus(): number;
    get improvedGiftOfTheWildResistancesBonus(): number;
    get burningAdrenalineDamageBonus(): number;
    get burningAdrenalineCastTimeBonus(): number;
    get improvedMoonfireBonus(): number;
    /**
     * Increases the damage done by Starfire, Moonfire, and Wrath by 2/4/6/8/10%
     */
    get moonFuryBonus(): number;
    /**
     * Reduces the cast of your Wrath spell by 0.1/0.2/0.3/0.4/0.5 sec
     */
    get improvedWrathBonus(): number;
    /**
     * Reduces the cast of your Starfire spell by 0.1/0.2/0.3/0.4/0.5 sec
     */
    get improvedStarfireBonus(): number;
    /**
     * Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by x%.
     */
    get vengeanceBonus(): number;
    /**
     * Allows x% of your Mana regeneration to continue while casting.
     */
    get reflectionBonus(): number;
    /**
     * Returns natures grace reduction, if the talent is learned
     */
    get naturesGraceBonus(): number;
    toJSON(): any;
}
