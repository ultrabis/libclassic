import common from '../common'
import spellDefault from '../db/spellDefault.json'
import Spell from '../interface/Spell'

const fromDefault = (): Spell => {
  return spellDefault
}

export default {
  fromDefault
}
