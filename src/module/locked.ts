import common from './common'
import query from './query'

import LockedItems from '../interface/LockedItems'
import LockedEnchants from '../interface/LockedEnchants'
import GearItemJSON from '../interface/GearItemJSON'
import GearEnchantJSON from '../interface/GearEnchantJSON'

import ItemSlot from '../enum/ItemSlot'
import GearState from '../enum/GearState'
import PvPRank from '../enum/PvPRank'

const getItemId = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): number => {
  if (!lockedItems) {
    return 0
  }

  switch (itemSlot) {
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
    case ItemSlot.Mainhand:
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
      return 0
  }
}

const getEnchantId = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): number => {
  if (!lockedEnchants) {
    return 0
  }

  switch (itemSlot) {
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
    case ItemSlot.Mainhand:
      return lockedEnchants.mainhand
    default:
      return 0
  }
}

const getItem = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): GearItemJSON | undefined => {
  const nakedItem = {
    id: 1,
    itemSlot: itemSlot,
    gearSlot: common.gearSlotFromItemSlot(itemSlot),
    raid: false,
    worldBoss: false,
    pvpRank: PvPRank.Scout
  }

  const id = getItemId(lockedItems, itemSlot)
  if (!id) {
    return undefined
  } else if (id === 1) {
    return nakedItem
  }

  const items = query.items({ id: id, cloneResults: true })
  return items && items[0] ? items[0] : undefined
}

const getEnchant = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): GearEnchantJSON | undefined => {
  const nakedEnchant = {
    id: 1,
    itemSlot: itemSlot,
    gearSlot: common.gearSlotFromItemSlot(itemSlot),
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

  const id = getEnchantId(lockedEnchants, itemSlot)
  if (id === 0) {
    return undefined
  } else if (id === 1) {
    return nakedEnchant
  }

  const enchants = query.enchants({ id: id, cloneResults: true })
  return enchants && enchants[0] ? enchants[0] : undefined
}

const setItem = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot, value: number): number => {
  if (lockedItems) {
    switch (itemSlot) {
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
  return 0
}

const setEnchant = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot, value: number): number => {
  if (lockedEnchants) {
    switch (itemSlot) {
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
  return 0
}

const lockItem = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot, value: number): number => {
  return setItem(lockedItems, itemSlot, value)
}

const lockEnchant = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot, value: number): number => {
  return setEnchant(lockedEnchants, itemSlot, value)
}

const unequipItem = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): number => {
  return setItem(lockedItems, itemSlot, GearState.Naked)
}

const unequipEnchant = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): number => {
  return setEnchant(lockedEnchants, itemSlot, GearState.Naked)
}

const unlockItem = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): number => {
  return setItem(lockedItems, itemSlot, GearState.BIS)
}

const unlockEnchant = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): number => {
  return setEnchant(lockedEnchants, itemSlot, GearState.BIS)
}

const unequipItems = (lockedItems: LockedItems | undefined): number => {
  if (lockedItems) {
    lockedItems.head = GearState.Naked
    lockedItems.hands = GearState.Naked
    lockedItems.neck = GearState.Naked
    lockedItems.waist = GearState.Naked
    lockedItems.shoulder = GearState.Naked
    lockedItems.legs = GearState.Naked
    lockedItems.back = GearState.Naked
    lockedItems.feet = GearState.Naked
    lockedItems.chest = GearState.Naked
    lockedItems.wrist = GearState.Naked
    lockedItems.finger = GearState.Naked
    lockedItems.finger2 = GearState.Naked
    lockedItems.mainhand = GearState.Naked
    lockedItems.offhand = GearState.Naked
    lockedItems.trinket = GearState.Naked
    lockedItems.trinket2 = GearState.Naked
    lockedItems.idol = GearState.Naked
  }
  return 0
}

const unequipEnchants = (lockedEnchants: LockedEnchants | undefined): number => {
  if (lockedEnchants) {
    lockedEnchants.head = GearState.Naked
    lockedEnchants.hands = GearState.Naked
    lockedEnchants.shoulder = GearState.Naked
    lockedEnchants.legs = GearState.Naked
    lockedEnchants.back = GearState.Naked
    lockedEnchants.feet = GearState.Naked
    lockedEnchants.chest = GearState.Naked
    lockedEnchants.wrist = GearState.Naked
    lockedEnchants.mainhand = GearState.Naked
  }
  return 0
}

const unlockItems = (lockedItems: LockedItems | undefined): number => {
  if (lockedItems) {
    lockedItems.head = GearState.BIS
    lockedItems.hands = GearState.BIS
    lockedItems.neck = GearState.BIS
    lockedItems.waist = GearState.BIS
    lockedItems.shoulder = GearState.BIS
    lockedItems.legs = GearState.BIS
    lockedItems.back = GearState.BIS
    lockedItems.feet = GearState.BIS
    lockedItems.chest = GearState.BIS
    lockedItems.wrist = GearState.BIS
    lockedItems.finger = GearState.BIS
    lockedItems.finger2 = GearState.BIS
    lockedItems.mainhand = GearState.BIS
    lockedItems.offhand = GearState.BIS
    lockedItems.trinket = GearState.BIS
    lockedItems.trinket2 = GearState.BIS
    lockedItems.idol = GearState.BIS
  }
  return 0
}

const unlockEnchants = (lockedEnchants: LockedEnchants): number => {
  if (lockedEnchants) {
    lockedEnchants.head = GearState.BIS
    lockedEnchants.hands = GearState.BIS
    lockedEnchants.shoulder = GearState.BIS
    lockedEnchants.legs = GearState.BIS
    lockedEnchants.back = GearState.BIS
    lockedEnchants.feet = GearState.BIS
    lockedEnchants.chest = GearState.BIS
    lockedEnchants.wrist = GearState.BIS
    lockedEnchants.mainhand = GearState.BIS
  }
  return 0
}

const itemLocked = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): boolean => {
  const id = getItemId(lockedItems, itemSlot)
  if (id === GearState.BIS) {
    return false
  }

  return true
}

const enchantLocked = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): boolean => {
  const id = getEnchantId(lockedEnchants, itemSlot)
  if (id === GearState.BIS) {
    return false
  }

  return true
}

const itemEquipped = (lockedItems: LockedItems | undefined, itemSlot: ItemSlot): boolean => {
  const id = getItemId(lockedItems, itemSlot)
  if (id !== 1) {
    return true
  }

  return false
}

const enchantEquipped = (lockedEnchants: LockedEnchants | undefined, itemSlot: ItemSlot): boolean => {
  const id = getEnchantId(lockedEnchants, itemSlot)
  if (id !== GearState.Naked) {
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
