const csv = require('csvtojson')

import libclassic from '../src'
import ItemSuffix from '../src/interface/ItemSuffix'

/* relative to project root */
const csvFilePath = 'contrib/itemSuffix.csv'

const start = async function () {
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvRecordArray = await csv().fromFile(csvFilePath)
  const ItemSuffixArray: ItemSuffix[] = []

  for (const csvRecord of csvRecordArray) {
    ItemSuffixArray.push(
      libclassic.itemSuffix.fromText(csvRecord.id, csvRecord.type, csvRecord.bonus, csvRecord.bonus2, csvRecord.bonus3)
    )
  }

  // console.log(JSON.stringify(csvArray, null, 1))
  console.log(JSON.stringify(ItemSuffixArray, null, 1))
}

void start()
