import GearSettings from '../interface/GearSettings'
import GearSlot from '../enum/GearSlot'
import GearState from '../enum/GearState'

/**
 *
 * Set a value in gearSettings 'equipped' array
 *
 * @param gearSettingsObj will be modified
 * @param index (0 = itemId, 1 = itemSuffixId, 2 = enchantId)
 * @param value itemId, suffixId, enchantId, GearState.BIS (0) or GearState.BIS (1)
 * @param gearSlot apply to one slot, or if undefined, all slots
 */
const setValue = (
  gearSettingsObj: GearSettings,
  index: number,
  value: GearState | number,
  gearSlot?: GearSlot
): number => {
  if (!gearSlot) {
    const keys = Object.keys(GearSlot)
    for (let i = 0; i < keys.length; i++) {
      gearSettingsObj.equipped[i][index] = value
    }
    return 0
  }

  gearSettingsObj.equipped[gearSlot][index] = value
  return 0
}

const setItemId = (gearSettingsObj: GearSettings, itemId: number, gearSlot?: GearSlot): number => {
  return setValue(gearSettingsObj, 0, itemId, gearSlot)
}

const setItemSuffixId = (gearSettingsObj: GearSettings, itemSuffixId: number, gearSlot?: GearSlot): number => {
  return setValue(gearSettingsObj, 1, itemSuffixId, gearSlot)
}

const setEnchantId = (gearSettingsObj: GearSettings, enchantId: number, gearSlot?: GearSlot): number => {
  return setValue(gearSettingsObj, 2, enchantId, gearSlot)
}

/**
 * Get a value in GearSettings `equipped` array
 *
 * @param settings
 * @param index
 * @param gearSlot
 */
const getValue = (gearSettingsObj: GearSettings, index: number, gearSlot: GearSlot): number => {
  return gearSettingsObj.equipped[gearSlot][index]
}

const itemId = (gearSettingsObj: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettingsObj, 0, gearSlot)
}

const suffixId = (gearSettingsObj: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettingsObj, 1, gearSlot)
}

const enchantId = (gearSettingsObj: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettingsObj, 2, gearSlot)
}

export default {}
