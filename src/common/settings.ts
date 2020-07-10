import utils from './utils'

import Settings from '../interface/Settings'
import MoonkinDefaults from '../db/moonkinSettings.json'
import PlayableSpec from '../enum/PlayableSpec'
import GearSlot from '../enum/GearSlot'
import GearState from '../enum/GearState'

/**
 *
 * Set a value in gear array
 *
 * @param settings will be modified
 * @param index (0 = itemId, 1 = itemSuffixId, 2 = enchantId)
 * @param value itemId, suffixId, enchantId, GearState.BIS (0) or GearState.BIS (1)
 * @param gearSlot apply to one slot, or if undefined, all slots
 */
const setGearValue = (settings: Settings, index: number, value: GearState | number, gearSlot?: GearSlot): number => {
  if (!gearSlot) {
    const keys = Object.keys(GearSlot)
    for (let i = 0; i < keys.length; i++) {
      settings.gear.equipped[i][index] = value
    }
    return 0
  }

  settings.gear.equipped[gearSlot][index] = value
  return 0
}

const setGearItemId = (settings: Settings, itemId: number, gearSlot?: GearSlot): number => {
  return setGearValue(settings, 0, itemId, gearSlot)
}

const setGearSuffixId = (settings: Settings, itemSuffixId: number, gearSlot?: GearSlot): number => {
  return setGearValue(settings, 1, itemSuffixId, gearSlot)
}

const setGearEnchantId = (settings: Settings, enchantId: number, gearSlot?: GearSlot): number => {
  return setGearValue(settings, 2, enchantId, gearSlot)
}

/**
 * Get a value in gear array
 *
 * @param settings
 * @param index
 * @param gearSlot
 */
const getGearValue = (settings: Settings, index: number, gearSlot: GearSlot): number => {
  return settings.gear.equipped[gearSlot][index]
}

const getGearItemId = (settings: Settings, gearSlot: GearSlot): number => {
  return getGearValue(settings, 0, gearSlot)
}

const getGearSuffixId = (settings: Settings, gearSlot: GearSlot): number => {
  return getGearValue(settings, 1, gearSlot)
}

const getGearEnchantId = (settings: Settings, gearSlot: GearSlot): number => {
  return getGearValue(settings, 2, gearSlot)
}

const defaults = (opts?: { playerSpec: PlayableSpec }): Settings => {
  if (!opts) {
    return utils.cloneObject(MoonkinDefaults)
  }

  switch (opts.playerSpec) {
    case PlayableSpec.Moonkin:
    default:
      return utils.cloneObject(MoonkinDefaults)
  }
}

export default {
  defaults,
  setGearValue,
  setGearItemId,
  setGearSuffixId,
  setGearEnchantId,
  getGearValue,
  getGearItemId,
  getGearSuffixId,
  getGearEnchantId
}
