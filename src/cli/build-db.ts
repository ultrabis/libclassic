const csv = require('csvtojson')
const fs = require('fs')

import common from '../module/common'
import ItemSuffix from '../interface/ItemSuffix'
import { exit } from 'process'

/* relative to project root */
const itemInputFiles = ['contrib/moonkin/item.csv']
const itemSuffixInputFile = 'contrib/itemSuffix.csv'
const itemSuffixOutputFile = 'src/db/itemSuffix.json'

const doItemSuffix = async () => {
  console.warn(`[ItemSuffix] parsing input (${itemSuffixInputFile})`)
  const csvRecordArray = await csv().fromFile(itemSuffixInputFile)
  const itemSuffixArray: ItemSuffix[] = []

  for (const csvRecord of csvRecordArray) {
    itemSuffixArray.push(
      common.itemSuffixFromText(
        Number(csvRecord.id),
        csvRecord.type,
        csvRecord.bonus,
        csvRecord.bonus2,
        csvRecord.bonus3
      )
    )
  }

  console.warn(`[ItemSuffix] writing output (${itemSuffixOutputFile})`)
  try {
    fs.writeFileSync(itemSuffixOutputFile, JSON.stringify(itemSuffixArray, null, 1))
    console.warn(`[ItemSuffix] complete`)
  } catch (err) {
    console.error(`[ItemSuffix] Error: ${err}`)
    exit(1)
  }
}

const doItem = async () => {
  itemInputFiles.forEach((item) => {
    if (item.includes('moonkin')) {
      console.warn('[Item (moonkin)] yo')
    }
  })
}

const doAll = async () => {
  await doItemSuffix()
  await doItem()
}

void doAll()
