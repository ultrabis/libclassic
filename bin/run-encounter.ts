import libclassic from '../src'
import { exit } from 'process'

const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
// console.log(argv)

const inputFile = argv._[0]
if (!inputFile) {
  console.error(`Usage: run-encounter <settingsFile>`)
  exit(1)
}

let settings
try {
  settings = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
} catch {
  console.error(`Can't parse ${inputFile}. Is it valid JSON?`)
  exit(1)
}

const r = libclassic.run2(settings)
console.log(JSON.stringify(r, null, 2))
console.warn(JSON.stringify(settings, null, 2))
exit(0)
