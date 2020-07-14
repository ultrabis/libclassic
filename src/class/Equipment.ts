import utils from '../module/utils'
import common from '../module/common'
import query from '../module/query'
import locked from '../module/locked'

import Item from './Item'
import Spell from './Spell'

import Settings from '../interface/Settings'
import GearSearch from '../interface/GearSearch'
import ItemJSON from '../interface/ItemJSON'
import ItemSetJSON from '../interface/ItemSetJSON'
import EnchantJSON from '../interface/EnchantJSON'

import ItemSlot from '../enum/ItemSlot'
import SortOrder from '../enum/SortOrder'

// import LockedItems from '../interface/LockedItems'

/* Object containing:
 *
 * - The BiS equipment shown on main gear selection box
 * - The BiS items shown in table modal when selecting an item slot (if applicable)
 * - The BiS enchants shown in table modal when selected an enchant slot (if applicable)
 *
 * Each of these sets of data required running the same optimization function, so this
 * is an attempt to refactor and handle them all at the same time.
 *
 */
export default class Equipment {
  settings: Settings
  itemSearch: GearSearch
  head: Item
  hands: Item
  neck: Item
  waist: Item
  shoulder: Item
  legs: Item
  back: Item
  feet: Item
  chest: Item
  finger: Item
  wrist: Item
  finger2: Item
  mainhand: Item
  offhand: Item
  trinket: Item
  trinket2: Item
  idol: Item

  /* TODO: can I make it so the constructor could take list of item ids or something instead? */
  constructor(
    settings: Settings,
    spellHitWeight?: number,
    spellCritWeight?: number,
    spellCastTime?: number,
    spellCrit?: number
  ) {
    const _bis = (slot: number) => {
      return Equipment.getBestInSlotItemWithEnchant(slot, this.itemSearch)
    }

    this.settings = settings
    this.itemSearch = Equipment.itemSearchFromSettings(
      settings,
      spellHitWeight,
      spellCritWeight,
      spellCastTime,
      spellCrit
    )

    const bisTrinkets = Equipment.getBestInSlotTrinkets(this.itemSearch)
    const bisRings = Equipment.getBestInSlotRings(this.itemSearch)
    const bisWeaponCombo = Equipment.getBestInSlotWeaponCombo(this.itemSearch)
    const bisChestLegsFeet = Equipment.getBestInSlotChestLegsFeet(this.itemSearch)
    this.head = _bis(ItemSlot.Head)
    this.hands = _bis(ItemSlot.Hands)
    this.neck = _bis(ItemSlot.Neck)
    this.waist = _bis(ItemSlot.Waist)
    this.shoulder = _bis(ItemSlot.Shoulder)
    this.legs = new Item(ItemSlot.Legs, bisChestLegsFeet.legs, bisChestLegsFeet.legsEnchant)
    this.back = _bis(ItemSlot.Back)
    this.feet = new Item(ItemSlot.Feet, bisChestLegsFeet.feet, bisChestLegsFeet.feetEnchant)
    this.chest = new Item(ItemSlot.Chest, bisChestLegsFeet.chest, bisChestLegsFeet.chestEnchant)
    this.finger = new Item(ItemSlot.Finger, bisRings.finger)
    this.wrist = _bis(ItemSlot.Wrist)
    this.finger2 = new Item(ItemSlot.Finger2, bisRings.finger2)
    this.mainhand = new Item(ItemSlot.Mainhand, bisWeaponCombo.mainHand, bisWeaponCombo.enchant)
    this.offhand = bisWeaponCombo.offHand
      ? new Item(ItemSlot.Offhand, bisWeaponCombo.offHand)
      : new Item(ItemSlot.Offhand)
    this.trinket = new Item(ItemSlot.Trinket, bisTrinkets.trinket)
    this.trinket2 = new Item(ItemSlot.Trinket2, bisTrinkets.trinket2)
    this.idol = _bis(ItemSlot.Relic)
  }

