import utils from './utils'
import locked from './locked'

import Equipment from '../class/Equipment'
import Cast from '../class/Cast'

import ClassicOptions from '../interface/ClassicOptions'
import ItemSearch from '../interface/ItemSearch'
import EquipmentArray from '../interface/EquipmentArray'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'

import ItemSlot from '../enum/ItemSlot'

/*
interface OptimalEquipment {
  equipment: Equipment
  items: ItemJSON[]
  enchants: EnchantJSON[]
}
*/

const sortByDPS = (a: EquipmentArray, b: EquipmentArray): number => {
  return (b.dps ? b.dps : 0) - (a.dps ? a.dps : 0)
}

const itemsForSlot = (options: ClassicOptions): ItemJSON[] | undefined => {
  /* itemSearchSlot is only set when a user clicks a slot to equip an item. If that's not
   * the case then we don't need to do anything */
  const slot = options.equipment.itemSearchSlot
  if (slot === ItemSlot.None) {
    return undefined
  }

  /* We need the stat weights MINUS the slot we're getting items for. So make a private
   * copy of options, unequip the slot, and run the equipment optimization function.
   * Our stat weights will be contained in the itemSearch. */
  const tmpOptions: ClassicOptions = utils.cloneObject(options)
  locked.unequipItem(tmpOptions.equipment.lockedItems, slot)
  const tmpEquipment: Equipment = equipment(tmpOptions)
  const tmpItemSearch: ItemSearch = tmpEquipment.itemSearch

  /* and finally retrieve the items for this slot, using the weights
   * we just got. Copy the original version of what we overwrote above
   * and unlock the slot so it doesn't return a user locked item */
  tmpItemSearch.lockedItems = utils.cloneObject(options.equipment.lockedItems)
  locked.unlockItem(tmpItemSearch.lockedItems, tmpOptions.equipment.itemSearchSlot)
  return Equipment.getWeightedItemsBySlot(slot, tmpItemSearch)
}

const enchantsForSlot = (options: ClassicOptions): EnchantJSON[] | undefined => {
  /* Same process as above, but for enchants */
  const slot = options.equipment.enchantSearchSlot
  if (slot === ItemSlot.None) {
    return undefined
  }

  const tmpOptions: ClassicOptions = utils.cloneObject(options)
  locked.unequipEnchant(tmpOptions.equipment.lockedEnchants, slot)
  const tmpEquipment: Equipment = equipment(tmpOptions)
  const tmpItemSearch: ItemSearch = tmpEquipment.itemSearch

  tmpItemSearch.lockedEnchants = utils.cloneObject(options.equipment.lockedEnchants)
  locked.unlockEnchant(tmpItemSearch.lockedEnchants, tmpOptions.equipment.enchantSearchSlot)
  return Equipment.getWeightedEnchantsBySlot(slot, tmpItemSearch)
}

/* TODO: If itemSearchSlot isn't none, need to ignore that slot when weighting */
const equipment = (options: ClassicOptions): Equipment => {
  const myOptions = utils.cloneObject(options)
  const maxTries = 5
  let spellCast: Cast | undefined = undefined
  const equipmentArray = new Array<EquipmentArray>()

  console.log(`--- starting gear optimization with maximum of ${maxTries} tries ---`)
  for (let i = 0; i <= maxTries - 1; i++) {
    console.log(
      `Attempt ${i + 1}: spellHitWeight=${spellCast ? spellCast.spellHitWeight : 15}, spellCritWeight=${
        spellCast ? spellCast.spellCritWeight : 10
      }`
    )
    spellCast = new Cast(myOptions, {
      spellHitWeight: spellCast ? spellCast.spellHitWeight : undefined,
      spellCritWeight: spellCast ? spellCast.spellCritWeight : undefined,
      spellCastTime: spellCast ? spellCast.effectiveCastTime : undefined,
      spellCrit: spellCast ? spellCast.effectiveSpellCrit : undefined
    })

    equipmentArray.push({
      dps: spellCast.dps.effective.avg,
      equipment: spellCast.character.equipment
    })
  }

  console.log(`--- finished gear optimization ---`)
  equipmentArray.sort(sortByDPS)

  return equipmentArray[0].equipment
}

export default {
  sortByDPS,
  itemsForSlot,
  enchantsForSlot,
  equipment
}
