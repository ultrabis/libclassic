import Character from './Character';
import Spell from './Spell';
import Target from './Target';
import Equipment from './Equipment';
import Settings from '../interface/Settings';
import CastDmgObject from '../interface/CastDmgObject';
interface EquipmentOverride {
    equipment?: Equipment;
    spellHitWeight?: number;
    spellCritWeight?: number;
    spellCastTime?: number;
    spellCrit?: number;
}
/**
 * A Spell cast by Character at Target.
 */
export default class Cast {
    settings: Settings;
    spell: Spell;
    target: Target;
    player: Character;
    constructor(settings: Settings, equipmentOverride?: EquipmentOverride);
    get normalDmg(): CastDmgObject;
    get critDmg(): CastDmgObject;
    get periodicDmg(): CastDmgObject;
    get dps(): CastDmgObject;
    get periodicDPS(): CastDmgObject;
    get moonFuryBonus(): number;
    get improvedMoonfireBonus(): number;
    get improvedMoonfireSpellCritBonus(): number;
    get curseOfShadowDamageBonus(): number;
    get curseOfShadowResistBonus(): number;
    /**
     * Effect #1	Apply Aura: Mod % Damage Taken (All)
     * Value: -75%
     * Effect #2	Apply Aura: Mod % Damage Taken (Vulnerable)
     * Value: 1100%
     *
     */
    get shimmerBonus(): number;
    get stormStrikeBonus(): number;
    get spellDamageBonus(): number;
    get onUseSpellDamageBonus(): number;
    get actualSpellDamage(): number;
    get effectiveSpellDamage(): number;
    get effectiveSpellCrit(): number;
    get effectiveTargetResistance(): number;
    get targetResistanceFromLevel(): number;
    get partialResistPenalty(): number;
    get baseDmgMultiplier(): number;
    get effectiveDmgMultiplier(): number;
    /**
     * Mitigates spell resist of SpellCast. Needs work.
     */
    get spellPenetration(): number;
    /**
     * Spell cast time . Factors in talents that modify base spell cast time.
     * Doesn't account for procs like natures grace
     */
    get castTime(): number;
    /**
     * The amount of cast time reduced when a crit procs a bonus to it i.e. natures grace
     */
    get castTimeReductionOnCrit(): number;
    /**
     * Factors in cast speed, procs like natures grace, hit, crit and "human factor" (which might actually be latency?)
     */
    get effectiveCastTime(): number;
    /**
     * Chance of hitting with a spell
     *
     */
    get chanceToHit(): number;
    /**
     * Chance of missing a spell
     *
     */
    get chanceToMiss(): number;
    /**
     * Chance of critting with a spell
     *
     */
    get chanceToCrit(): number;
    /**
     * Chance of landing a Normal hit i.e. not a miss and not a crit
     *
     */
    get chanceToNormal(): number;
    get critMultiplier(): number;
    /**
     * The bonus multiplier of a crit, not counting the base
     */
    get critBonusMultiplier(): number;
    /**
     * spell crit weight i.e. the amount of spell power 1 point of crit is worth.
     */
    get spellCritWeight(): number;
    /**
     * spell hit weight i.e. the amount of spell power 1 point of hit is worth.
     */
    get spellHitWeight(): number;
    /**
     * int weight i.e. the amount of spell power 1 point of int is worth
     */
    get intWeight(): number;
    /**
     *
     * dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
     */
    get spellDamageToDamage(): number;
    /**
     *
     * d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
     */
    get spellCritToDamage(): number;
    /**
     *
     * v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
     */
    get spellHitToDamage(): number;
    get spellCritToSpellDamage(): number;
    get spellHitToSpellDamage(): number;
    /**
     *
     * DPS keeping faerie fire up and spamming Spell. .
     *
     */
    get ffDPS(): number;
    get ffDPSLoss(): number;
    get mfDPS(): number;
    get mfDPSLoss(): number;
    get testRotationDPS(): number;
    toJSON(): any;
}
export {};
