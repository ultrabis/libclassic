import ItemSlot from '../enum/ItemSlot'
import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import TargetType from '../enum/TargetType'
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
    type: TargetType.Elemental,
    spellResistance: 75,
    shimmer: 0,
    thunderfury: 0,
    debuffs: ['CurseOfShadow']
  }
}

export default {
  defaults: defaults
}
