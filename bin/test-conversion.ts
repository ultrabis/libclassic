const fs = require('fs')

import common from './common'
import GearItemJSONNew from '../src/interface/ItemJSONNew'

const csvFile = 'contrib/moonkin/item.csv'

const start = async function () {
  const gearItemJSONNew: GearItemJSONNew[] = await common.itemJSONArrayFromKeftenk(csvFile)
  console.log(JSON.stringify(gearItemJSONNew, null, 1))
}

void start()
