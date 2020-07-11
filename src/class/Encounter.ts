import optimal from '../module/optimal'

import Cast from './Cast'
import Settings from '../interface/Settings'
import GearItemJSON from '../interface/GearItemJSON'
import GearEnchantJSON from '../interface/GearEnchantJSON'

/* Encounter is the big top level object for all wow calculations. We want it run exactly once
   whenever a value in Settings is changed.

   - Creates the Cast() object where most work is done
   - Generates the item and enchant list when clicking an item/enchant
   - Does the expensive gear optimization
*/

export default class Encounter {
  spellCast: Cast
  items: GearItemJSON[] | undefined
  enchants: GearEnchantJSON[] | undefined

  constructor(settings: Settings) {
    this.items = optimal.itemsForSlot(settings)
    this.enchants = optimal.enchantsForSlot(settings)

    const equipment = optimal.equipment(settings)
    this.spellCast = new Cast(settings, { equipment: equipment })
  }
}
