import optimal from '../module/optimal'
import Cast from './Cast'
import ClassicOptions from '../interface/ClassicOptions'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'

/* Encounter is the big top level object for all wow calculations. We want it run exactly once
   whenever a value in Options is changed.

   - Creates the Cast() object where most work is done
   - Generates the item and enchant list when clicking an item/enchant
   - Does the expensive gear optimization
*/

export default class Encounter {
  options: ClassicOptions
  spellCast: Cast
  items: ItemJSON[] | undefined
  enchants: EnchantJSON[] | undefined

  constructor(options: ClassicOptions) {
    console.log('Encounter() called')
    this.options = options
    this.items = optimal.itemsForSlot(this.options)
    this.enchants = optimal.enchantsForSlot(this.options)

    let equipment = optimal.equipment(this.options)
    this.spellCast = new Cast(options, { equipment: equipment })
  }
}
