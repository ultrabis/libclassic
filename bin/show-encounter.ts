import libclassic from '../src'

const s = libclassic.getDefaultSettings()
const r = libclassic.run(s)
console.log(JSON.stringify(r, null, 2))
