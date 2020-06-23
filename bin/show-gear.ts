import libclassic from '..'
import blessed from 'blessed'
import contrib from 'blessed-contrib'

const o = libclassic.common.defaultOptions
const e = libclassic.optimal.equipment(o)

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
table.setData(e.itemsAsBlessedTable)
screen.key(['escape', 'q', 'C-c'], function () {
  return process.exit(0)
})
screen.render()