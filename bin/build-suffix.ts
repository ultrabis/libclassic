const csv = require('csvtojson')

import libclassic from '../src'
import ItemSuffixJSON from '../src/interface/ItemSuffixJSON'

/* relative to project root */
const csvFilePath = 'contrib/itemSuffix.csv'

const start = async function () {
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvRecordArray = await csv().fromFile(csvFilePath)
  const itemSuffixJSONArray: ItemSuffixJSON[] = []

  for (const csvRecord of csvRecordArray) {
    itemSuffixJSONArray.push(
      libclassic.gear.itemSuffixFromText(
        csvRecord.id,
        csvRecord.type,
        csvRecord.bonus,
        csvRecord.bonus2,
        csvRecord.bonus3
      )
    )
  }

  // console.log(JSON.stringify(csvArray, null, 1))
  console.log(JSON.stringify(itemSuffixJSONArray, null, 1))
}

void start()
