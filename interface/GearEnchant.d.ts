import ItemSlot from '../enum/ItemSlot';
import GearSlot from '../enum/GearSlot';
export default interface GearEnchant {
    id: number;
    name: string;
    gearSlot: GearSlot;
    itemSlot: ItemSlot;
    phase: number;
    icon: string;
    text: string;
    exploit: boolean;
    spellHealing: number;
    armor: number;
    spellDamage: number;
    arcaneDamage: number;
    natureDamage: number;
    spellHit: number;
    spellCrit: number;
    spellPenetration: number;
    stamina: number;
    intellect: number;
    spirit: number;
    mp5: number;
    score: number;
}
