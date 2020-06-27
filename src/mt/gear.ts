import common from '../common'
import query from './query'

import ItemSuffixType from '../enum/ItemSuffixType'
import ItemBonus from '../interface/ItemBonus'
import ItemSuffixJSON from '../interface/ItemSuffixJSON'

const itemSuffixFromText = (
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
    type: common.enums.itemSuffixTypeFromText(type),
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
    type: common.enums.itemBonusTypeFromText(type),
    value: Number(value)
  }
}

const itemSuffixTypeFromItemName = (itemName: string): ItemSuffixType => {
  const of = itemName.toUpperCase().indexOf(' OF ')
  if (of === -1) {
    return ItemSuffixType.Invalid
  }

  const right = itemName.slice(of + 4)
  return common.enums.itemSuffixTypeFromText(right)
}

const itemSuffixesFromItemName = (itemName: string): ItemSuffixJSON[] => {
  const x = itemSuffixTypeFromItemName(itemName)
  return query.itemSuffixes({ type: x })
}

const itemSuffixFromItemNameAndBonusValue = (itemName: string, bonusValue: number): ItemSuffixJSON | undefined => {
  const itemSuffixes: ItemSuffixJSON[] = itemSuffixesFromItemName(itemName)

  for (let i = 0; i < itemSuffixes.length; i++) {
    for (let x = 0; x < itemSuffixes[i].bonus.length; x++) {
      if (itemSuffixes[i].bonus[x].value === bonusValue) {
        return itemSuffixes[i]
      }
    }
  }

  return undefined
}

export default {
  itemBonusFromText,
  itemSuffixTypeFromItemName,
  itemSuffixFromText,
  itemSuffixFromItemNameAndBonusValue,
  itemSuffixesFromItemName
}
