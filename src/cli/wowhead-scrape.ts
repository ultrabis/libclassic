import lc from '..'
import { exit } from 'process'
import { dotDivide } from 'mathjs'

const request = require('requestretry')
const cheerio = require('cheerio')
const argv = require('minimist')(process.argv.slice(2))

// validSuffixIdsFromWowhead()
const itemId = argv._[0] ? Number(argv._[0]) : 0
if (!itemId) {
  console.error(`Usage: scrape-wowhead-suffix <itemId>`)
  exit(1)
}

wowheadVaidSuffixIds(itemId)

/*
let settings
try {
  settings = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
} catch {
  console.error(`Can't parse ${inputFile}. Is it valid JSON?`)
  exit(1)
}

const r = lc.run2(settings)
console.log(JSON.stringify(r, null, 2))
console.warn(JSON.stringify(settings, null, 2))
exit(0)
*/
