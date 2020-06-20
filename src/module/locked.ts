import query from './query'

import LockedItems from '../interface/LockedItems'
import LockedEnchants from '../interface/LockedEnchants'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'

import ItemSlot from '../enum/ItemSlot'
import PvPRank from '../enum/PvPRank'

const getItemId = (lockedItems: LockedItems | undefined, slot: ItemSlot): string => {
  if (!lockedItems) {
    return ''
  }

  switch (slot) {
    case ItemSlot.Head:
      return lockedItems.head
    case ItemSlot.Hands:
      return lockedItems.hands
    case ItemSlot.Neck:
      return lockedItems.neck
    case ItemSlot.Waist:
      return lockedItems.waist
    case ItemSlot.Shoulder:
      return lockedItems.shoulder
    case ItemSlot.Legs:
      return lockedItems.legs
    case ItemSlot.Back:
      return lockedItems.back
    case ItemSlot.Feet:
      return lockedItems.feet
    case ItemSlot.Chest:
      return lockedItems.chest
    case ItemSlot.Wrist:
      return lockedItems.wrist
    case ItemSlot.Finger:
      return lockedItems.finger
    case ItemSlot.Finger2:
      return lockedItems.finger2
    case ItemSlot.Twohand:
    case ItemSlot.Mainhand:
    case ItemSlot.Onehand:
      return lockedItems.mainhand
    case ItemSlot.Offhand:
      return lockedItems.offhand
    case ItemSlot.Trinket:
      return lockedItems.trinket
    case ItemSlot.Trinket2:
      return lockedItems.trinket2
    case ItemSlot.Relic:
      return lockedItems.idol
    default:
      return ''
  }
}

const getEnchantId = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot): string => {
  if (!lockedEnchants) {
    return ''
  }

  switch (slot) {
    case ItemSlot.Head:
      return lockedEnchants.head
    case ItemSlot.Hands:
      return lockedEnchants.hands
    case ItemSlot.Shoulder:
      return lockedEnchants.shoulder
    case ItemSlot.Legs:
      return lockedEnchants.legs
    case ItemSlot.Back:
      return lockedEnchants.back
    case ItemSlot.Feet:
      return lockedEnchants.feet
    case ItemSlot.Chest:
      return lockedEnchants.chest
    case ItemSlot.Wrist:
      return lockedEnchants.wrist
    case ItemSlot.Twohand:
    case ItemSlot.Mainhand:
    case ItemSlot.Onehand:
      return lockedEnchants.mainhand
    default:
      return ''
  }
}

const getItem = (lockedItems: LockedItems | undefined, slot: ItemSlot): ItemJSON | undefined => {
  let emptyItem = () => {
    return {
      id: 1,
      customId: '1',
      slot: slot,
      raid: false,
      worldBoss: false,
      pvpRank: PvPRank.Scout
    }
  }

  let id = getItemId(lockedItems, slot)
  if (!id || id === '') {
    return undefined
  } else if (id === '1') {
    return emptyItem()
  }

  let items = query.items({ customId: id, cloneResults: true })
  return items && items[0] ? items[0] : undefined
}

const getEnchant = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot): EnchantJSON | undefined => {
  let emptyEnchant = () => {
    return {
      id: 1,
      customId: '1',
      slot: slot,
      name: 'No enchant',
      phase: 1,
      icon: '',
      score: 0,
      text: 'No enchant',
      spellDamage: 0,
      arcaneDamage: 0,
      natureDamage: 0,
      spellHit: 0,
      spellCrit: 0,
      spellPenetration: 0,
      stamina: 0,
      intellect: 0,
      spirit: 0,
      mp5: 0
    }
  }

  let id = getEnchantId(lockedEnchants, slot)

  if (!id || id === '') {
    return undefined
  } else if (id === '1') {
    return emptyEnchant()
  }

  let enchants = query.enchants({ customId: id, cloneResults: true })
  return enchants && enchants[0] ? enchants[0] : undefined
}

const setItem = (lockedItems: LockedItems | undefined, slot: ItemSlot, value: string) => {
  if (lockedItems) {
    switch (slot) {
      case ItemSlot.Head:
        lockedItems.head = value
        break
      case ItemSlot.Hands:
        lockedItems.hands = value
        break
      case ItemSlot.Neck:
        lockedItems.neck = value
        break
      case ItemSlot.Waist:
        lockedItems.waist = value
        break
      case ItemSlot.Shoulder:
        lockedItems.shoulder = value
        break
      case ItemSlot.Legs:
        lockedItems.legs = value
        break
      case ItemSlot.Back:
        lockedItems.back = value
        break
      case ItemSlot.Feet:
        lockedItems.feet = value
        break
      case ItemSlot.Chest:
        lockedItems.chest = value
        break
      case ItemSlot.Wrist:
        lockedItems.wrist = value
        break
      case ItemSlot.Finger:
        lockedItems.finger = value
        break
      case ItemSlot.Finger2:
        lockedItems.finger2 = value
        break
      case ItemSlot.Mainhand:
        lockedItems.mainhand = value
        break
      case ItemSlot.Offhand:
        lockedItems.offhand = value
        break
      case ItemSlot.Trinket:
        lockedItems.trinket = value
        break
      case ItemSlot.Trinket2:
        lockedItems.trinket2 = value
        break
      case ItemSlot.Relic:
        lockedItems.idol = value
        break
      default:
        break
    }
  }
}

