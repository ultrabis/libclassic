const csv = require('csvtojson')
const fs = require('fs')

import lc from '../src'
import ItemSuffix from '../src/interface/ItemSuffix'

/* relative to project root */
const itemSuffixInputFile = 'contrib/itemSuffix.csv'
const itemSuffixOutputFile = 'src/db/itemSuffix.json'

// const doGearItemSuffix = async function () {}

const start = async function () {
  /* do itemSuffix */
  console.warn(`[ItemSuffix] parsing input (${itemSuffixInputFile})`)
  const csvRecordArray = await csv().fromFile(itemSuffixInputFile)
  const itemSuffixArray: ItemSuffix[] = []

  for (const csvRecord of csvRecordArray) {
    itemSuffixArray.push(
      lc.itemSuffix.fromText(csvRecord.id, csvRecord.type, csvRecord.bonus, csvRecord.bonus2, csvRecord.bonus3)
    )
  }

  console.warn(`[ItemSuffix] writing output (${itemSuffixOutputFile})`)
  fs.writeFile(itemSuffixOutputFile, JSON.stringify(itemSuffixArray, null, 1), (err: Error) => {
    if (err) throw err
    console.log('[ItemSuffix] complete')
  })

  /* do gearItem */
}

void start()
