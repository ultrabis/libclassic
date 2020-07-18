import jsonQuery from 'json-query'
import utils from './utils'
import common from './common'
import itemDB from '../db/moonkin/item.json'
import Item from '../interface/Item'
import ItemBonus from '../interface/ItemBonus'
import ItemJSON from '../interface/ItemJSON'
import ItemJSONNew from '../interface/ItemJSONNew'
import ItemQuery from '../interface/ItemQuery'

import GearSlot from '../enum/GearSlot'
import ItemQuality from '../enum/ItemQuality'
import PvPRank from '../enum/PvPRank'
import ItemSlot from '../enum/ItemSlot'
import Faction from '../enum/Faction'

const fromDefault = (): Item => {
  return {} as Item
}

// FIXME: These are really stupid. Just make default functions for both item and enchant,
// and use if() to set values. That way there's only one "default".
const fromJSON = (itemJSON?: ItemJSON): Item => {
  const newItem = fromDefault()

  if (!itemJSON) {
    return utils.cloneObject(newItem)
  }

  newItem.id = itemJSON.id ? itemJSON.id : 0
  newItem.suffixId = itemJSON.suffixId ? itemJSON.suffixId : 0
  newItem.name = itemJSON.name ? itemJSON.name : ''
  newItem.class = itemJSON.class ? itemJSON.class : 0
  newItem.subclass = itemJSON.subclass ? itemJSON.subclass : 0
  newItem.slot = itemJSON.slot
  newItem.gearSlot = slotFromItemSlot(itemJSON.slot)
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

  return utils.cloneObject(newItem)
}

const fromJSONArray = (itemJSONArray: ItemJSON[]): Item[] => {
  const items: Item[] = []

  for (let x = 0; x < itemJSONArray.length; x++) {
    items.push(fromJSON(itemJSONArray[x]))
  }

  return utils.cloneObject(items)
}

/* FIXME: make this less dumb. returns input, deep cloned it if cloneResults is true */
const _result = (o: any, cloneResults: boolean) => {
  if (cloneResults) {
    return utils.cloneObject(o ? o : {})
  }

  return o ? o : {}
}
const fromQuery = (opts: ItemQuery): Item[] => {
  const noRandomEnchants = (itemJSON: ItemJSON) => {
    if (!itemJSON || !itemJSON.suffixId) {
      return true
    }

    return false
  }

  const slot2query = (slot: ItemSlot) => {
    switch (slot) {
      case ItemSlot.Finger2:
        return `[* slot=${ItemSlot.Finger}]`
      case ItemSlot.Trinket2:
        return `[* slot=${ItemSlot.Trinket}]`
      default:
        return `[* slot=${slot}]`
    }
  }

  const singleItemQuery = (query: string): Item[] => {
    const result: ItemJSON[] = []
    const x = jsonQuery(query, { data: itemDB }).value
    if (x) {
      result.push(x)
    }
    return fromJSONArray(result)
    //return _result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  if (opts.id && opts.suffixId) {
    // random enchant item
    return singleItemQuery(`[id=${opts.id}, suffixId=${opts.suffixId}]`)
  } else if (opts.id) {
    // item by id
    return singleItemQuery(`[id=${opts.id}]`)
  } else if (opts.name) {
    // item by name
    return singleItemQuery(`[name=${opts.name}]`)
  }

  let result: ItemJSON[] = []

  /* at this point if we don't have slot just return an empty set. we don't really
   * have a use-case for returning array of items from different slots */
  if (opts.slot === undefined) {
    return fromJSONArray(result)
  }

  result = jsonQuery(slot2query(opts.slot), { data: itemDB }).value

  if (opts.faction !== undefined) {
    result = jsonQuery(`[* faction = ${opts.faction} | faction = ${Faction.Horde | Faction.Alliance}]`, {
      data: result
    }).value
  }

  if (opts.phase !== undefined) {
    result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
  }

  if (opts.pvpRank !== undefined) {
    result = jsonQuery(`[* pvpRank <= ${opts.pvpRank}]`, { data: result }).value
  }

  if (opts.worldBosses !== undefined && opts.worldBosses === false) {
    result = jsonQuery(`[* worldBoss = false ]`, { data: result }).value
  }

  if (opts.raids !== undefined && opts.raids === false) {
    result = jsonQuery(`[* raid = false ]`, { data: result }).value
  }

  if (opts.randomEnchants !== undefined && opts.randomEnchants === false) {
    result = result.filter(noRandomEnchants)
  }

  return fromJSONArray(result)
}

const slotFromItemSlot = (slot: ItemSlot): GearSlot => {
  return common.gearSlotFromItemSlot(slot)
}

const qualityFromText = (text: string): ItemQuality => {
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
const bonusFromText = (bonus: string): ItemBonus => {
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

export default {
  fromDefault,
  fromJSON,
  fromJSONArray,
  fromQuery,
  isFromRaid,
  pvpRankFromText,
  bonusFromText,
  slotFromItemSlot,
  qualityFromText
}
