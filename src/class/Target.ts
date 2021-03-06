import common from '../module/common'

import Settings from '../interface/Settings'
import Buffs from '../enum/Buff'
import MagicSchool from '../enum/MagicSchool'

/* XXX: I originally wanted to allow user to select a target from a list. The lack of
 * resistance information on bosses makes this pretty fruitless, so I abandoned it.
interface TargetJSON {
  name: string
  level: number
  class: string
  faction: string
  health: number
  minDmg: number
  maxDmg: number
  attackSpeed: number
  armor: number
  fireResist: number
  natureResist: number
  frostResist: number
  shadowResist: number
  arcaneResist: number
}
*/

export default class Target {
  settings: Settings
  debuffMask: Buffs
  constructor(settings: Settings) {
    this.settings = settings
    this.debuffMask = common.buffMaskFromText(settings.target.debuffs.toString())
  }

  get level(): number {
    return this.settings.target.level
  }

  /* assumes character level 60 */
  get hitChance(): number {
    switch (this.level) {
      case 63:
        return 83
      case 62:
        return 94
      case 61:
        return 95
      case 60:
        return 96
      case 59:
        return 97
      case 58:
        return 98
      default:
        return 99
    }
  }

  get spellResistance(): number {
    return this.settings.target.spellResistance
  }

  get shimmer(): MagicSchool {
    return this.settings.target.shimmer
  }

  get spellVulnBonus(): number {
    return (this.debuffMask & Buffs.SpellVulnerability) === Buffs.SpellVulnerability ? 1.15 : 1.0
  }

  /**
   * ...reducing Shadow and Arcane resistances by 75...
   */
  get curseOfShadowResistBonus(): number {
    return (this.debuffMask & Buffs.CurseOfShadow) === Buffs.CurseOfShadow ? 75 : 0
  }

  /**
   * ...reducing nature resistances 25 per "jump"...
   */
  get thunderfuryResistBonus(): number {
    return this.settings.target.thunderfury ? this.settings.target.thunderfury * 25 : 0
  }

  /**
   * ...and increasing Shadow and Arcane damage taken by 10%...
   */
  get curseOfShadowDamageBonus(): number {
    return (this.debuffMask & Buffs.CurseOfShadow) === Buffs.CurseOfShadow ? 1.1 : 1.0
  }

  /**
   * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
   */
  get stormStrikeBonus(): number {
    return (this.debuffMask & Buffs.StormStrike) === Buffs.StormStrike ? 1.2 : 1.0
  }

  get arcaneSpellResistance(): number {
    return this.settings.target.spellResistance
  }

  get natureSpellResistance(): number {
    return this.settings.target.spellResistance
  }

  get fireSpellResistance(): number {
    return this.settings.target.spellResistance
  }

  get frostSpellResistance(): number {
    return this.settings.target.spellResistance
  }

  get shadowSpellResistance(): number {
    return this.settings.target.spellResistance
  }

  toJSON(): any {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = Object.assign({}, this)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      /* eslint-disable @typescript-eslint/no-unused-vars */
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key]
            jsonObj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }
      })

    return jsonObj
  }
}
