import classic from '../dist'
import MagicSchool from '../dist/enum/MagicSchool'

let mySpell = new classic.Spell('Starfire Rank 1')

let myText = classic.Common.magicSchoolToText(classic.MagicSchool.Holy)
let myMagicSchool = classic.Common.magicSchoolFromText('Holy')

console.log(`hello world: ${mySpell.avgDmg}`)
console.log(`hello magic school: ${myText}`)
console.log(`Hello my magic school: ${myMagicSchool}`)
