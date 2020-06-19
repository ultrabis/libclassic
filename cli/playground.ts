#!/usr/bin/env node

import classic from '../dist'

import Faction from '../dist/enum/Faction'
import MagicSchool from '../dist/enum/MagicSchool'
// import MagicSchool from '../dist/enum/MagicSchool'

// console.log(Faction.Alliance)
// console.log(classic.MagicSchool.Holy)

const myFunction = (something: MagicSchool) => {
  return 2
}

/*
let myOptions = classic.DefaultOptions.defaults
let myEquipment = classic.Optimal.equipment(myOptions)
console.log(myEquipment)
*/

/*
let mySpell = new classic.Spell('Starfire Rank 1')
let myText = classic.Common.magicSchoolToText(classic.MagicSchool.Holy)
let myMagicSchool = classic.Common.magicSchoolFromText('Holy')

console.log(`hello world: ${mySpell.avgDmg}`)
console.log(`hello magic school: ${myText}`)
console.log(`Hello my magic school: ${myMagicSchool}`)
*/
