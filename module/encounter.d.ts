import Encounter from '../interface/Encounter';
import Settings from '../interface/Settings';
import PlayableSpec from '../enum/PlayableSpec';
declare const _default: {
    defaultSettings: (spec?: PlayableSpec | undefined) => Settings;
    run: (settings: Settings) => Encounter;
    run2: (settings: Settings) => Encounter;
};
export default _default;
