import libclassic from '..'

const o = libclassic.common.defaultOptions
const e = new libclassic.Encounter(o)
console.log(JSON.stringify(e, null, 2))
