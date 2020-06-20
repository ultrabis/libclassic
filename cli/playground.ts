#!/usr/bin/env node

import classic from '../dist'
import blessed from 'blessed'
import contrib from 'blessed-contrib'

let o = classic.common.defaultOptions
let e = classic.optimal.equipment(o)

let screen = blessed.screen()
let table = contrib.table({
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
table.setData(e.itemsAsBlessedTable)
screen.key(['escape', 'q', 'C-c'], function(ch: any, key: any) {
  return process.exit(0)
})
screen.render()
