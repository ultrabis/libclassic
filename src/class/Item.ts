import common from '../module/common'

import ItemJSON from '../interface/ItemJSON'
import ItemSetJSON from '../interface/ItemSetJSON'
import EnchantJSON from '../interface/EnchantJSON'

import MagicSchool from '../enum/MagicSchool'
import ItemQuality from '../enum/ItemQuality'
import GearSlot from '../enum/GearSlot'
import ItemClass from '../enum/ItemClass'
import SpellCritFromIntellectDivisor from '../enum/SpellCritFromIntellectDivisor'
import ArmorSubclass from '../enum/ArmorSubclass'
import WeaponSubclass from '../enum/WeaponSubclass'
import PlayableClass from '../enum/PlayableClass'
import PvPRank from '../enum/PvPRank'
import Faction from '../enum/Faction'
import TargetType from '../enum/TargetType'
import GearState from '../enum/GearState'
import ItemSlot from '../enum/ItemSlot'

export default class Item {
  itemSlot: ItemSlot
  gearSlot: GearSlot
  itemJSON: ItemJSON | undefined
  enchantJSON: EnchantJSON | undefined

  constructor(slot: ItemSlot, itemJSON?: ItemJSON, enchantJSON?: EnchantJSON) {
    this.itemSlot = slot
    this.gearSlot = common.gearSlotFromItemSlot(slot)
    this.itemJSON = itemJSON ? itemJSON : undefined
    this.enchantJSON = enchantJSON ? enchantJSON : undefined
  }

  static sortScoreAsc(a: ItemJSON | EnchantJSON, b: ItemJSON | EnchantJSON): number {
    return (a.score ? a.score : 0) - (b.score ? b.score : 0)
  }

  static sortScoreDes(a: ItemJSON | EnchantJSON, b: ItemJSON | EnchantJSON): number {
    return (b.score ? b.score : 0) - (a.score ? a.score : 0)
  }

  /* Handle items that only damage certain types of mobs */
  static calcTargetDamage(targetType: number, targetTypes: number, spellDamage: number): number {
    if (targetTypes === TargetType.All) {
      return spellDamage
    }

    switch (targetType) {
      case TargetType.Undead:
        return (targetTypes & TargetType.Undead) === TargetType.Undead ? spellDamage : 0
      case TargetType.Demon:
        return (targetTypes & TargetType.Demon) === TargetType.Demon ? spellDamage : 0
      default:
        return 0
    }
  }

