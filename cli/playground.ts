#!/usr/bin/env node

import classic from '../dist'
// import classic from '../src'

let myOptions = classic.DefaultOptions.defaults

// let myEncounter = new classic.Encounter(myOptions)

let myEquipment = classic.Optimal.equipment(myOptions)

console.log(myEquipment)

/*
let mySpell = new classic.Spell('Starfire Rank 1')
let myText = classic.Common.magicSchoolToText(classic.MagicSchool.Holy)
let myMagicSchool = classic.Common.magicSchoolFromText('Holy')

console.log(`hello world: ${mySpell.avgDmg}`)
console.log(`hello magic school: ${myText}`)
console.log(`Hello my magic school: ${myMagicSchool}`)
*/
