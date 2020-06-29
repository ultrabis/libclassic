import Item from './Item';
import ItemSlot from '../enum/ItemSlot';
import Settings from '../interface/Settings';
import ItemSearch from '../interface/ItemSearch';
import ItemJSON from '../interface/ItemJSON';
import ItemSetJSON from '../interface/ItemSetJSON';
import EnchantJSON from '../interface/EnchantJSON';
export default class Equipment {
    settings: Settings;
    itemSearch: ItemSearch;
    head: Item;
    hands: Item;
    neck: Item;
    waist: Item;
    shoulder: Item;
    legs: Item;
    back: Item;
    feet: Item;
    chest: Item;
    finger: Item;
    wrist: Item;
    finger2: Item;
    mainhand: Item;
    offhand: Item;
    trinket: Item;
    trinket2: Item;
    idol: Item;
    constructor(settings: Settings, spellHitWeight?: number, spellCritWeight?: number, spellCastTime?: number, spellCrit?: number);
    static itemSearchFromSettings(settings: Settings, spellHitWeight?: number, spellCritWeight?: number, spellCastTime?: number, spellCrit?: number): ItemSearch;
    static printItemNames(equipment: Equipment): number;
    /*************************** TODO **********************************/
    /*************************** UGLY **********************************/
    /*************************** STUFF **********************************/
    static isUniqueEquip(itemJSON: ItemJSON): boolean;
    static isOnUseEquip(itemJSON: ItemJSON | undefined): boolean;
    static trinketEffectiveSpellDamage(itemJSON: ItemJSON | undefined, encounterLength: number, castTime: number, spellCrit: number, naturesGrace: boolean): number;
    static _trinketEffectiveSpellDamage(trinketBonus: number, trinketDuration: number, trinketCooldown: number, trinketReductionPerCast: number, encounterLength: number, castTime: number, spellCrit: number, naturesGrace: boolean): number;
    static getWeightedItemsBySlot(slot: ItemSlot, itemSearch: ItemSearch): ItemJSON[];
    static getWeightedEnchantsBySlot(slot: ItemSlot, itemSearch: ItemSearch): EnchantJSON[];
    static getItemSet(name: string, itemSearch: ItemSearch): ItemSetJSON | undefined;
    static getBestInSlotItem(slot: ItemSlot, itemSearch: ItemSearch): ItemJSON;
    static getBestInSlotEnchant(slot: ItemSlot, itemSearch: ItemSearch): EnchantJSON;
    static getBestInSlotItemWithEnchant(slot: ItemSlot, itemSearch: ItemSearch): Item;
    static getBestInSlotChestLegsFeet(itemSearch: ItemSearch): any;
    static getBestInSlotTrinkets(itemSearch: ItemSearch): any;
    static getBestInSlotRings(itemSearch: ItemSearch): any;
    static getBestInSlotWeaponCombo(itemSearch: ItemSearch): any;
    /*************************** /UGLY **********************************/
    get hasBloodvine(): boolean;
    get hasZanzils(): boolean;
    get spellDamage(): number;
    get arcaneDamage(): number;
    get natureDamage(): number;
    get spellHit(): number;
    get spellCrit(): number;
    get intellect(): number;
    get stamina(): number;
    get spirit(): number;
    get mp5(): number;
    get spellPenetration(): number;
    get itemsAsBlessedTable(): any;
    toJSON(): any;
}
