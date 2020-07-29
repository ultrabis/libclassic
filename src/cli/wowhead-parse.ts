import lc from '..'
import { exit } from 'process'

const argv = require('minimist')(process.argv.slice(2))
const fsPromises = require('fs').promises
const xml2js = require('xml2js')

const doIt = async (inputFile: string) => {
  const xmlString = await fsPromises.readFile(inputFile, 'utf8')
  const xmlParsed = await xml2js.parseStringPromise(xmlString)
  if (!xmlParsed || xmlParsed.wowhead.error) {
    console.error(`failed to parse xml`)
    exit(1)
  }

  const itemWowhead = xmlParsed.wowhead.item[0]
  console.log(itemWowhead)
}

const inputFile = argv._[0]
if (!inputFile) {
  console.error(`Usage: parse-wowhead <xmlFile>`)
  exit(1)
}

doIt(inputFile)

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
