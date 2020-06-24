import ItemBonus from './ItemBonus'
import ItemSuffixType from '../enum/ItemSuffixType'

export default interface ItemSuffixJSON {
  id: number
  type: ItemSuffixType
  bonus: ItemBonus[]
}
