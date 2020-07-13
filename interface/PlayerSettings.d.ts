import Gender from '../enum/Gender';
import PlayableRace from '../enum/PlayableRace';
import PlayableClass from '../enum/PlayableClass';
import PvPRank from '../enum/PvPRank';
import TalentSettings from './TalentSettings';
export default interface PlayerSettings {
    rotation: string;
    level: number;
    gender: Gender;
    race: PlayableRace;
    class: PlayableClass;
    pvpRank: PvPRank;
    buffs: string[];
    talents: TalentSettings;
}
