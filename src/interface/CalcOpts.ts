import GameType from '../enum/GameType'

export default interface CalcOpts {
  gameType?: GameType
  binarySpell?: boolean
  vengeanceRank?: number
  moonFuryRank?: number
  improvedMoonfireRank?: number
  reflectionRank?: number
}
