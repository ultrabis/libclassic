import utils from './utils'

import Settings from '../interface/Settings'

import ItemSlot from '../enum/ItemSlot'
import Gender from '../enum/Gender'
import PlayableClass from '../enum/PlayableClass'
import PlayableRace from '../enum/PlayableRace'
import PlayableSpec from '../enum/PlayableSpec'
import TargetType from '../enum/TargetType'

const MoonkinDefaults: Settings = {
  debug: false,
  experimental: false,
  phase: 4,
  encounterLength: 100,
  spellName: 'Starfire Rank 6',
  castTimePenalty: 0.05, // This is an artifact from Ayz's spell damage calculator. No one knows what it is. Human factor? Latency factor?
  equipment: {
    raids: true,
    tailoring: true,
    worldBosses: false,
    randomEnchants: true,
    enchantExploit: false,
    onUseItems: true,
    itemSearchSlot: ItemSlot.None,
    enchantSearchSlot: ItemSlot.None,
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
    },
    gear: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  },
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
    ]
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

const defaults = (opts?: { playerSpec: PlayableSpec }): Settings => {
  if (!opts) {
    return utils.cloneObject(MoonkinDefaults)
  }

  switch (opts.playerSpec) {
    case PlayableSpec.Moonkin:
    default:
      return utils.cloneObject(MoonkinDefaults)
  }
}

export default {
  defaults
}
