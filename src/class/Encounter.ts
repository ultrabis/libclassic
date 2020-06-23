import optimal from '../optimal'
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
  spellCast: Cast
  items: ItemJSON[] | undefined
  enchants: EnchantJSON[] | undefined

  constructor(options: ClassicOptions) {
    this.items = optimal.itemsForSlot(options)
    this.enchants = optimal.enchantsForSlot(options)

    const equipment = optimal.equipment(options)
    this.spellCast = new Cast(options, { equipment: equipment })
  }

  toJSON(): any {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = Object.assign({}, this)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      /* eslint-disable @typescript-eslint/no-unused-vars */
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key]
            jsonObj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }
      })

    return jsonObj
  }
}
