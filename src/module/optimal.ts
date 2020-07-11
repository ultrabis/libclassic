import locked from './locked'
import utils from './utils'

// FIXME:
import Equipment from '../class/Equipment'
import Cast from '../class/Cast'

import Settings from '../interface/Settings'
import GearSearch from '../interface/GearSearch'
import EquipmentArray from '../interface/EquipmentArray'
import GearItemJSON from '../interface/GearItemJSON'
import GearEnchantJSON from '../interface/GearEnchantJSON'

import ItemSlot from '../enum/ItemSlot'

const sortByDPS = (a: EquipmentArray, b: EquipmentArray): number => {
  return (b.dps ? b.dps : 0) - (a.dps ? a.dps : 0)
}

const itemsForSlot = (settings: Settings): GearItemJSON[] | undefined => {
  /* gearSearchSlot is only set when a user clicks a slot to equip an item. If that's not
   * the case then we don't need to do anything */
  const itemSlot = settings.gear.itemSearchSlot
  if (itemSlot === ItemSlot.None) {
    return undefined
  }

  /* We need the stat weights MINUS the slot we're getting items for. So make a private
   * copy of settings, unequip the slot, and run the equipment optimization function.
   * Our stat weights will be contained in the gearSearch. */
  const tmpSettings: Settings = utils.cloneObject(settings)
  locked.unequipItem(tmpSettings.gear.lockedItems, itemSlot)
  const tmpEquipment: Equipment = equipment(tmpSettings)
  const tmpItemSearch: GearSearch = tmpEquipment.itemSearch

  /* and finally retrieve the items for this slot, using the weights
   * we just got. Copy the original version of what we overwrote above
   * and unlock the slot so it doesn't return a user locked item */
  tmpItemSearch.lockedItems = utils.cloneObject(settings.gear.lockedItems)
  locked.unlockItem(tmpItemSearch.lockedItems, tmpSettings.gear.itemSearchSlot)
  return Equipment.getWeightedItemsBySlot(itemSlot, tmpItemSearch)
}

const enchantsForSlot = (settings: Settings): GearEnchantJSON[] | undefined => {
  /* Same process as above, but for enchants */
  const itemSlot = settings.gear.enchantSearchSlot
  if (itemSlot === ItemSlot.None) {
    return undefined
  }

  const tmpSettings: Settings = utils.cloneObject(settings)
  locked.unequipEnchant(tmpSettings.gear.lockedEnchants, itemSlot)
  const tmpEquipment: Equipment = equipment(tmpSettings)
  const tmpItemSearch: GearSearch = tmpEquipment.itemSearch

  tmpItemSearch.lockedEnchants = utils.cloneObject(settings.gear.lockedEnchants)
  locked.unlockEnchant(tmpItemSearch.lockedEnchants, tmpSettings.gear.enchantSearchSlot)
  return Equipment.getWeightedEnchantsBySlot(itemSlot, tmpItemSearch)
}

const equipment = (settings: Settings): Equipment => {
  const mySettings = utils.cloneObject(settings)
  const maxTries = 5
  let spellCast: Cast | undefined = undefined
  const equipmentArray = new Array<EquipmentArray>()

  // console.log(`--- starting gear optimization with maximum of ${maxTries} tries ---`)
  for (let i = 0; i <= maxTries - 1; i++) {
    /*
    console.log(
      `Attempt ${i + 1}: spellHitWeight=${spellCast ? spellCast.spellHitWeight : 15}, spellCritWeight=${
        spellCast ? spellCast.spellCritWeight : 10
      }`
    )
    */
    spellCast = new Cast(mySettings, {
      spellHitWeight: spellCast ? spellCast.spellHitWeight : undefined,
      spellCritWeight: spellCast ? spellCast.spellCritWeight : undefined,
      spellCastTime: spellCast ? spellCast.effectiveCastTime : undefined,
      spellCrit: spellCast ? spellCast.effectiveSpellCrit : undefined
    })

    equipmentArray.push({
      dps: spellCast.dps.effective.avg,
      equipment: spellCast.player.equipment
    })
  }

  // console.log(`--- finished gear optimization ---`)
  equipmentArray.sort(sortByDPS)

  return equipmentArray[0].equipment
}

export default {
  sortByDPS,
  itemsForSlot,
  enchantsForSlot,
  equipment
}
