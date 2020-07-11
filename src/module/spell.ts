import Spell from '../interface/Spell'
import defaultObj from '../obj/spell.json'

const fromDefault = (): Spell => {
  return defaultObj
}

export default {
  fromDefault
}
