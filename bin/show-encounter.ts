import libclassic from '..'

const s = libclassic.common.defaultSettings
const e = new libclassic.Encounter(s)
console.log(JSON.stringify(e, null, 2))
