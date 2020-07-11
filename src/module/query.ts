/**
 * interface for JSON files in db/
 */

import jsonQuery from 'json-query'

import utils from './utils'

import SpellJSON from '../interface/SpellJSON'
import GearItemJSON from '../interface/GearItemJSON'
import GearItemSetJSON from '../interface/GearItemSetJSON'
import GearEnchantJSON from '../interface/GearEnchantJSON'
import GearItemSuffix from '../interface/GearItemSuffix'
import GearItemQuery from '../interface/GearItemQuery'
import SpellQuery from '../interface/SpellQuery'

import ItemSlot from '../enum/ItemSlot'
import Faction from '../enum/Faction'

import spellsDB from '../db/spell.json'
import itemsDB from '../db/gearItem.json'
import enchantsDB from '../db/gearEnchant.json'
import itemSetsDB from '../db/gearItemSet.json'
import itemSuffixDB from '../db/gearItemSuffix.json'

/* return input, deep clone it if cloneResults is true */
const _result = (o: any, cloneResults: boolean) => {
  if (cloneResults) {
    return utils.cloneObject(o ? o : {})
  }

  return o ? o : {}
}

const item = (opts: GearItemQuery): GearItemJSON | undefined => {
  const _items = items(opts)
  if (_items && _items[0]) {
    return _items[0]
  }
  return undefined
}

const items = (opts: GearItemQuery): GearItemJSON[] => {
  const noRandomEnchants = (itemJSON: GearItemJSON) => {
    if (!itemJSON || !itemJSON.suffixId) {
      return true
    }

    return false
  }

  const itemSlot2query = (itemSlot: ItemSlot) => {
    switch (itemSlot) {
      case ItemSlot.Finger2:
        return `[* itemSlot=${ItemSlot.Finger}]`
      case ItemSlot.Trinket2:
        return `[* itemSlot=${ItemSlot.Trinket}]`
      default:
        return `[* itemSlot=${itemSlot}]`
    }
  }

  const singleItemQuery = (query: string): GearItemJSON[] => {
    const result: GearItemJSON[] = []
    const x = jsonQuery(query, { data: itemsDB }).value
    if (x) {
      result.push(x)
    }

    return _result(result, opts.cloneResults ? opts.cloneResults : false)
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

  let result: GearItemJSON[] = []

  /* at this point if we don't have itemSlot just return an empty set. we don't really
   * have a use-case for returning array of items from different itemSlots */
  if (opts.itemSlot === undefined) {
    return result
  }

  result = jsonQuery(itemSlot2query(opts.itemSlot), { data: itemsDB }).value

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

  return _result(result, opts.cloneResults ? opts.cloneResults : false)
}

const itemSet = (opts: GearItemQuery): GearItemSetJSON | undefined => {
  const _itemSets = itemSets(opts)
  if (_itemSets && _itemSets[0]) {
    return _itemSets[0]
  }
  return undefined
}

const itemSets = (opts: GearItemQuery): GearItemSetJSON[] => {
  const singleItemSetQuery = (query: string): GearItemSetJSON[] => {
    const result: GearItemSetJSON[] = []
    const x = jsonQuery(query, { data: itemSetsDB }).value
    if (x) {
      result.push(x)
    }
    return _result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  let result: GearItemSetJSON[] = []

  if (opts.name) {
    result = singleItemSetQuery(`[name=${opts.name}]`)
  } else {
    result = jsonQuery(``, { data: itemSetsDB }).value
  }

  if (opts.phase !== undefined) {
    result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
  }

  if (opts.raids !== undefined && opts.raids === false) {
    result = jsonQuery(`[* raid = false ]`, { data: result }).value
  }

  return _result(result, opts.cloneResults ? opts.cloneResults : false)
}

const enchant = (opts: GearItemQuery): GearEnchantJSON | undefined => {
  const _enchants = enchants(opts)
  if (_enchants && _enchants[0]) {
    return _enchants[0]
  }
  return undefined
}

const enchants = (opts: GearItemQuery): GearEnchantJSON[] => {
  const singleEnchantQuery = (query: string): GearEnchantJSON[] => {
    const result: GearEnchantJSON[] = []
    const x = jsonQuery(query, { data: enchantsDB }).value
    if (x) {
      result.push(x)
    }
    return _result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  const noExploit = (enchantJSON: GearEnchantJSON) => {
    if (!enchantJSON || !enchantJSON.exploit) {
      return true
    }

    return false
  }

  /* id and name are unique. if one is passed just lookup and return */
  if (opts.id) {
    return singleEnchantQuery(`[id=${opts.id}]`)
  } else if (opts.name) {
    return singleEnchantQuery(`[name=${opts.name}]`)
  }

  let result: GearEnchantJSON[] = []

  if (opts.itemSlot === undefined) {
    return result
  }

  result = jsonQuery(`[* itemSlot = ${opts.itemSlot} | itemSlot = -2 ]`, { data: enchantsDB }).value

  if (opts.phase !== undefined) {
    result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
  }

  if (!opts.enchantExploit) {
    result = result.filter(noExploit)
  }

  return _result(result, opts.cloneResults ? opts.cloneResults : false)
}

const spell = (opts: SpellQuery): SpellJSON | undefined => {
  const _spells = spells(opts)
  if (_spells && _spells[0]) {
    return _spells[0]
  }
  return undefined
}

const spells = (opts: SpellQuery): SpellJSON[] => {
  const singleSpellQuery = (query: string): SpellJSON[] => {
    const result: SpellJSON[] = []
    const x = jsonQuery(query, { data: spellsDB }).value
    if (x) {
      result.push(x)
    }
    return _result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  if (opts.name) {
    return singleSpellQuery(`[name=${opts.name}]`)
  }

  if (opts.baseName && opts.rank) {
    return singleSpellQuery(`[name=${opts.baseName} Rank ${opts.rank}]`)
  }

  let result: SpellJSON[] = []

  if (opts.phase !== undefined) {
    result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: spellsDB }).value
  }

  return _result(result, opts.cloneResults ? opts.cloneResults : false)
}

const itemSuffixes = (opts: any): GearItemSuffix[] => {
  const result = jsonQuery(`[* type = ${opts.type}]`, { data: itemSuffixDB }).value
  return result
}

export default {
  item,
  items,
  itemSet,
  itemSets,
  itemSuffixes,
  enchant,
  enchants,
  spell,
  spells
}
