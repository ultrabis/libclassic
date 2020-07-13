const fs = require('fs')

import libclassic from '../src'
import common from './common'

import GearItemJSONNew from '../src/interface/GearItemJSONNew'
import { exit } from 'process'

const keftenkCSVFile = 'contrib/gearItem.csv'

const start = async function () {
  const gearItemJSONNew: GearItemJSONNew[] = await common.gearItemJSONArrayFromKeftenk(keftenkCSVFile)
  console.log(JSON.stringify(gearItemJSONNew, null, 1))
}

void start()
