import Spell from '../class/Spell'

export default interface EncounterResults {
  dps: number
  spellHitWeight: number
  spellCritWeight: number
  intWeight: number
  manaReturn: {
    perTickCasting: number
    perTickNotCasting: number
    perTickInnervate: number
    perInnervate: number
  }
  gearTable: {
    headers: string[]
    data: string[][]
  }
  spell: Spell
}
