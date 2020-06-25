/**
 * Common values and functions. These are general game related things that could apply
 * to various classes / specs. They should be relatively low level and self-contained,
 * not requiring any higher level modules or classes.
 *
 * In the future, i'd like more common methods extracted from classes and placed here.
 */
import ClassicOptions from './interface/ClassicOptions';
import Buffs from './enum/Buffs';
import Faction from './enum/Faction';
import Raid from './enum/Raid';
import WorldBoss from './enum/WorldBoss';
import PlayableClass from './enum/PlayableClass';
import PlayableRace from './enum/PlayableRace';
import ItemBonusType from './enum/ItemBonusType';
import ItemSuffixType from './enum/ItemSuffixType';
import ItemQuality from './enum/ItemQuality';
import PvPRank from './enum/PvPRank';
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
    raidFromText: (text: string) => Raid;
    raidsFromText: (text: string) => Raid[];
    worldBossFromText: (text: string) => WorldBoss;
    worldBossesFromText: (text: string) => WorldBoss[];
    pvpRankFromText: (text: string) => PvPRank;
    playableRaceFromText: (text: string) => PlayableRace;
    playableClassFromText: (text: string) => PlayableClass;
    playableClassesFromText: (text: string) => PlayableClass[];
    itemBonusTypeFromText: (text: string) => ItemBonusType;
    itemSuffixTypeFromText: (text: string) => ItemSuffixType;
    itemQualityFromText: (text: string) => ItemQuality;
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