  static itemSearchFromSettings(
    settings: Settings,
    spellHitWeight?: number,
    spellCritWeight?: number,
    spellCastTime?: number,
    spellCrit?: number
  ): GearSearch {
    const mySettings: Settings = utils.cloneObject(settings)
    const spell = new Spell(mySettings.player.rotation)

    const mySpellHitWeight = spellHitWeight !== undefined ? spellHitWeight : 15
    const mySpellCritWeight = spellCritWeight !== undefined ? spellCritWeight : 10
    const mySpellCastTime = spellCastTime !== undefined ? spellCastTime : spell.castTime
    const mySpellCrit = spellCrit !== undefined ? spellCrit : 30

    return {
      phase: mySettings.game.phase,
      faction: common.factionFromRace(mySettings.player.race),
      pvpRank: mySettings.player.pvpRank,
      raids: mySettings.gear.raids,
      worldBosses: mySettings.gear.worldBosses,
      randomEnchants: mySettings.gear.randomEnchants,
      tailoring: mySettings.gear.tailoring,
      enchantExploit: mySettings.gear.enchantExploit,
      encounterLength: mySettings.game.encounterLength,
      onUseItems: mySettings.gear.onUseItems,
      magicSchool: spell.magicSchool,
      targetType: mySettings.target.type,
      spellHitWeight: mySpellHitWeight,
      spellCritWeight: mySpellCritWeight,
      spellCastTime: mySpellCastTime,
      spellCrit: mySpellCrit,
      naturesGrace: mySettings.player.talents.naturesGraceRank === 1 ? true : false,
      lockedItems: mySettings.gear.lockedItems,
      lockedEnchants: mySettings.gear.lockedEnchants,
      gearSlot: common.gearSlotFromItemSlot(mySettings.gear.itemSearchSlot),
      itemSlot: mySettings.gear.itemSearchSlot,
      sortOrder: SortOrder.Descending
    }
  }

  static printItemNames(equipment: Equipment): number {
    console.log(`
      ${equipment.head.name}, ${equipment.hands.name}, ${equipment.neck.name},
      ${equipment.waist.name}, ${equipment.shoulder.name}, ${equipment.legs.name},
      ${equipment.back.name}, ${equipment.feet.name}, ${equipment.chest.name},
      ${equipment.finger.name}, ${equipment.wrist.name}, ${equipment.finger2.name},
      ${equipment.mainhand.name}, ${equipment.trinket.name}, ${equipment.offhand.name},
      ${equipment.trinket2.name}, ${equipment.idol.spellDamage}`)

    return 0
  }

  /*************************** TODO **********************************/
  /*************************** UGLY **********************************/
  /*************************** STUFF **********************************/
  static isUniqueEquip(itemJSON: ItemJSON | undefined): boolean {
    return (itemJSON && itemJSON.unique) || (itemJSON && itemJSON.boss && itemJSON.boss.includes('Quest:'))
      ? true
      : false
  }

  static isOnUseEquip(itemJSON: ItemJSON | undefined): boolean {
    return itemJSON && itemJSON.onUse ? true : false
  }

  static trinketEffectiveSpellDamage(
    itemJSON: ItemJSON | undefined,
    encounterLength: number,
    castTime: number,
    spellCrit: number,
    naturesGrace: boolean
  ): number {
    if (!itemJSON) {
      return 0
    }

    if (itemJSON.name && itemJSON.name === 'Talisman of Ephemeral Power') {
      // console.log('toep')
      return this._trinketEffectiveSpellDamage(172, 15, 90, 0, encounterLength, castTime, spellCrit, naturesGrace)
    }

    if (itemJSON.name && itemJSON.name === 'Zandalarian Hero Charm') {
      // console.log('zhc')
      return this._trinketEffectiveSpellDamage(204, 20, 120, 17, encounterLength, castTime, spellCrit, naturesGrace)
    }

    if (itemJSON.name && itemJSON.name === 'The Restrained Essence of Sapphiron') {
      // console.log('res')
      return this._trinketEffectiveSpellDamage(130, 20, 120, 0, encounterLength, castTime, spellCrit, naturesGrace)
    }

    return 0
  }

