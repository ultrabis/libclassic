const csv = require('csvtojson')
const fs = require('fs')

import libclassic from '../src'
import GearItemSuffix from '../src/interface/GearItemSuffix'

/* relative to project root */
const gearItemSuffixInputFile = 'contrib/gearItemSuffix.csv'
const gearItemSuffixOutputFile = 'src/db/gearItemSuffix.json'

// const doGearItemSuffix = async function () {}

const start = async function () {
  /* do gearItemSuffix */
  console.warn(`[GearItemSuffix] parsing input (${gearItemSuffixInputFile})`)
  const csvRecordArray = await csv().fromFile(gearItemSuffixInputFile)
  const gearItemSuffixArray: GearItemSuffix[] = []

  for (const csvRecord of csvRecordArray) {
    gearItemSuffixArray.push(
      libclassic.mt.gearItemSuffix.fromText(
        csvRecord.id,
        csvRecord.type,
        csvRecord.bonus,
        csvRecord.bonus2,
        csvRecord.bonus3
      )
    )
  }

  console.warn(`[GearItemSuffix] writing output (${gearItemSuffixOutputFile})`)
  fs.writeFile(gearItemSuffixOutputFile, JSON.stringify(gearItemSuffixArray, null, 1), (err: Error) => {
    if (err) throw err
    console.log('[GearItemSuffix] complete')
  })

  /* do gearItem */
}

void start()
