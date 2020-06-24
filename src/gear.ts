import utils from './utils'
import ItemSuffixType from './enum/ItemSuffixType'
import ItemBonusType from './enum/ItemBonusType'

import ItemBonus from './interface/ItemBonus'
import ItemSuffixJSON from './interface/ItemSuffixJSON'

const itemSuffixJSONFromText = (
  id: string,
  type: string,
  bonus: string,
  bonus2?: string,
  bonus3?: string
): ItemSuffixJSON => {
  const _bonus: ItemBonus[] = []
  _bonus.push(itemBonusFromText(bonus))
  if (bonus2) {
    _bonus.push(itemBonusFromText(bonus2))
  }
  if (bonus3) {
    _bonus.push(itemBonusFromText(bonus3))
  }

  return {
    id: Number(id),
    type: itemSuffixTypeFromText(type),
    bonus: _bonus
  }
}

// +11 Stamina
const itemBonusFromText = (bonus: string): ItemBonus => {
  let type: string
  let value: string

  const plusIndex = bonus.indexOf('+')
  const spaceIndex = bonus.indexOf(' ')
  if (bonus.toUpperCase().includes('10% ON GET HIT')) {
    const parenOpenIndex = bonus.indexOf('(')
    const parenCloseIndex = bonus.indexOf(')')
    type = '10% On Get Hit: Shadow Bolt'
    value = bonus.slice(parenOpenIndex + 1, parenCloseIndex - 7)
  } else if (bonus.charAt(0) === '+') {
    type = bonus.slice(spaceIndex + 1).trim()
    value = bonus.slice(plusIndex + 1, spaceIndex).trim()
  } else {
    type = bonus.slice(0, plusIndex - 1).trim()
    value = bonus.slice(plusIndex + 1).trim()
  }

  return {
    type: itemBonusTypeFromText(type),
    value: Number(value)
  }
}

const itemSuffixTypeFromItemName = (itemName: string): ItemSuffixType => {
  const of = itemName.toUpperCase().indexOf(' OF ')
  if (of === -1) {
    return ItemSuffixType.Invalid
  }

  const right = itemName.slice(of + 4)
  return itemSuffixTypeFromText(right)
}

const itemBonusTypeFromText = (text: string): ItemBonusType => {
  const _ = (text: string): typeof ItemBonusType[keyof typeof ItemBonusType] => {
    return Number(utils.getEnumValueFromFuzzyKey(ItemBonusType, text))
  }
  return _(text)
}

const itemSuffixTypeFromText = (text: string): ItemSuffixType => {
  const _ = (text: string): typeof ItemSuffixType[keyof typeof ItemSuffixType] => {
    const of = text.toUpperCase().indexOf('OF') // allow both 'the bear' and 'of the bear'
    return Number(utils.getEnumValueFromFuzzyKey(ItemSuffixType, of === -1 ? text : text.slice(of + 2)))
  }
  return _(text)
}

export default {
  itemBonusTypeFromText,
  itemBonusFromText,
  itemSuffixTypeFromText,
  itemSuffixTypeFromItemName,
  itemSuffixJSONFromText
}
