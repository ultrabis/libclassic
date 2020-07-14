import jsonQuery from 'json-query'
import itemSuffixDB from '../db/itemSuffix.json'

import common from './common'
import item from './item'
import ItemBonus from '../interface/ItemBonus'
import ItemSuffix from '../interface/ItemSuffix'

const fromItemNameAndBonusValue = (itemName: string, bonusValue: number): ItemSuffix | undefined => {
  const itemSuffixes: ItemSuffix[] = fromItemName(itemName)

  for (let i = 0; i < itemSuffixes.length; i++) {
    for (let x = 0; x < itemSuffixes[i].bonus.length; x++) {
      if (itemSuffixes[i].bonus[x].value === bonusValue) {
        return itemSuffixes[i]
      }
    }
  }

  return undefined
}

const fromItemName = (itemName: string): ItemSuffix[] => {
  const suffixType = common.itemSuffixTypeFromText(itemName)
  const result: ItemSuffix[] = jsonQuery(`[* type = ${suffixType}]`, { data: itemSuffixDB }).value
  return result
}

const fromText = (id: string, type: string, bonus: string, bonus2?: string, bonus3?: string): ItemSuffix => {
  const _bonus: ItemBonus[] = []
  _bonus.push(item.bonusFromText(bonus))
  if (bonus2) {
    _bonus.push(item.bonusFromText(bonus2))
  }
  if (bonus3) {
    _bonus.push(item.bonusFromText(bonus3))
  }

  return {
    id: Number(id),
    type: common.itemSuffixTypeFromText(type),
    bonus: _bonus
  }
}

export default {
  fromText,
  fromItemNameAndBonusValue,
  fromItemName
}
