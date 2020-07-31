import jsonQuery from 'json-query'
import itemSuffixDB from '../db/itemSuffix.json'

import common from './common'
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

export default {
  fromItemNameAndBonusValue,
  fromItemName
}
