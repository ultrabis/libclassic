import GameSettings from '../interface/GameSettings';
import PlayerSettings from '../interface/PlayerSettings';
import TargetSettings from '../interface/TargetSettings';
import GearSettings from './GearSettings';
export default interface Settings {
    game: GameSettings;
    player: PlayerSettings;
    target: TargetSettings;
    gear: GearSettings;
    debug: boolean;
    experimental: boolean;
}