  static scoreItem(
    item: ItemJSON,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      this.calcTargetDamage(
        targetType,
        item.targetTypes ? item.targetTypes : TargetType.All,
        item.spellDamage ? item.spellDamage : 0
      ),
      item.arcaneDamage ? item.arcaneDamage : 0,
      item.natureDamage ? item.natureDamage : 0,
      item.spellHit ? item.spellHit : 0,
      item.spellCrit ? item.spellCrit : 0,
      item.intellect ? item.intellect : 0,
      spellHitWeight,
      spellCritWeight
    )
  }

  static scoreItemSetBonus(
    itemSet: ItemSetJSON,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      this.calcTargetDamage(targetType, TargetType.All, itemSet.spellDamage ? itemSet.spellDamage : 0),
      0,
      0,
      itemSet.spellHit ? itemSet.spellHit : 0,
      itemSet.spellCrit ? itemSet.spellCrit : 0,
      0,
      spellHitWeight,
      spellCritWeight
    )
  }

  static scoreEnchant(
    enchant: EnchantJSON,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      enchant.spellDamage,
      enchant.arcaneDamage,
      enchant.natureDamage,
      enchant.spellHit,
      enchant.spellCrit,
      enchant.intellect,
      spellHitWeight,
      spellCritWeight
    )
  }

  static score(
    magicSchool: MagicSchool,
    spellDamage: number,
    arcaneDamage: number,
    natureDamage: number,
    spellHit: number,
    spellCrit: number,
    intellect: number,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    const totalScore =
      spellDamage +
      (magicSchool && magicSchool === MagicSchool.Arcane ? arcaneDamage : 0) +
      (magicSchool && magicSchool === MagicSchool.Nature ? natureDamage : 0) +
      spellHit * spellHitWeight +
      spellCrit * spellCritWeight +
      (intellect / SpellCritFromIntellectDivisor.Druid) * spellCritWeight

    return parseFloat(totalScore.toFixed(3))
  }

  get id(): number {
    return this.itemJSON && this.itemJSON.id ? this.itemJSON.id : 0
  }

  get suffixId(): number {
    return this.itemJSON && this.itemJSON.suffixId ? this.itemJSON.suffixId : 0
  }

  get enchantId(): number {
    return this.enchantJSON && this.enchantJSON.id ? this.enchantJSON.id : 0
  }

  get name(): string {
    return this.itemJSON && this.itemJSON.name ? this.itemJSON.name : this.slotDisplayName
  }

  get class(): ItemClass {
    if (this.itemJSON && this.itemJSON.class) {
      return this.itemJSON.class
    }

    switch (this.gearSlot) {
      case GearSlot.Mainhand:
        return ItemClass.Weapon
      default:
        return ItemClass.Armor
    }
  }

  get isWeapon(): boolean {
    return this.class === ItemClass.Weapon
  }

  get isArmor(): boolean {
    return this.class === ItemClass.Armor
  }

  get subclass(): WeaponSubclass | ArmorSubclass {
    if (this.itemJSON && this.itemJSON.subclass) {
      return this.itemJSON.subclass
    }

    if (this.class === ItemClass.Weapon) {
      return WeaponSubclass.Empty
    }

    return ArmorSubclass.Empty
  }

  get subclassName(): string {
    if (this.class === ItemClass.Armor) {
      switch (this.subclass) {
        default:
          return ArmorSubclass[this.subclass]
      }
    }

    switch (this.subclass) {
      case WeaponSubclass.OneHandedMace:
        return 'Mace'
      default:
        return WeaponSubclass[this.subclass]
    }
  }

  get slotName(): string {
    switch (this.gearSlot) {
      case GearSlot.Trinket2:
        return GearSlot[GearSlot.Trinket]
      case GearSlot.Finger2:
        return GearSlot[GearSlot.Finger]
      case GearSlot.Mainhand:
        return 'Main Hand'
      case GearSlot.Head:
      case GearSlot.Neck:
      case GearSlot.Shoulder:
      case GearSlot.Chest:
      case GearSlot.Waist:
      case GearSlot.Legs:
      case GearSlot.Feet:
      case GearSlot.Wrist:
      case GearSlot.Hands:
      case GearSlot.Finger:
      case GearSlot.Trinket:
      case GearSlot.Ranged:
      case GearSlot.Back:
      case GearSlot.Offhand:
      case GearSlot.Ranged:
      case GearSlot.Relic:
      case GearSlot.Quiver:
      default:
        return GearSlot[this.gearSlot]
    }
  }

  get slotDisplayName(): string {
    switch (this.gearSlot) {
      case GearSlot.Mainhand:
        return 'Main Hand'
      case GearSlot.Finger:
        return 'Finger 1'
      case GearSlot.Finger2:
        return 'Finger 2'
      case GearSlot.Offhand:
        return 'Off Hand'
      case GearSlot.Trinket:
        return 'Trinket 1'
      case GearSlot.Trinket2:
        return 'Trinket 2'
      case GearSlot.Head:
      case GearSlot.Neck:
      case GearSlot.Shoulder:
      case GearSlot.Chest:
      case GearSlot.Waist:
      case GearSlot.Legs:
      case GearSlot.Feet:
      case GearSlot.Wrist:
      case GearSlot.Hands:
      case GearSlot.Ranged:
      case GearSlot.Back:
      case GearSlot.Relic:
      default:
        return GearSlot[this.gearSlot]
    }
  }

  get isEmpty(): boolean {
    if (!this.itemJSON) {
      return true
    }

    if (this.itemJSON.id === GearState.Naked) {
      return true
    }

    return false
  }

  get quality(): ItemQuality {
    return this.itemJSON && this.itemJSON.quality ? this.itemJSON.quality : ItemQuality.Poor
  }

  get qualityName(): string {
    return ItemQuality[this.quality]
  }

  get level(): number {
    return this.itemJSON && this.itemJSON.level ? this.itemJSON.level : 0
  }

  get reqLevel(): number {
    return this.itemJSON && this.itemJSON.reqLevel ? this.itemJSON.reqLevel : 0
  }

  get isBop(): boolean {
    return this.itemJSON && this.itemJSON.bop ? true : false
  }

  get isUnique(): boolean {
    return this.itemJSON && this.itemJSON.unique ? this.itemJSON.unique : false
  }

  get allowableClasses(): PlayableClass[] {
    return this.itemJSON && this.itemJSON.allowableClasses ? this.itemJSON.allowableClasses : []
  }

  get allowableClassesText(): string {
    const ac = this.allowableClasses
    let text = ''

    for (let _i = 0; _i < ac.length; _i++) {
      text += PlayableClass[ac[_i]]
      if (_i < ac.length - 1) {
        text += ', '
      }
    }
    return text
  }

  get targetTypes(): TargetType {
    return this.itemJSON && this.itemJSON.targetTypes ? this.itemJSON.targetTypes : TargetType.All
  }

  get phase(): number {
    return this.itemJSON && this.itemJSON.phase ? this.itemJSON.phase : 1
  }

  get pvpRank(): PvPRank {
    return this.itemJSON && this.itemJSON.pvpRank ? this.itemJSON.pvpRank : PvPRank.Grunt
  }

  get icon(): string {
    let emptySlot = `${this.slotName.split(' ').join('')}`
    if (emptySlot === 'Offhand') {
      emptySlot = 'OffHand'
    }
    if (emptySlot === 'Onehand') {
      emptySlot = 'MainHand'
    }

    return this.isEmpty || !this.itemJSON ? `${emptySlot}.jpg` : `${this.itemJSON.icon}.jpg`
  }

  get location(): string {
    return this.itemJSON && this.itemJSON.location ? this.itemJSON.location : ''
  }

  get boss(): string {
    return this.itemJSON && this.itemJSON.boss ? this.itemJSON.boss : ''
  }

  get worldBoss(): boolean {
    return this.itemJSON && this.itemJSON.worldBoss === true ? true : false
  }

  get faction(): Faction {
    return this.itemJSON && this.itemJSON.faction ? this.itemJSON.faction : Faction.Horde
  }

  get score(): number {
    return this.itemJSON && this.itemJSON.score ? this.itemJSON.score : 0
  }

  get onUseText(): string {
    if (!this.itemJSON || !this.itemJSON.onUse || !this.itemJSON.onUse.effect) {
      return ``
    }

    const effect = this.itemJSON.onUse.effect
    const cooldown = this.itemJSON.onUse.cooldown ? `(${this.itemJSON.onUse.cooldown})` : ``

    return `${effect} ${cooldown}`
  }

  get hasOnUse(): boolean {
    return this.itemJSON && this.itemJSON.onUse ? true : false
  }

  get bindText(): string {
    return 'Binds ' + (this.isBop ? 'when picked up' : 'when equipped')
  }

  get _stamina(): number {
    return this.itemJSON && this.itemJSON.stamina ? this.itemJSON.stamina : 0
  }

  get stamina(): number {
    return this._stamina + (this.enchantJSON ? this.enchantJSON.stamina : 0)
  }

  get _spirit(): number {
    return this.itemJSON && this.itemJSON.spirit ? this.itemJSON.spirit : 0
  }

  get spirit(): number {
    return this._spirit + (this.enchantJSON ? this.enchantJSON.spirit : 0)
  }

  get _spellHealing(): number {
    return this.itemJSON && this.itemJSON.spellHealing ? this.itemJSON.spellHealing : 0
  }

  get spellHealing(): number {
    return this._spellHealing + (this.enchantJSON && this.enchantJSON.spellHealing ? this.enchantJSON.spellHealing : 0)
  }

  get _spellDamage(): number {
    return this.itemJSON && this.itemJSON.spellDamage ? this.itemJSON.spellDamage : 0
  }

  get spellDamage(): number {
    return this._spellDamage + (this.enchantJSON ? this.enchantJSON.spellDamage : 0)
  }

  get spellPenetration(): number {
    return this.itemJSON && this.itemJSON.spellPenetration ? this.itemJSON.spellPenetration : 0
  }

  get _arcaneDamage(): number {
    return this.itemJSON && this.itemJSON.arcaneDamage ? this.itemJSON.arcaneDamage : 0
  }

  get arcaneDamage(): number {
    return this._arcaneDamage + (this.enchantJSON ? this.enchantJSON.arcaneDamage : 0)
  }

  get _natureDamage(): number {
    return this.itemJSON && this.itemJSON.natureDamage ? this.itemJSON.natureDamage : 0
  }

  get natureDamage(): number {
    return this._natureDamage + (this.enchantJSON ? this.enchantJSON.natureDamage : 0)
  }

  get _spellHit(): number {
    return this.itemJSON && this.itemJSON.spellHit ? this.itemJSON.spellHit : 0
  }

  get spellHit(): number {
    return this._spellHit + (this.enchantJSON ? this.enchantJSON.spellHit : 0)
  }

  get _spellCrit(): number {
    return this.itemJSON && this.itemJSON.spellCrit ? this.itemJSON.spellCrit : 0
  }

  get spellCrit(): number {
    return this._spellCrit + (this.enchantJSON ? this.enchantJSON.spellCrit : 0)
  }

  get _intellect(): number {
    return this.itemJSON && this.itemJSON.intellect ? this.itemJSON.intellect : 0
  }

  get intellect(): number {
    return this._intellect + (this.enchantJSON ? this.enchantJSON.intellect : 0)
  }

  get _mp5(): number {
    return this.itemJSON && this.itemJSON.mp5 ? this.itemJSON.mp5 : 0
  }

  get mp5(): number {
    return this._mp5 + (this.enchantJSON ? this.enchantJSON.mp5 : 0)
  }

  get _armor(): number {
    return this.itemJSON && this.itemJSON.armor ? this.itemJSON.armor : 0
  }

  get armor(): number {
    return this._armor + (this.enchantJSON && this.enchantJSON.armor ? this.enchantJSON.armor : 0)
  }

  get durability(): number {
    return this.itemJSON && this.itemJSON.durability ? this.itemJSON.durability : 0
  }

  get minDmg(): number {
    return this.itemJSON && this.itemJSON.minDmg ? this.itemJSON.minDmg : 0
  }

  get maxDmg(): number {
    return this.itemJSON && this.itemJSON.maxDmg ? this.itemJSON.maxDmg : 0
  }

  get dmgText(): string {
    const minDmg = this.itemJSON && this.itemJSON.minDmg ? this.itemJSON.minDmg.toFixed(0) : 0
    const maxDmg = this.itemJSON && this.itemJSON.maxDmg ? this.itemJSON.maxDmg.toFixed(0) : 0
    return `${minDmg} - ${maxDmg}`
  }

  get speed(): number {
    return this.itemJSON && this.itemJSON.speed ? this.itemJSON.speed : 0
  }

  get speedText(): string {
    if (!this.itemJSON || !this.itemJSON.speed) {
      return ''
    }
    return `${parseFloat(this.itemJSON.speed.toFixed(1)).toFixed(2)}`
  }

  get dps(): number {
    return this.itemJSON && this.itemJSON.dps ? this.itemJSON.dps : 0
  }

  get dpsText(): string {
    if (!this.itemJSON || !this.itemJSON.dps) {
      return ''
    }
    return `${parseFloat(this.itemJSON.dps.toFixed(1)).toFixed(2)}`
  }

  get enchantText(): string {
    const slot = this.itemJSON ? this.gearSlot : ItemSlot.None
    const text = this.enchantJSON ? this.enchantJSON.text : 'No Enchant'

    switch (slot) {
      case GearSlot.Head:
      case GearSlot.Hands:
      case GearSlot.Shoulder:
      case GearSlot.Legs:
      case GearSlot.Back:
      case GearSlot.Feet:
      case GearSlot.Chest:
      case GearSlot.Wrist:
      case GearSlot.Mainhand:
        return text
      default:
        return ``
    }
  }

  get enchantClass(): string {
    const slot = this.enchantJSON ? this.gearSlot : ItemSlot.None

    if (this.enchantJSON && this.enchantJSON.id === 1) {
      return `poor`
    }

    switch (slot) {
      case GearSlot.Head:
      case GearSlot.Hands:
      case GearSlot.Shoulder:
      case GearSlot.Legs:
      case GearSlot.Back:
      case GearSlot.Feet:
      case GearSlot.Chest:
      case GearSlot.Wrist:
      case GearSlot.Mainhand:
        return `uncommon`
      default:
        return `poor`
    }
  }

  get bonusesList(): string[] {
    const bonuses: string[] = []
    if (
      this.name.includes(`of Arcane Wrath`) ||
      this.name.includes(`of Nature's Wrath`) ||
      this.name.includes(`of Sorcery`) ||
      this.name.includes(`of Restoration`)
    ) {
      if (this._spellHit > 0) {
        bonuses.push(`Equip: Improves your chance to hit with spells by ${this._spellHit}%.`)
      }
      if (this._spellCrit > 0) {
        bonuses.push(`Equip: Improves your chance to get a critical strike with spells by ${this._spellCrit}%.`)
      }
      return bonuses
    }

    if (this._spellHit > 0) {
      bonuses.push(`Equip: Improves your chance to hit with spells by ${this._spellHit}%.`)
    }

    if (this._spellCrit > 0) {
      bonuses.push(`Equip: Improves your chance to get a critical strike with spells by ${this._spellCrit}%.`)
    }

    if (this._spellDamage > 0) {
      if (
        (this.targetTypes & TargetType.Undead) === TargetType.Undead &&
        (this.targetTypes & TargetType.Demon) === TargetType.Demon
      ) {
        bonuses.push(
          `Equip: Increases damage done to Undead and Demons by magical spells and effects by up to ${this._spellDamage}.`
        )
      } else if ((this.targetTypes & TargetType.Undead) === TargetType.Undead) {
        bonuses.push(
          `Equip: Increases damage done to Undead by magical spells and effects by up to ${this._spellDamage}.`
        )
      } else {
        bonuses.push(
          `Equip: Increases damage and healing done by magical spells and effects by up to ${this._spellDamage}.`
        )
      }
    }

    if (this._arcaneDamage > 0) {
      bonuses.push(`Equip: Increases damage done by Arcane spells and effects by up to ${this._arcaneDamage}.`)
    }

    if (this._natureDamage > 0) {
      bonuses.push(`Equip: Increases damage done by Nature spells and effects by up to ${this._natureDamage}.`)
    }

    if (this._mp5 > 0) {
      bonuses.push(`Equip: Restores ${this._mp5} mana per 5 sec.`)
    }

    return bonuses
  }

  get statsList(): Object[] {
    const stats: Object[] = []
    if (this.name.includes(`of Arcane Wrath`)) {
      stats.push({ stat: 'Arcane Damage', value: this._arcaneDamage, type: 'primary' })
    } else if (this.name.includes(`of Nature's Wrath`)) {
      stats.push({ stat: 'Nature Damage', value: this._natureDamage, type: 'primary' })
    } else if (this.name.includes(`of Sorcery`)) {
      stats.push({ stat: 'Intellect', value: this._intellect, type: 'primary' })
      stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      stats.push({ stat: 'Damage and Healing Spells', value: this._spellDamage, type: 'primary' })
    } else if (this.name.includes(`of Restoration`)) {
      stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      stats.push({ stat: 'Healing Spells', value: this._spellHealing, type: 'primary' })
      stats.push({ stat: 'mana every 5 sec', value: this._mp5, type: 'primary' })
    } else {
      if (this._intellect > 0) {
        stats.push({ stat: 'Intellect', value: this._intellect, type: 'primary' })
      }

      if (this._stamina > 0) {
        stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      }

      if (this._spirit > 0) {
        stats.push({ stat: 'Spirit', value: this._spirit, type: 'primary' })
      }
    }

    return stats
  }

  get chanceOnHitList(): string[] {
    const arr: string[] = []

    return arr
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
