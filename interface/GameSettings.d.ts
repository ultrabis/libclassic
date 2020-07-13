import GameType from '../enum/GameType';
export default interface GameSettings {
    type: GameType;
    phase: number;
    castTimePenalty: number;
    encounterLength: number;
}
