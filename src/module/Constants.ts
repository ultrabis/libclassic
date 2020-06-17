/* constants */
import Common from '../module/Common'
import ItemSlot from '../enum/ItemSlot'
import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import Options from '../interface/Options'

let defaults: Options = {
  debug: false,
  experimental: false,
  phase: 4,
  raids: true,
  tailoring: true,
  worldBosses: false,
  randomEnchants: true,
  enchantExploit: false,
  onUseItems: true,
  encounterLength: 100,
  spellName: 'Starfire Rank 6',
  itemSearchSlot: ItemSlot.None,
  enchantSearchSlot: ItemSlot.None,
  castTimePenalty: 0.05, // This is an artifact from Ayz's spell damage calculator. No one knows what it is. Human factor? Latency factor?
  character: {
    level: 60,
    gender: Gender.Male,
    race: PlayableRace.Tauren,
    class: PlayableClass.Druid,
    pvpRank: 1,
    talents: {
      naturesGraceRank: 1,
      moonFuryRank: 5,
      vengeanceRank: 5,
      improvedWrathRank: 5,
      improvedStarfireRank: 5,
      improvedMoonfireRank: 5,
      reflectionRank: 3
    },
    buffs: [
      'MoonkinAura',
      'FlaskOfSupremePower',
      'GreaterArcaneElixir',
      'CerebralCortexCompound',
      'RunnTumTuberSurprise',
      'RallyingCryOfTheDragonSlayer',
      'SlipkiksSavvy',
      'ArcaneBrilliance',
      'SongflowerSerenade',
      'BlessingOfKings',
      'ImprovedGiftOfTheWild',
      'SpiritOfZandalar'
    ],
    lockedItems: {
      head: '',
      hands: '',
      neck: '',
      waist: '',
      shoulder: '',
      legs: '',
      back: '',
      feet: '',
      chest: '',
      wrist: '',
      finger: '',
      finger2: '',
      mainhand: '',
      offhand: '',
      trinket: '',
      trinket2: '',
      idol: ''
    },
    lockedEnchants: {
      head: '',
      hands: '',
      shoulder: '',
      legs: '',
      back: '',
      feet: '',
      chest: '',
      wrist: '',
      mainhand: ''
    }
  },
  target: {
    level: 63,
    type: Common.TargetType.Elemental,
    spellResistance: 75,
    shimmer: 0,
    thunderfury: 0,
    debuffs: ['CurseOfShadow']
  }
}

export default {
  globalCoolDown: 1.5,
  playerLevelCap: 60,
  spellHitCap: 16,
  spellCritCap: 100,
  /**
   * At level 60, caster classes have some expected amount of Int that will put them at 5% spell crit.
   * For example, to have 5% crit at 60 a mage needs 286 Int.  A 60 mage also needs 59.5 int to gain
   * 1 additional spell crit.  286/59.5=4.8067 which is less than 5, meaning mages have a base spell
   * crit of 5-(286/59.5)=0.1933. Likewise, a Shaman needs 160 int @ 60 for 5% crit, and 59.2 int for
   * 1 crit.  160/59.2=2.703 -> 5-(160/59.2)=2.2973 base spell crit
   *
   * http://blue.cardplace.com/cache/wow-mage/1009382.htm
   * http://blue.cardplace.com/cache/wow-general/8532087.htm
   * http://blue.cardplace.com/cache/wow-mage/559324.htm
   *
   */

  baseSpellCrit: 1.8,
  baseSpellCritMultiplier: 1.5,

  defaults: defaults
}
