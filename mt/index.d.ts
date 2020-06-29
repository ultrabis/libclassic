declare const _default: {
    query: {
        item: (opts: import("../interface/ItemQuery").default) => import("../interface/ItemJSON").default | undefined;
        items: (opts: import("../interface/ItemQuery").default) => import("../interface/ItemJSON").default[];
        itemSet: (opts: import("../interface/ItemQuery").default) => import("../interface/ItemSetJSON").default | undefined;
        itemSets: (opts: import("../interface/ItemQuery").default) => import("../interface/ItemSetJSON").default[];
        itemSuffixes: (opts: any) => import("../interface/ItemSuffixJSON").default[];
        enchant: (opts: import("../interface/ItemQuery").default) => import("../interface/EnchantJSON").default | undefined;
        enchants: (opts: import("../interface/ItemQuery").default) => import("../interface/EnchantJSON").default[];
        spell: (opts: import("../interface/SpellQuery").default) => import("../interface/SpellJSON").default | undefined;
        spells: (opts: import("../interface/SpellQuery").default) => import("../interface/SpellJSON").default[];
    };
    locked: {
        getItemId: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => string;
        getEnchantId: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => string;
        getItem: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => import("../interface/ItemJSON").default | undefined;
        getEnchant: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => import("../interface/EnchantJSON").default | undefined;
        setItem: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default, value: string) => number;
        setEnchant: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default, value: string) => number;
        lockItem: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default, value: string) => number;
        lockEnchant: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default, value: string) => number;
        unequipItem: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => number;
        unequipEnchant: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => number;
        unlockItem: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => number;
        unlockEnchant: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => number;
        unequipItems: (lockedItems: import("../interface/LockedItems").default | undefined) => number;
        unequipEnchants: (lockedEnchants: import("../interface/LockedEnchants").default | undefined) => number;
        unlockItems: (lockedItems: import("../interface/LockedItems").default | undefined) => number;
        unlockEnchants: (lockedEnchants: import("../interface/LockedEnchants").default) => number;
        itemLocked: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => boolean;
        enchantLocked: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => boolean;
        itemEquipped: (lockedItems: import("../interface/LockedItems").default | undefined, slot: import("../enum/ItemSlot").default) => boolean;
        enchantEquipped: (lockedEnchants: import("../interface/LockedEnchants").default | undefined, slot: import("../enum/ItemSlot").default) => boolean;
    };
    optimal: {
        sortByDPS: (a: import("../interface/EquipmentArray").default, b: import("../interface/EquipmentArray").default) => number;
        itemsForSlot: (settings: import("../interface/Settings").default) => import("../interface/ItemJSON").default[] | undefined;
        enchantsForSlot: (settings: import("../interface/Settings").default) => import("../interface/EnchantJSON").default[] | undefined;
        equipment: (settings: import("../interface/Settings").default) => import("../class/Equipment").default;
    };
    gear: {
        itemBonusFromText: (bonus: string) => import("../interface/ItemBonus").default;
        itemSuffixTypeFromItemName: (itemName: string) => import("../enum/ItemSuffixType").default;
        itemSuffixFromText: (id: string, type: string, bonus: string, bonus2?: string | undefined, bonus3?: string | undefined) => import("../interface/ItemSuffixJSON").default;
        itemSuffixFromItemNameAndBonusValue: (itemName: string, bonusValue: number) => import("../interface/ItemSuffixJSON").default | undefined;
        itemSuffixesFromItemName: (itemName: string) => import("../interface/ItemSuffixJSON").default[];
    };
    url: {
        stringToParamin: (str: string, opts?: import("../interface/ParaminOptions").default | undefined) => string;
        paraminToString: (paramin: string, opts?: import("../interface/ParaminOptions").default | undefined) => string;
        lockedFromGearParam: (param: string, opts?: import("../interface/ParaminOptions").default | undefined) => Object;
        gearParamFromLocked: (lockedItems: import("../interface/LockedItems").default, lockedEnchants: import("../interface/LockedEnchants").default | null, opts?: import("../interface/ParaminOptions").default | undefined) => string;
        optionFromURL: (name: string) => any;
        publicURL: (equipment: import("../class/Equipment").default) => string;
        defaultSettings: () => import("../interface/Settings").default;
    };
};
export default _default;