  static _trinketEffectiveSpellDamage(
    trinketBonus: number,
    trinketDuration: number,
    trinketCooldown: number,
    trinketReductionPerCast: number,
    encounterLength: number,
    castTime: number,
    spellCrit: number,
    naturesGrace: boolean
  ): number {
    let effectiveActiveTime = 0
    if (trinketDuration >= encounterLength) {
      effectiveActiveTime = encounterLength
    } else if (encounterLength > trinketCooldown) {
      const x = trinketCooldown / encounterLength - trinketDuration / encounterLength
      effectiveActiveTime = encounterLength * (1 - x)
    } else {
      effectiveActiveTime = trinketDuration
    }

    const buffedCasts = Math.floor(effectiveActiveTime / castTime)
    const totalCasts = Math.floor(encounterLength / castTime)
    // const naturesGraceBonus = naturesGrace ? trinketBonus * utils.cumulativeChance(4, spellCrit / 100, 2) : 0
    // let totalSpellDamage = trinketBonus * buffedCasts + naturesGraceBonus
    let totalSpellDamage = trinketBonus * buffedCasts
    // console.log(utils.cumulativeChance(4, spellCrit / 100, 2) * trinketBonus)
    if (trinketReductionPerCast) {
      // let cooldowns = Math.floor(encounterLength / trinketCooldown)
      // let buffedCastsThisCooldown = Math.floor(cooldowns / buffedCasts)
      const triangular = utils.triangularNumber(buffedCasts - 1)
      /*
      console.log(
        `cooldowns=${cooldowns},buffedCasts=${buffedCasts},buffedCastsThisCooldown=${buffedCastsThisCooldown},triangular=${triangular}`
      )
      */
      totalSpellDamage -= triangular * trinketReductionPerCast
    }
    const effectiveSpellDamage = totalSpellDamage / buffedCasts / (totalCasts / buffedCasts)

    /*
    console.log(
      `buffedCasts=${buffedCasts}, totalCasts=${totalCasts},totalSpellDamage=${totalSpellDamage},effectiveActiveTime=${effectiveActiveTime}, effectiveSpellDamage=${effectiveSpellDamage}`
    )
    */
    return effectiveSpellDamage
  }

