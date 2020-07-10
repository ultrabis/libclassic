import common from '../common'
// import gearItemSuffix from './gearItemSuffix'
import gearItemDefault from '../db/gearItemDefault.json'

import ItemJSON from '../interface/ItemJSON'
import GearItem from '../interface/GearItem'
import GearItemBonus from '../interface/GearItemBonus'
import PvPRank from '../enum/PvPRank'
import ItemQuality from '../enum/ItemQuality'
import ItemSlot from '../enum/ItemSlot'
import GearSlot from '../enum/GearSlot'

const fromDefault = (): GearItem => {
  return gearItemDefault
}

const slotFromItemSlot = (itemSlot: ItemSlot): GearSlot => {
  return common.enums.gearSlotFromItemSlot(itemSlot)
}

const qualityFromText = (text: string): ItemQuality => {
  return common.enums.itemQualityFromText(text)
}

const pvpRankFromText = (text: string): PvPRank => {
  return common.enums.pvpRankFromText(text)
}

const isFromRaid = (location: string): boolean => {
  const raids = common.enums.raidsFromText(location)
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
    type: common.enums.itemBonusTypeFromText(type),
    value: Number(value)
  }
}

// FIXME: These are really stupid. Just make default functions for both item and enchant,
// and use if() to set values. That way there's only one "default".
const fromItemJSON = (itemJSON?: ItemJSON): GearItem => {
  const newItem = fromDefault()

  if (!itemJSON) {
    return newItem
  }

  newItem.id = itemJSON.id ? itemJSON.id : 0
  newItem.suffixId = itemJSON.suffixId ? itemJSON.suffixId : 0
  newItem.name = itemJSON.name ? itemJSON.name : ''
  newItem.class = itemJSON.class ? itemJSON.class : 0
  newItem.subclass = itemJSON.subclass ? itemJSON.subclass : 0
  newItem.itemSlot = itemJSON.itemSlot
  newItem.gearSlot = slotFromItemSlot(itemJSON.itemSlot)
  newItem.quality = itemJSON.quality ? itemJSON.quality : 0
  newItem.level = itemJSON.level ? itemJSON.level : 0
  newItem.reqLevel = itemJSON.reqLevel ? itemJSON.reqLevel : 0
  newItem.bop = itemJSON.bop ? itemJSON.bop : false
  newItem.unique = itemJSON.unique ? itemJSON.unique : false
  newItem.allowableClasses = itemJSON.allowableClasses ? itemJSON.allowableClasses : []
  newItem.targetTypes = itemJSON.targetTypes ? itemJSON.targetTypes : 0
  newItem.phase = itemJSON.phase ? itemJSON.phase : 0
  newItem.pvpRank = itemJSON.pvpRank ? itemJSON.pvpRank : 0
  newItem.icon = itemJSON.icon ? itemJSON.icon : ''
  newItem.location = itemJSON.location ? itemJSON.location : ''
  newItem.boss = itemJSON.boss ? itemJSON.boss : ''
  newItem.raid = itemJSON.raid ? itemJSON.raid : false
  newItem.worldBoss = itemJSON.worldBoss ? itemJSON.worldBoss : false
  newItem.faction = itemJSON.faction ? itemJSON.faction : 0
  newItem.spellDamage = itemJSON.spellDamage ? itemJSON.spellDamage : 0
  newItem.arcaneDamage = itemJSON.arcaneDamage ? itemJSON.arcaneDamage : 0
  newItem.natureDamage = itemJSON.natureDamage ? itemJSON.natureDamage : 0
  newItem.spellHealing = itemJSON.spellHealing ? itemJSON.spellHealing : 0
  newItem.spellHit = itemJSON.spellHit ? itemJSON.spellHit : 0
  newItem.spellCrit = itemJSON.spellCrit ? itemJSON.spellCrit : 0
  newItem.spellPenetration = itemJSON.spellPenetration ? itemJSON.spellPenetration : 0
  newItem.stamina = itemJSON.stamina ? itemJSON.stamina : 0
  newItem.intellect = itemJSON.intellect ? itemJSON.intellect : 0
  newItem.spirit = itemJSON.spirit ? itemJSON.spirit : 0
  newItem.mp5 = itemJSON.mp5 ? itemJSON.mp5 : 0
  newItem.armor = itemJSON.armor ? itemJSON.armor : 0
  newItem.durability = itemJSON.durability ? itemJSON.durability : 0
  newItem.maxDmg = itemJSON.maxDmg ? itemJSON.maxDmg : 0
  newItem.minDmg = itemJSON.minDmg ? itemJSON.minDmg : 0
  newItem.speed = itemJSON.speed ? itemJSON.speed : 0
  newItem.dps = itemJSON.dps ? itemJSON.dps : 0
  newItem.onUse = itemJSON.onUse ? itemJSON.onUse : {}

  return newItem
}

const fromItemJSONArray = (itemJSONArray: ItemJSON[]): GearItem[] => {
  const gearItems: GearItem[] = []

  for (let x = 0; x <= itemJSONArray.length; x++) {
    gearItems.push(fromItemJSON(itemJSONArray[x]))
  }

  return gearItems
}

export default {
  fromDefault,
  fromItemJSON,
  fromItemJSONArray,
  isFromRaid,
  pvpRankFromText,
  bonusFromText,
  slotFromItemSlot,
  qualityFromText
}
