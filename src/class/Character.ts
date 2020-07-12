import common from '../module/common'

import Equipment from './Equipment'
import PlayableRace from '../enum/PlayableRace'
import Faction from '../enum/Faction'
import Buff from '../enum/Buff'
import Settings from '../interface/Settings'

/**
 * Stores player attributes, Talents, Gear, and Buff
 */
export default class Character {
  settings: Settings
  equipment: Equipment
  buffMask: number

  constructor(settings: Settings, equipment: Equipment) {
    this.settings = settings
    this.equipment = equipment
    this.buffMask = common.buffMaskFromText(settings.player.buffs.toString())
  }

  get level(): number {
    return this.settings.player.level
  }

  get faction(): Faction {
    return common.factionFromRace(this.settings.player.race)
  }

  get isHorde(): boolean {
    return (this.faction & Faction.Horde) === Faction.Horde
  }

  get isAlliance(): boolean {
    return (this.faction & Faction.Alliance) === Faction.Alliance
  }

  get isTauren(): boolean {
    return this.settings.player.race === PlayableRace.Tauren
  }

  get isNightElf(): boolean {
    return this.settings.player.race === PlayableRace.NightElf
  }

  /**
   * TODO: https://classicwow.live/guides/46/basic-stats-sheet
   */

  get health(): number {
    return 1368 + 10 * this.stamina * (this.isTauren ? 1.05 : 1)
  }

  get mana(): number {
    return 964 + 15 * this.intellect
  }

  get stamina(): number {
    return (
      ((this.isNightElf ? 69 : 72) + this.equipment.stamina + this.improvedGiftOfTheWildAttributeBonus) *
      this.spiritOfZandalarBonus *
      (this.isAlliance ? this.blessingOfKingsBonus : 1)
    )
  }

  get intellect(): number {
    return (
      ((this.isNightElf ? 100 : 95) +
        this.equipment.intellect +
        this.arcaneBrillianceBonus +
        this.improvedGiftOfTheWildAttributeBonus +
        this.songflowerSerenadeAttributeBonus +
        this.cerebralCortexCompoundBonus +
        this.runnTumTuberSurpriseBonus) *
      this.spiritOfZandalarBonus *
      (this.isAlliance ? this.blessingOfKingsBonus : 1)
    )
  }

  get spirit(): number {
    return (
      (this.isNightElf ? 110 : 112) +
      this.equipment.spirit +
      this.improvedGiftOfTheWildAttributeBonus *
        this.spiritOfZandalarBonus *
        (this.isAlliance ? this.blessingOfKingsBonus : 1)
    )
  }

  get mp5(): number {
    return this.equipment.mp5
  }

  get spellDamage(): number {
    return this.equipment.spellDamage
  }

  get arcaneDamage(): number {
    return this.equipment.arcaneDamage
  }

  get natureDamage(): number {
    return this.equipment.natureDamage
  }

  get spellCritFromIntellect(): number {
    return this.intellect / 60
  }

  get spellCritFromEquipment(): number {
    return this.equipment.spellCrit
  }

  get spellCritUnbuffed(): number {
    return this.spellCritFromIntellect + this.spellCritFromEquipment
  }

  /**
   * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
   */
  get spellCrit(): number {
    return Math.min(
      common.spellCritCap,
      this.spellCritUnbuffed +
        this.rallyingCryOfTheDragonSlayerSpellCritBonus +
        this.moonkinAuraBonus +
        this.slipkiksSavvyBonus +
        this.songflowerSerenadeSpellCritBonus
    )
  }

  /**
   * TODO: Return total spell hit rating (equipment + talents + buffs)
   */
  get effectiveSpellHit(): number {
    return Math.min(this.spellHit, common.spellHitCap)
  }

  get spellHit(): number {
    return this.equipment.spellHit
  }

  get moonkinAuraBonus(): number {
    return (this.buffMask & Buff.MoonkinAura) === Buff.MoonkinAura ? 3 : 0
  }

  /* CONSUMABLE BUFFS */

  get flaskOfSupremePowerBonus(): number {
    return (this.buffMask & Buff.FlaskOfSupremePower) === Buff.FlaskOfSupremePower ? 150 : 0
  }

  get greaterArcaneElixirBonus(): number {
    return (this.buffMask & Buff.GreaterArcaneElixir) === Buff.GreaterArcaneElixir ? 35 : 0
  }

  get cerebralCortexCompoundBonus(): number {
    return (this.buffMask & Buff.CerebralCortexCompound) === Buff.CerebralCortexCompound ? 25 : 0
  }

  get runnTumTuberSurpriseBonus(): number {
    return (this.buffMask & Buff.RunnTumTuberSurprise) === Buff.RunnTumTuberSurprise ? 10 : 0
  }

  /* PROC BUFFS */

  get powerInfusionBonus(): number {
    return (this.buffMask & Buff.PowerInfusion) === Buff.PowerInfusion ? 1.2 : 1.0
  }

  get ephemeralPowerBonus(): number {
    return (this.buffMask & Buff.EphemeralPower) === Buff.EphemeralPower ? 175 : 0
  }

  /* WORLD BUFFS */

