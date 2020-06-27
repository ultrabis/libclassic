export default interface EncounterResults {
  dps: number
  spellHitWeight: number
  spellCritWeight: number
  intWeight: number
  gearTable: {
    headers: string[]
    data: string[]
  }
}
