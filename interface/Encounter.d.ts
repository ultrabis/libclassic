import DPS from './DPS';
import SpellTrio from './SpellTrio';
import PlayerTrio from './PlayerTrio';
import Weights from './Weights';
import TargetTrio from './TargetTrio';
import Gear from './Gear';
export default interface Encounter {
    dps: DPS;
    weights: Weights;
    gear: Gear;
    player: PlayerTrio;
    spell: SpellTrio;
    target: TargetTrio;
}