const setEnchant = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot, value: string) => {
  if (lockedEnchants) {
    switch (slot) {
      case ItemSlot.Head:
        lockedEnchants.head = value
        break
      case ItemSlot.Hands:
        lockedEnchants.hands = value
        break
      case ItemSlot.Shoulder:
        lockedEnchants.shoulder = value
        break
      case ItemSlot.Legs:
        lockedEnchants.legs = value
        break
      case ItemSlot.Back:
        lockedEnchants.back = value
        break
      case ItemSlot.Feet:
        lockedEnchants.feet = value
        break
      case ItemSlot.Chest:
        lockedEnchants.chest = value
        break
      case ItemSlot.Wrist:
        lockedEnchants.wrist = value
        break
      case ItemSlot.Mainhand:
        lockedEnchants.mainhand = value
        break
      default:
        break
    }
  }
}

const lockItem = (lockedItems: LockedItems | undefined, slot: ItemSlot, value: string) => {
  return setItem(lockedItems, slot, value)
}

const lockEnchant = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot, value: string) => {
  return setEnchant(lockedEnchants, slot, value)
}

const unequipItem = (lockedItems: LockedItems | undefined, slot: ItemSlot) => {
  return setItem(lockedItems, slot, '1')
}

const unequipEnchant = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot) => {
  return setEnchant(lockedEnchants, slot, '1')
}

const unlockItem = (lockedItems: LockedItems | undefined, slot: ItemSlot) => {
  return setItem(lockedItems, slot, '')
}

const unlockEnchant = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot) => {
  return setEnchant(lockedEnchants, slot, '')
}

const unequipItems = (lockedItems: LockedItems | undefined) => {
  if (lockedItems) {
    lockedItems.head = '1'
    lockedItems.hands = '1'
    lockedItems.neck = '1'
    lockedItems.waist = '1'
    lockedItems.shoulder = '1'
    lockedItems.legs = '1'
    lockedItems.back = '1'
    lockedItems.feet = '1'
    lockedItems.chest = '1'
    lockedItems.wrist = '1'
    lockedItems.finger = '1'
    lockedItems.finger2 = '1'
    lockedItems.mainhand = '1'
    lockedItems.offhand = '1'
    lockedItems.trinket = '1'
    lockedItems.trinket2 = '1'
    lockedItems.idol = '1'
  }
}

const unequipEnchants = (lockedEnchants: LockedEnchants | undefined) => {
  if (lockedEnchants) {
    lockedEnchants.head = '1'
    lockedEnchants.hands = '1'
    lockedEnchants.shoulder = '1'
    lockedEnchants.legs = '1'
    lockedEnchants.back = '1'
    lockedEnchants.feet = '1'
    lockedEnchants.chest = '1'
    lockedEnchants.wrist = '1'
    lockedEnchants.mainhand = '1'
  }
}

const unlockItems = (lockedItems: LockedItems | undefined) => {
  if (lockedItems) {
    lockedItems.head = ''
    lockedItems.hands = ''
    lockedItems.neck = ''
    lockedItems.waist = ''
    lockedItems.shoulder = ''
    lockedItems.legs = ''
    lockedItems.back = ''
    lockedItems.feet = ''
    lockedItems.chest = ''
    lockedItems.wrist = ''
    lockedItems.finger = ''
    lockedItems.finger2 = ''
    lockedItems.mainhand = ''
    lockedItems.offhand = ''
    lockedItems.trinket = ''
    lockedItems.trinket2 = ''
    lockedItems.idol = ''
  }
}

const unlockEnchants = (lockedEnchants: LockedEnchants) => {
  if (lockedEnchants) {
    lockedEnchants.head = ''
    lockedEnchants.hands = ''
    lockedEnchants.shoulder = ''
    lockedEnchants.legs = ''
    lockedEnchants.back = ''
    lockedEnchants.feet = ''
    lockedEnchants.chest = ''
    lockedEnchants.wrist = ''
    lockedEnchants.mainhand = ''
  }
}

const itemLocked = (lockedItems: LockedItems | undefined, slot: ItemSlot): boolean => {
  let id = getItemId(lockedItems, slot)
  if (id === '') {
    return false
  }

  return true
}

const enchantLocked = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot): boolean => {
  let id = getEnchantId(lockedEnchants, slot)
  if (id === '') {
    return false
  }

  return true
}

const itemEquipped = (lockedItems: LockedItems | undefined, slot: ItemSlot): boolean => {
  let id = getItemId(lockedItems, slot)
  if (id !== '1') {
    return true
  }

  return false
}

const enchantEquipped = (lockedEnchants: LockedEnchants | undefined, slot: ItemSlot): boolean => {
  let id = getEnchantId(lockedEnchants, slot)
  if (id !== '1') {
    return true
  }

  return false
}

/* Routines for handling locked items and enchants */
export default {
  getItemId,
  getEnchantId,
  getItem,
  getEnchant,
  setItem,
  setEnchant,
  lockItem,
  lockEnchant,
  unequipItem,
  unequipEnchant,
  unlockItem,
  unlockEnchant,
  unequipItems,
  unequipEnchants,
  unlockItems,
  unlockEnchants,
  itemLocked,
  enchantLocked,
  itemEquipped,
  enchantEquipped
}
