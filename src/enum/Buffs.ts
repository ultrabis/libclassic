export enum Buffs {
  None,
  MoonkinAura = 1 << 0,
  PowerInfusion = 1 << 1,
  EphemeralPower = 1 << 2,
  FlaskOfSupremePower = 1 << 3,
  GreaterArcaneElixir = 1 << 4,
  CerebralCortexCompound = 1 << 5,
  RunnTumTuberSurprise = 1 << 6,
  ArcaneBrilliance = 1 << 7,
  BlessingOfKings = 1 << 8,
  ImprovedGiftOfTheWild = 1 << 9,
  RallyingCryOfTheDragonSlayer = 1 << 10,
  SlipkiksSavvy = 1 << 11,
  SongflowerSerenade = 1 << 12,
  SaygesDarkFortune = 1 << 13,
  TracesOfSilithyst = 1 << 14,
  BurningAdrenaline = 1 << 15,
  SpellVulnerability = 1 << 16,
  CurseOfShadow = 1 << 17,
  StormStrike = 1 << 18,
  SpiritOfZandalar = 1 << 19,
  All = ~(~0 << 18)
}

export default Buffs
