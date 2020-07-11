const csv = require('csvtojson')

import libclassic from '../src'
import GearItemSuffix from '../src/interface/GearItemSuffix'

/* relative to project root */
const csvFilePath = 'contrib/gearItemSuffix.csv'

const start = async function () {
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvRecordArray = await csv().fromFile(csvFilePath)
  const GearItemSuffixArray: GearItemSuffix[] = []

  for (const csvRecord of csvRecordArray) {
    GearItemSuffixArray.push(
      libclassic.gearItemSuffix.fromText(
        csvRecord.id,
        csvRecord.type,
        csvRecord.bonus,
        csvRecord.bonus2,
        csvRecord.bonus3
      )
    )
  }

  // console.log(JSON.stringify(csvArray, null, 1))
  console.log(JSON.stringify(GearItemSuffixArray, null, 1))
}

void start()