  static getWeightedItemsBySlot(itemSlot: ItemSlot, itemSearch: GearSearch): ItemJSON[] {
    const _scoreOnUseTrinket = (itemJSON: ItemJSON): number => {
      /* Add additional score from onUse effect */
      if (
        itemSearch.onUseItems &&
        (itemSlot === ItemSlot.Trinket || itemSlot === ItemSlot.Trinket2) &&
        itemJSON.onUse
      ) {
        return this.trinketEffectiveSpellDamage(
          itemJSON,
          itemSearch.encounterLength,
          itemSearch.spellCastTime,
          itemSearch.spellCrit,
          itemSearch.naturesGrace
        )
      }
      return 0
    }

    const lockedItem = locked.getItem(itemSearch.lockedItems, itemSlot)
    if (lockedItem) {
      const x: ItemJSON[] = []
      lockedItem.score = Item.scoreItem(
        lockedItem,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      x.push(lockedItem)
      return x
    }

    const result = query.items({
      cloneResults: true,
      itemSlot: itemSlot,
      phase: itemSearch.phase,
      faction: itemSearch.faction,
      pvpRank: itemSearch.pvpRank,
      worldBosses: itemSearch.worldBosses,
      raids: itemSearch.raids,
      randomEnchants: itemSearch.randomEnchants
    })

    /* score items */
    for (let i = 0; i < result.length; i++) {
      let score = Item.scoreItem(
        result[i],
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      score += _scoreOnUseTrinket(result[i])
      result[i].score = score
    }

    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getWeightedEnchantsBySlot(itemSlot: ItemSlot, itemSearch: GearSearch): EnchantJSON[] {
    const lockedEnchant: EnchantJSON | undefined = locked.getEnchant(itemSearch.lockedEnchants, itemSlot)
    if (lockedEnchant) {
      const x: EnchantJSON[] = []
      lockedEnchant.score = Item.scoreEnchant(
        lockedEnchant,
        itemSearch.magicSchool,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      x.push(lockedEnchant)
      return x
    }

    const result = query.enchants({
      cloneResults: true,
      itemSlot: itemSlot,
      phase: itemSearch.phase,
      enchantExploit: itemSearch.enchantExploit
    })

    for (const i in result) {
      const score = Item.scoreEnchant(
        result[i],
        itemSearch.magicSchool,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      result[i].score = score
    }
    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getItemSet(name: string, itemSearch: GearSearch): ItemSetJSON | undefined {
    /* Find the set and filter */
    const itemSets = query.itemSets({
      cloneResults: false,
      name: name,
      raids: itemSearch.raids,
      phase: itemSearch.phase
    })
    if (!itemSets || !itemSets[0]) {
      return undefined
    }
    const itemSet = itemSets[0]

    /* TODO: Should be aborting here custom selections are disallowing the set */

    /* Find each item in set, score them and add to array */
    const itemSetItems: ItemJSON[] = []
    let itemSetItemsScore = 0
    for (const itemName of itemSet.itemNames) {
      const items = query.items({
        phase: itemSearch.phase,
        raids: itemSearch.raids,
        cloneResults: false,
        name: itemName
      })
      // let item = this.itemByName(itemName)
      const item: ItemJSON = items[0]
      item.score = Item.scoreItem(
        item,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      itemSetItemsScore += item.score
      itemSetItems.push(item)
    }

    /* Combine score of items plus set bonus */
    itemSet.score = itemSetItemsScore
    if (itemSearch.tailoring) {
      const isb = Item.scoreItemSetBonus(
        itemSet,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      itemSet.score += isb
    }

    /* Slap items array onto itemset and return*/
    itemSet.items = itemSetItems
    return itemSet
  }

  static getBestInSlotItem(slot: ItemSlot, itemSearch: GearSearch): ItemJSON {
    const result = this.getWeightedItemsBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotEnchant(slot: ItemSlot, itemSearch: GearSearch): EnchantJSON {
    const result = this.getWeightedEnchantsBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotItemWithEnchant(slot: ItemSlot, itemSearch: GearSearch): Item {
    const item = this.getBestInSlotItem(slot, itemSearch)
    const enchant = this.getBestInSlotEnchant(slot, itemSearch)

    return new Item(slot, item, enchant)
  }

  static getBestInSlotChestLegsFeet(itemSearch: GearSearch): any {
    let chest: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Chest, itemSearch)
    let legs: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Legs, itemSearch)
    let feet: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Feet, itemSearch)
    const bloodvine = this.getItemSet(`Bloodvine Garb`, itemSearch)
    const bloodvineScore = bloodvine && bloodvine.score ? bloodvine.score : 0

    const normScore =
      (chest && chest.score ? chest.score : 0) +
      (legs && legs.score ? legs.score : 0) +
      (feet && feet.score ? feet.score : 0)

    const customChest =
      itemSearch &&
      itemSearch.lockedItems &&
      itemSearch.lockedItems.chest !== 0 &&
      itemSearch.lockedItems.chest !== 19682
    const customLegs =
      itemSearch && itemSearch.lockedItems && itemSearch.lockedItems.legs !== 0 && itemSearch.lockedItems.legs !== 19683
    const customFeet =
      itemSearch && itemSearch.lockedItems && itemSearch.lockedItems.feet !== 0 && itemSearch.lockedItems.feet !== 19684

    if (!customChest && !customLegs && !customFeet && bloodvine && bloodvineScore > normScore) {
      chest = bloodvine.items ? bloodvine.items[0] : undefined
      legs = bloodvine.items ? bloodvine.items[1] : undefined
      feet = bloodvine.items ? bloodvine.items[2] : undefined
    }

    return {
      chest: chest,
      chestEnchant: this.getBestInSlotEnchant(ItemSlot.Chest, itemSearch),
      legs: legs,
      legsEnchant: this.getBestInSlotEnchant(ItemSlot.Legs, itemSearch),
      feet: feet,
      feetEnchant: this.getBestInSlotEnchant(ItemSlot.Feet, itemSearch)
    }
  }

  static getBestInSlotTrinkets(itemSearch: GearSearch): any {
    const result = this.getWeightedItemsBySlot(ItemSlot.Trinket, itemSearch)
    const result2 = this.getWeightedItemsBySlot(ItemSlot.Trinket2, itemSearch)

    const t1 = 0
    let t2 = 0

    if (this.isUniqueEquip(result[t1]) && result[t1].name === result2[t2].name) {
      t2++
    }

    while (this.isOnUseEquip(result[t1]) && this.isOnUseEquip(result2[t2])) {
      t2++
    }

    const trinket1 = result[t1]
    const trinket2 = result2[t2]

    return {
      trinket: trinket1,
      trinket2: trinket2
    }
  }

  static getBestInSlotRings(itemSearch: GearSearch): any {
    let zanzils: ItemSetJSON | undefined = undefined
    const result = this.getWeightedItemsBySlot(ItemSlot.Finger, itemSearch)
    const result2 = this.getWeightedItemsBySlot(ItemSlot.Finger2, itemSearch)

    let ring1: ItemJSON | undefined = result[0]
    let ring2: ItemJSON | undefined = result2[0]
    if (this.isUniqueEquip(result[0]) && result[0].name === result2[0].name) {
      ring2 = result2[1]
    }

    const basicScore = (ring1 && ring1.score ? ring1.score : 0) + (ring2 && ring2.score ? ring2.score : 0)
    const customFinger = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger
    const customFinger2 = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger2

    if (!customFinger && !customFinger2) {
      zanzils = this.getItemSet(`Zanzil's Concentration`, itemSearch)
      if (zanzils && (zanzils.score ? zanzils.score : 0) > basicScore) {
        ring1 = zanzils.items ? zanzils.items[0] : undefined
        ring2 = zanzils.items ? zanzils.items[1] : undefined
      }
    }

    return {
      finger: ring1,
      finger2: ring2
    }
  }

  static getBestInSlotWeaponCombo(itemSearch: GearSearch): any {
    const twohand = this.getBestInSlotItem(ItemSlot.Twohand, itemSearch)
    const onehand = this.getBestInSlotItem(ItemSlot.Onehand, itemSearch)
    const offhand = this.getBestInSlotItem(ItemSlot.Offhand, itemSearch)
    const enchant = this.getBestInSlotEnchant(ItemSlot.Mainhand, itemSearch)

    const onehandscore = onehand && onehand.score ? onehand.score : 0
    const offhandscore = offhand && offhand.score ? offhand.score : 0
    const twohandscore = twohand && twohand.score ? twohand.score : 0

    const _offhand = locked.getItemId(itemSearch.lockedItems, ItemSlot.Offhand)

    if (!_offhand && twohandscore > onehandscore + offhandscore) {
      return {
        mainHand: twohand,
        enchant: enchant
      }
    }

    const mainhand = onehand

    return {
      mainHand: mainhand,
      offHand: mainhand && mainhand.itemSlot === ItemSlot.Twohand ? undefined : offhand,
      enchant: enchant
    }
  }

  /*************************** /UGLY **********************************/
  get hasBloodvine(): boolean {
    if (
      this.itemSearch.tailoring &&
      this.chest.name === `Bloodvine Vest` &&
      this.legs.name === `Bloodvine Leggings` &&
      this.feet.name === `Bloodvine Boots`
    ) {
      return true
    }
    return false
  }

  get hasZanzils(): boolean {
    if (
      (this.finger.name === `Zanzil's Band` || this.finger.name === `Zanzil's Seal`) &&
      (this.finger2.name === `Zanzil's Band` || this.finger2.name === `Zanzil's Seal`)
    ) {
      return true
    }
    return false
  }

  get spellDamage(): number {
    return (
      (this.hasZanzils ? 6 : 0) +
      this.head.spellDamage +
      this.hands.spellDamage +
      this.neck.spellDamage +
      this.waist.spellDamage +
      this.shoulder.spellDamage +
      this.legs.spellDamage +
      this.back.spellDamage +
      this.feet.spellDamage +
      this.chest.spellDamage +
      this.finger.spellDamage +
      this.wrist.spellDamage +
      this.finger2.spellDamage +
      this.mainhand.spellDamage +
      this.offhand.spellDamage +
      this.trinket.spellDamage +
      this.trinket2.spellDamage +
      this.idol.spellDamage
    )
  }

  get arcaneDamage(): number {
    return (
      this.head.arcaneDamage +
      this.hands.arcaneDamage +
      this.neck.arcaneDamage +
      this.waist.arcaneDamage +
      this.shoulder.arcaneDamage +
      this.legs.arcaneDamage +
      this.back.arcaneDamage +
      this.feet.arcaneDamage +
      this.chest.arcaneDamage +
      this.finger.arcaneDamage +
      this.wrist.arcaneDamage +
      this.finger2.arcaneDamage +
      this.mainhand.arcaneDamage +
      this.offhand.arcaneDamage +
      this.trinket.arcaneDamage +
      this.trinket2.arcaneDamage +
      this.idol.arcaneDamage
    )
  }

  get natureDamage(): number {
    return (
      this.head.natureDamage +
      this.hands.natureDamage +
      this.neck.natureDamage +
      this.waist.natureDamage +
      this.shoulder.natureDamage +
      this.legs.natureDamage +
      this.back.natureDamage +
      this.feet.natureDamage +
      this.chest.natureDamage +
      this.finger.natureDamage +
      this.wrist.natureDamage +
      this.finger2.natureDamage +
      this.mainhand.natureDamage +
      this.offhand.natureDamage +
      this.trinket.natureDamage +
      this.trinket2.natureDamage +
      this.idol.natureDamage
    )
  }

  get spellHit(): number {
    return (
      (this.hasZanzils ? 1 : 0) +
      this.head.spellHit +
      this.hands.spellHit +
      this.neck.spellHit +
      this.waist.spellHit +
      this.shoulder.spellHit +
      this.legs.spellHit +
      this.back.spellHit +
      this.feet.spellHit +
      this.chest.spellHit +
      this.finger.spellHit +
      this.wrist.spellHit +
      this.finger2.spellHit +
      this.mainhand.spellHit +
      this.offhand.spellHit +
      this.trinket.spellHit +
      this.trinket2.spellHit +
      this.idol.spellHit
    )
  }

  get spellCrit(): number {
    return (
      (this.hasBloodvine ? 2 : 0) +
      this.head.spellCrit +
      this.hands.spellCrit +
      this.neck.spellCrit +
      this.waist.spellCrit +
      this.shoulder.spellCrit +
      this.legs.spellCrit +
      this.back.spellCrit +
      this.feet.spellCrit +
      this.chest.spellCrit +
      this.finger.spellCrit +
      this.wrist.spellCrit +
      this.finger2.spellCrit +
      this.mainhand.spellCrit +
      this.offhand.spellCrit +
      this.trinket.spellCrit +
      this.trinket2.spellCrit +
      this.idol.spellDamage
    )
  }

  get intellect(): number {
    return (
      this.head.intellect +
      this.hands.intellect +
      this.neck.intellect +
      this.waist.intellect +
      this.shoulder.intellect +
      this.legs.intellect +
      this.back.intellect +
      this.feet.intellect +
      this.chest.intellect +
      this.finger.intellect +
      this.wrist.intellect +
      this.finger2.intellect +
      this.mainhand.intellect +
      this.offhand.intellect +
      this.trinket.intellect +
      this.trinket2.intellect +
      this.idol.intellect
    )
  }

  get stamina(): number {
    return (
      this.head.stamina +
      this.hands.stamina +
      this.neck.stamina +
      this.waist.stamina +
      this.shoulder.stamina +
      this.legs.stamina +
      this.back.stamina +
      this.feet.stamina +
      this.chest.stamina +
      this.finger.stamina +
      this.wrist.stamina +
      this.finger2.stamina +
      this.mainhand.stamina +
      this.offhand.stamina +
      this.trinket.stamina +
      this.trinket2.stamina +
      this.idol.stamina
    )
  }

  get spirit(): number {
    return (
      this.head.spirit +
      this.hands.spirit +
      this.neck.spirit +
      this.waist.spirit +
      this.shoulder.spirit +
      this.legs.spirit +
      this.back.spirit +
      this.feet.spirit +
      this.chest.spirit +
      this.finger.spirit +
      this.wrist.spirit +
      this.finger2.spirit +
      this.mainhand.spirit +
      this.offhand.spirit +
      this.trinket.spirit +
      this.trinket2.spirit +
      this.idol.spirit
    )
  }

  get mp5(): number {
    return (
      this.head.mp5 +
      this.hands.mp5 +
      this.neck.mp5 +
      this.waist.mp5 +
      this.shoulder.mp5 +
      this.legs.mp5 +
      this.back.mp5 +
      this.feet.mp5 +
      this.chest.mp5 +
      this.finger.mp5 +
      this.wrist.mp5 +
      this.finger2.mp5 +
      this.mainhand.mp5 +
      this.offhand.mp5 +
      this.trinket.mp5 +
      this.trinket2.mp5 +
      this.idol.mp5
    )
  }

  /* TODO: There's isn't any spell pen gear yet */
  get spellPenetration(): number {
    return 0
  }

  get itemsAsBlessedTable(): any {
    return {
      headers: ['Slot', 'Name', 'Score', 'Spell Damage', 'Spell Hit', 'Spell Crit', 'Intellect'],
      data: [
        [
          'Head',
          this.head.name,
          this.head.score.toString(),
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
