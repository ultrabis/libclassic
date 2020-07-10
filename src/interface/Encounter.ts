import DPS from './DPS'
import Spell from './Spell'
import Player from './Player'
import Weights from './Weights'
import Target from './Target'
import Gear from './Gear'

export default interface Encounter {
  dps: DPS
  weights: Weights
  gear: Gear
  player: Player
  spell: Spell
  target: Target
}
