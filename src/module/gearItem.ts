import common from './common'

import gearItemDefault from '../obj/gearItem.json'

import GearSlot from '../enum/GearSlot'
import GearItem from '../interface/GearItem'
import GearItemBonus from '../interface/GearItemBonus'
import GearItemQuality from '../enum/GearItemQuality'
import GearItemJSON from '../interface/GearItemJSON'
import PvPRank from '../enum/PvPRank'
import ItemSlot from '../enum/ItemSlot'

const fromDefault = (): GearItem => {
  return gearItemDefault
}

const slotFromItemSlot = (itemSlot: ItemSlot): GearSlot => {
  return common.gearSlotFromItemSlot(itemSlot)
}

const qualityFromText = (text: string): GearItemQuality => {
  return common.itemQualityFromText(text)
}

const pvpRankFromText = (text: string): PvPRank => {
  return common.pvpRankFromText(text)
}

const isFromRaid = (location: string): boolean => {
  const raids = common.raidsFromText(location)
  return raids.length > 0 ? true : false
}

// +11 Stamina
const bonusFromText = (bonus: string): GearItemBonus => {
  let type: string
  let value: string

  const plusIndex = bonus.indexOf('+')
  const spaceIndex = bonus.indexOf(' ')
  if (bonus.toUpperCase().includes('10% ON GET HIT')) {
    const parenOpenIndex = bonus.indexOf('(')
    const parenCloseIndex = bonus.indexOf(')')
    type = '10% On Get Hit: Shadow Bolt'
    value = bonus.slice(parenOpenIndex + 1, parenCloseIndex - 7)
  } else if (bonus.charAt(0) === '+') {
    type = bonus.slice(spaceIndex + 1).trim()
    value = bonus.slice(plusIndex + 1, spaceIndex).trim()
  } else {
    type = bonus.slice(0, plusIndex - 1).trim()
    value = bonus.slice(plusIndex + 1).trim()
  }

  return {
    type: common.itemBonusTypeFromText(type),
    value: Number(value)
  }
}

// FIXME: These are really stupid. Just make default functions for both item and enchant,
// and use if() to set values. That way there's only one "default".
const fromJSON = (gearItemJSON?: GearItemJSON): GearItem => {
  const newItem = fromDefault()

  if (!gearItemJSON) {
    return newItem
  }

  newItem.id = gearItemJSON.id ? gearItemJSON.id : 0
  newItem.suffixId = gearItemJSON.suffixId ? gearItemJSON.suffixId : 0
  newItem.name = gearItemJSON.name ? gearItemJSON.name : ''
  newItem.class = gearItemJSON.class ? gearItemJSON.class : 0
  newItem.subclass = gearItemJSON.subclass ? gearItemJSON.subclass : 0
  newItem.itemSlot = gearItemJSON.itemSlot
  newItem.gearSlot = slotFromItemSlot(gearItemJSON.itemSlot)
  newItem.quality = gearItemJSON.quality ? gearItemJSON.quality : 0
  newItem.level = gearItemJSON.level ? gearItemJSON.level : 0
  newItem.reqLevel = gearItemJSON.reqLevel ? gearItemJSON.reqLevel : 0
  newItem.bop = gearItemJSON.bop ? gearItemJSON.bop : false
  newItem.unique = gearItemJSON.unique ? gearItemJSON.unique : false
  newItem.allowableClasses = gearItemJSON.allowableClasses ? gearItemJSON.allowableClasses : []
  newItem.targetTypes = gearItemJSON.targetTypes ? gearItemJSON.targetTypes : 0
  newItem.phase = gearItemJSON.phase ? gearItemJSON.phase : 0
  newItem.pvpRank = gearItemJSON.pvpRank ? gearItemJSON.pvpRank : 0
  newItem.icon = gearItemJSON.icon ? gearItemJSON.icon : ''
  newItem.location = gearItemJSON.location ? gearItemJSON.location : ''
  newItem.boss = gearItemJSON.boss ? gearItemJSON.boss : ''
  newItem.raid = gearItemJSON.raid ? gearItemJSON.raid : false
  newItem.worldBoss = gearItemJSON.worldBoss ? gearItemJSON.worldBoss : false
  newItem.faction = gearItemJSON.faction ? gearItemJSON.faction : 0
  newItem.spellDamage = gearItemJSON.spellDamage ? gearItemJSON.spellDamage : 0
  newItem.arcaneDamage = gearItemJSON.arcaneDamage ? gearItemJSON.arcaneDamage : 0
  newItem.natureDamage = gearItemJSON.natureDamage ? gearItemJSON.natureDamage : 0
  newItem.spellHealing = gearItemJSON.spellHealing ? gearItemJSON.spellHealing : 0
  newItem.spellHit = gearItemJSON.spellHit ? gearItemJSON.spellHit : 0
  newItem.spellCrit = gearItemJSON.spellCrit ? gearItemJSON.spellCrit : 0
  newItem.spellPenetration = gearItemJSON.spellPenetration ? gearItemJSON.spellPenetration : 0
  newItem.stamina = gearItemJSON.stamina ? gearItemJSON.stamina : 0
  newItem.intellect = gearItemJSON.intellect ? gearItemJSON.intellect : 0
  newItem.spirit = gearItemJSON.spirit ? gearItemJSON.spirit : 0
  newItem.mp5 = gearItemJSON.mp5 ? gearItemJSON.mp5 : 0
  newItem.armor = gearItemJSON.armor ? gearItemJSON.armor : 0
  newItem.durability = gearItemJSON.durability ? gearItemJSON.durability : 0
  newItem.maxDmg = gearItemJSON.maxDmg ? gearItemJSON.maxDmg : 0
  newItem.minDmg = gearItemJSON.minDmg ? gearItemJSON.minDmg : 0
  newItem.speed = gearItemJSON.speed ? gearItemJSON.speed : 0
  newItem.dps = gearItemJSON.dps ? gearItemJSON.dps : 0
  newItem.onUse = gearItemJSON.onUse ? gearItemJSON.onUse : {}

  return newItem
}

const fromJSONArray = (gearItemJSONArray: GearItemJSON[]): GearItem[] => {
  const gearItems: GearItem[] = []

  for (let x = 0; x <= gearItemJSONArray.length; x++) {
    gearItems.push(fromJSON(gearItemJSONArray[x]))
  }

  return gearItems
}

export default {
  fromDefault,
  fromJSON,
  fromJSONArray,
  isFromRaid,
  pvpRankFromText,
  bonusFromText,
  slotFromItemSlot,
  qualityFromText
}
