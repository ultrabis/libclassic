/**
 * Common values and functions. These are general game related things that could apply
 * to various classes / specs. They should be relatively low level and self-contained,
 * not requiring any higher level modules or classes.
 *
 * In the future, i'd like more common methods extracted from classes and placed here.
 */
import Buffs from './enum/Buffs';
import Faction from './enum/Faction';
import MagicSchool from './enum/MagicSchool';
import PlayableRace from './enum/PlayableRace';
import ClassicOptions from './interface/ClassicOptions';
declare const _default: {
    globalCooldown: number;
    playerLevelCap: number;
    spellHitCap: number;
    spellCritCap: number;
    baseSpellCrit: number;
    baseSpellCritMultiplier: number;
    defaultOptions: ClassicOptions;
    factionFromRace: (race: PlayableRace) => Faction;
    buffListToFlags: (buffList: string[]) => Buffs;
    magicSchoolFromText: (magicSchool: string) => MagicSchool;
    magicSchoolToText: (magicSchool: MagicSchool) => string;
    spellChanceToHit: (targetLevel: number, spellHit: number) => number;
    spellChanceToMiss: (targetLevel: number, spellHit: number) => number;
    spellChanceToCrit: (targetLevel: number, spellHit: number, spellCrit: number) => number;
    spellChanceToNormal: (targetLevel: number, spellHit: number, spellCrit: number) => number;
    spellPartialResistAvg: (targetLevel: number, targetBaseSpellResistance: number, characterLevel: number, characterSpellPenetration: number, isBinarySpell?: boolean | undefined) => number;
    spellCritBonusMultiplier: (opts?: {
        vengeanceRank?: number | undefined;
    } | undefined) => number;
    spellCritMultiplier: (opts?: {
        vengeanceRank?: number | undefined;
    } | undefined) => number;
    spellBaseDmgMultiplier: (spellName: string, opts?: {
        moonFuryRank: number;
        improvedMoonFireRank: number;
    } | undefined) => number;
    spellBaseDmg: (spellName: string, dmg: number, opts?: {
        moonFuryRank: number;
        improvedMoonFireRank: number;
    } | undefined) => number;
    targetSpellResistanceFromLevel: (targetLevel: number, characterLevel: number, isBinarySpell?: boolean | undefined) => number;
    targetSpellResistance: (targetLevel: number, targetBaseSpellResistance: number, characterLevel: number, characterSpellPenetration: number, isBinarySpell?: boolean | undefined) => number;
};
export default _default;
