import lc from '..'
import Encounter from '../interface/Encounter'
import blessed from 'blessed'
import contrib from 'blessed-contrib'
import Item from '../interface/Item'
import Enchant from '../interface/Enchant'
import Gear from '../interface/Gear'
import GearSlot from '../enum/GearSlot'
import BlessedContrib from 'blessed-contrib'

const s = lc.common.defaultSettings()
const r: Encounter = lc.run(s)

/* 
const getValue = (gearSettingsObj: GearSettings, index: number, gearSlot: GearSlot): number => {
  return gearSettingsObj.custom[gearSlot][index]
}
*/

const _item = (gear: Gear, gearSlot: GearSlot) => {
  return gear.custom[gearSlot][0]
}

interface TableData {
  headers: string[]
  data: string[][]
}

/*
const gearAsBlessedTable = (gear: Gear) => {
    return {
      headers: ['Slot', 'Name', 'Score', 'Spell Damage', 'Spell Hit', 'Spell Crit', 'Intellect'],
      data: [
        [
          'Head',
          _item(gear, GearSlot.Head).name.toString(),
          _item(gear, GearSlot.Head).score.toString(),
          this.head.spellDamage.toString(),
          this.head.spellHit.toString(),
          this.head.spellCrit.toString(),
          this.head.intellect.toString()
        ],
        [
          'Hands',
          this.hands.name,
          this.hands.score.toFixed(3).toString(),
          this.hands.spellDamage.toString(),
          this.hands.spellHit.toString(),
          this.hands.spellCrit.toString(),
          this.hands.intellect.toString()
        ],
        [
          'Neck',
          this.neck.name,
          this.neck.score.toFixed(3).toString(),
          this.neck.spellDamage.toString(),
          this.neck.spellHit.toString(),
          this.neck.spellCrit.toString(),
          this.neck.intellect.toString()
        ],
        [
          'Waist',
          this.waist.name,
          this.waist.score.toFixed(3).toString(),
          this.waist.spellDamage.toString(),
          this.waist.spellHit.toString(),
          this.waist.spellCrit.toString(),
          this.waist.intellect.toString()
        ],
        [
          'Shoulder',
          this.shoulder.name,
          this.shoulder.score.toFixed(3).toString(),
          this.shoulder.spellDamage.toString(),
          this.shoulder.spellHit.toString(),
          this.shoulder.spellCrit.toString(),
          this.shoulder.intellect.toString()
        ],
        [
          'Legs',
          this.legs.name,
          this.legs.score.toFixed(3).toString(),
          this.legs.spellDamage.toString(),
          this.legs.spellHit.toString(),
          this.legs.spellCrit.toString(),
          this.legs.intellect.toString()
        ],
        [
          'Back',
          this.back.name,
          this.back.score.toFixed(3).toString(),
          this.back.spellDamage.toString(),
          this.back.spellHit.toString(),
          this.back.spellCrit.toString(),
          this.back.intellect.toString()
        ],
        [
          'Feet',
          this.feet.name,
          this.feet.score.toFixed(3).toString(),
          this.feet.spellDamage.toString(),
          this.feet.spellHit.toString(),
          this.feet.spellCrit.toString(),
          this.feet.intellect.toString()
        ],
        [
          'Chest',
          this.chest.name,
          this.chest.score.toFixed(3).toString(),
          this.chest.spellDamage.toString(),
          this.chest.spellHit.toString(),
          this.chest.spellCrit.toString(),
          this.chest.intellect.toString()
        ],
        [
          'Wrist',
          this.wrist.name,
          this.wrist.score.toFixed(3).toString(),
          this.wrist.spellDamage.toString(),
          this.wrist.spellHit.toString(),
          this.wrist.spellCrit.toString(),
          this.wrist.intellect.toString()
        ],
        [
          'Mainhand',
          this.mainhand.name,
          this.mainhand.score.toFixed(3).toString(),
          this.mainhand.spellDamage.toString(),
          this.mainhand.spellHit.toString(),
          this.mainhand.spellCrit.toString(),
          this.mainhand.intellect.toString()
        ],
        [
          'Offhand',
          this.offhand.name,
          this.offhand.score.toFixed(3).toString(),
          this.offhand.spellDamage.toString(),
          this.offhand.spellHit.toString(),
          this.offhand.spellCrit.toString(),
          this.offhand.intellect.toString()
        ],
        [
          'Finger',
          this.finger.name,
          this.finger.score.toFixed(3).toString(),
          this.finger.spellDamage.toString(),
          this.finger.spellHit.toString(),
          this.finger.spellCrit.toString(),
          this.finger.intellect.toString()
        ],
        [
          'Finger 2',
          this.finger2.name,
          this.finger2.score.toFixed(3).toString(),
          this.finger2.spellDamage.toString(),
          this.finger2.spellHit.toString(),
          this.finger2.spellCrit.toString(),
          this.finger2.intellect.toString()
        ],
        [
          'Trinket',
          this.trinket.name,
          this.trinket.score.toFixed(3).toString(),
          this.trinket.spellDamage.toString(),
          this.trinket.spellHit.toString(),
          this.trinket.spellCrit.toString(),
          this.trinket.intellect.toString()
        ],
        [
          'Trinket 2',
          this.trinket2.name,
          this.trinket2.score.toFixed(3).toString(),
          this.trinket2.spellDamage.toString(),
          this.trinket2.spellHit.toString(),
          this.trinket2.spellCrit.toString(),
          this.trinket2.intellect.toString()
        ]
      ]
    }
  }
*/

const gearAsBlessedTable = (gear: Gear): TableData => {
  // enumerate gearSlot
  const vals = lc.utils.getAllEnumValues(GearSlot)
  const data = []

  for (let i = 0; i < vals.length; i++) {
    const key = GearSlot[i]
    const val = vals[i]

    if (val === GearSlot.Relic || val === GearSlot.Ranged || val === GearSlot.Quiver) {
      console.log(`skipping ${key}`)
      continue
    }

    if (gear.custom[val][0] === undefined) {
      continue
    }

    const item = _item(gear, val)
    const slot = key
    const name = item.name ? item.name : ''
    const score = item.score ? `${item.score}` : '0'
    const spellDamage = item.spellDamage ? `${item.spellDamage}` : '0'
    const spellHit = item.spellHit ? `${item.spellHit}` : '0'
    const spellCrit = item.spellCrit ? `${item.spellCrit}` : '0'
    const intellect = item.intellect ? `${item.intellect}` : '0'

    data.push([slot, name, score, spellDamage, spellHit, spellCrit, intellect])
  }

  return {
    headers: ['Slot', 'Name', 'Score', 'Spell Damage', 'Spell Hit', 'Spell Crit', 'Intellect'],
    data: data
  }
}

const tableData = gearAsBlessedTable(r.gear)

// console.log(tableData)

const screen = blessed.screen()
const table = contrib.table({
  keys: true,
  vi: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'blue',
  interactive: 'true',
  width: '100%',
  height: '100%',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 5,
  columnWidth: [10, 40, 7, 15, 10, 10, 10]
})

table.focus()
screen.append(table)
table.setData(tableData)
screen.key(['escape', 'q', 'C-c'], function () {
  return process.exit(0)
})
screen.render()