  get rallyingCryOfTheDragonSlayerSpellCritBonus(): number {
    return (this.buffMask & Buff.RallyingCryOfTheDragonSlayer) === Buff.RallyingCryOfTheDragonSlayer ? 10 : 0
  }

  get slipkiksSavvyBonus(): number {
    return (this.buffMask & Buff.SlipkiksSavvy) === Buff.SlipkiksSavvy ? 3 : 0
  }

  get songflowerSerenadeSpellCritBonus(): number {
    return (this.buffMask & Buff.SongflowerSerenade) === Buff.SongflowerSerenade ? 5 : 0
  }

  get songflowerSerenadeAttributeBonus(): number {
    return (this.buffMask & Buff.SongflowerSerenade) === Buff.SongflowerSerenade ? 15 : 0
  }

  get saygesDarkFortuneBonus(): number {
    return (this.buffMask & Buff.SaygesDarkFortune) === Buff.SaygesDarkFortune ? 1.1 : 1.0
  }

  get tracesOfSilithystBonus(): number {
    return (this.buffMask & Buff.TracesOfSilithyst) === Buff.TracesOfSilithyst ? 1.05 : 1.0
  }

  get spiritOfZandalarBonus(): number {
    return (this.buffMask & Buff.SpiritOfZandalar) === Buff.SpiritOfZandalar ? 1.15 : 1
  }

  /* RAID BUFFS */

  get arcaneBrillianceBonus(): number {
    return (this.buffMask & Buff.ArcaneBrilliance) === Buff.ArcaneBrilliance ? 31 : 0
  }

  get blessingOfKingsBonus(): number {
    return (this.buffMask & Buff.BlessingOfKings) === Buff.BlessingOfKings ? 1.1 : 1
  }

  get improvedGiftOfTheWildAttributeBonus(): number {
    return (this.buffMask & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 16 : 0
  }

  get improvedGiftOfTheWildArmorBonus(): number {
    return (this.buffMask & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 384 : 0
  }

  get improvedGiftOfTheWildResistancesBonus(): number {
    return (this.buffMask & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 27 : 0
  }

  get burningAdrenalineDamageBonus(): number {
    return (this.buffMask & Buff.BurningAdrenaline) === Buff.BurningAdrenaline ? 2 : 1
  }

  get burningAdrenalineCastTimeBonus(): number {
    return (this.buffMask & Buff.BurningAdrenaline) === Buff.BurningAdrenaline ? 3.5 : 0
  }

  /* TALENTS */
  get improvedMoonfireBonus(): number {
    switch (this.settings.player.talents.improvedMoonfireRank) {
      case 1:
        return 2 // rank 1: 2% bonus
      case 2:
        return 4 // rank 2: 4% bonus
      case 3:
        return 6 // rank 3: 6% bonus
      case 4:
        return 8 // rank 4: 8% bonus
      case 5:
        return 10 // rank 5: 10% bonus
      default:
        return 0 // rank 0: 0% bonus
    }
  }

  /**
   * Increases the damage done by Starfire, Moonfire, and Wrath by 2/4/6/8/10%
   */
  get moonFuryBonus(): number {
    switch (this.settings.player.talents.moonFuryRank) {
      case 1:
        return 1.02 // rank 1: 2% bonus
      case 2:
        return 1.04 // rank 2: 4% bonus
      case 3:
        return 1.06 // rank 3: 6% bonus
      case 4:
        return 1.08 // rank 4: 8% bonus
      case 5:
        return 1.1 // rank 5: 10% bonus
      default:
        return 1.0 // rank 0: 0% bonus
    }
  }

  /**
   * Reduces the cast of your Wrath spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  get improvedWrathBonus(): number {
    switch (this.settings.player.talents.improvedWrathRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Wrath spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Wrath spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Wrath spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Wrath spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Wrath spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Reduces the cast of your Starfire spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  get improvedStarfireBonus(): number {
    switch (this.settings.player.talents.improvedStarfireRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Starfire spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Starfire spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Starfire spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Starfire spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Starfire spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by x%.
   */
  get vengeanceBonus(): number {
    switch (this.settings.player.talents.vengeanceRank) {
      case 1:
        return 0.1 // rank 1: Increases the critical strike damage bonus by 20%
      case 2:
        return 0.2 // rank 2: Increases the critical strike damage bonus by 40%
      case 3:
        return 0.3 // rank 3: Increases the critical strike damage bonus by 60%
      case 4:
        return 0.4 // rank 4: Increases the critical strike damage bonus by 80%
      case 5:
        return 0.5 // rank 5: Increases the critical strike damage bonus by 100%
      default:
        return 0.0
    }
  }

  /**
   * Allows x% of your Mana regeneration to continue while casting.
   */
  get reflectionBonus(): number {
    switch (this.settings.player.talents.reflectionRank) {
      case 1:
        return 0.05
      case 2:
        return 0.1
      case 3:
        return 0.15
      default:
        return 0
    }
  }

  /**
   * Returns natures grace reduction, if the talent is learned
   */
  get naturesGraceBonus(): number {
    return this.settings.player.talents.naturesGraceRank === 1 ? 0.5 : 0
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
