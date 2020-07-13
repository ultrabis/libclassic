import Equipment from '../class/Equipment';
import Settings from '../interface/Settings';
import LockedItems from '../interface/LockedItems';
import LockedEnchants from '../interface/LockedEnchants';
import ParaminOptions from '../interface/ParaminOptions';
declare const _default: {
    stringToParamin: (str: string, opts?: ParaminOptions | undefined) => string;
    paraminToString: (paramin: string, opts?: ParaminOptions | undefined) => string;
    lockedFromGearParam: (param: string, opts?: ParaminOptions | undefined) => Object;
    gearParamFromLocked: (lockedItems: LockedItems, lockedEnchants: LockedEnchants | null, opts?: ParaminOptions | undefined) => string;
    optionFromURL: (name: string) => any;
    publicURL: (equipment: Equipment) => string;
    defaultSettings: () => Settings;
};
export default _default;
