import GearSettings from '../interface/GearSettings';
import GearSlot from '../enum/GearSlot';
declare const _default: {
    itemId: (gearSettingsObj: GearSettings, gearSlot: GearSlot) => number;
    setItemId: (gearSettingsObj: GearSettings, itemId: number, gearSlot?: GearSlot | undefined) => number;
    suffixId: (gearSettingsObj: GearSettings, gearSlot: GearSlot) => number;
    setSuffixId: (gearSettingsObj: GearSettings, itemSuffixId: number, gearSlot?: GearSlot | undefined) => number;
    enchantId: (gearSettingsObj: GearSettings, gearSlot: GearSlot) => number;
    setEnchantId: (gearSettingsObj: GearSettings, enchantId: number, gearSlot?: GearSlot | undefined) => number;
};
export default _default;
