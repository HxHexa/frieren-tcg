import { StatsEnum } from "../stats";

type StatInfo = {
  emoji: string;
};

export const statDetails: Record<StatsEnum, StatInfo> = {
  [StatsEnum.HP]: { emoji: "❤️" },
  [StatsEnum.ATK]: { emoji: "⚔️" },
  [StatsEnum.DEF]: { emoji: "🛡️" },
  [StatsEnum.SPD]: { emoji: "⚡" },
  [StatsEnum.Ability]: { emoji: "✨" },
};

export enum CharacterEmoji {
  FRIEREN = "<:Frieren3:790429364570423346>",
  SENSE = "<:SenseStare:1204637493077610546>",
  SERIE = "<:SerieHowCute:1357814502023758205>",
  STILLE = "🐦‍🔥",
  LINIE = "<:LinieBaka:1343985694351032393>",
  SEIN = "<:SeinCool:1189748661287137370>",
  STARK = "<:StarkPoint:1165025263747342386>",
  LAUFEN = "<:LaufenNom:1198338042449113190>",
  DENKEN = "<:DenkenOld:1198339325436371074>",
  HIMMEL = "<:HimmelCharming:1185700266452992010>",

  STONE_GEISEL = "🐦‍⬛",
  FIRE_GOLEM = "❤️‍🔥",
  STONE_GOLEM = "🪨",
  ANGRY_MIMIC = "<a:FrierenMimicAnimated:1244755028741460029>",
  SHADOW_DRAGON = "👾",
  SPIEGEL_SEIN = "<:SeinDisappointed:782627138808840222>",
  SPIEGEL_SERIE = "<:SerieSmirk:834412553517662219>",
  SPIEGEL_SENSE = "🖤",
  COSMIC_TON = "👁️",

  SEIN_SERIE = "🤝",
}

export enum CardEmoji {
  HEART = "<:heartCard:1347328439627284560>",
  SHIELD = "<:shieldCard:1347328437618212974>",
  ENERGY = "<:energyCard:1347328442647187508>",
  DICE = "<:diceCard:1347328438683439137>",
  PUNCH = "<:punchCard:1347328441426640988>",
  HOURGLASS = "<:hourglassCard:1347328436192153600>",
  RANDOM = "<:randomCard:1347328434954571876>",
  GENERIC = "🃏",
  WAIT = "🕙",
  RECYCLE = "<:recycleCard:1347336609829490739>",

  FRIEREN_CARD = "<:FrierenCard:1347717556932317234>",
  SERIE_CARD = "<:SerieCard:1347718191136378961>",
  STILLE_CARD = "<:StilleCard:1347722643922751624>",
  LINIE_CARD = "<:LinieCard:1347719706164990065>",
  SEIN_CARD = "<:SeinCard:1347718390235791431>",
  STARK_CARD = "<:StarkCard:1347720915219124264>",
  LAUFEN_CARD = "<:LaufenCard:1347723068943892490>",
  DENKEN_CARD = "<:DenkenCard:1358052686418673725>",
  HIMMEL_CARD = "<:HimmelCard:1358052672787185845>",

  FLOWER_FIELD = "<:FlowerFieldCard:1347719503290695803>",
}

export enum ProgressBarEmoji {
  START_EMPTY = "<:PB1E:1164479248271159306>",
  START_HALF = "<:PB1HF:1164479266361200712>",
  START_FULL = "<:PB1C:1164479305947033600>",
  MIDDLE_EMPTY = "<:PB2E:1164479915048050709>",
  MIDDLE_HALF = "<:PB2HF:1164479708021403698>",
  MIDDLE_FULL = "<:PB2F:1164479717202743296>",
  MIDDLE_COMPLETE = "<:PB2C:1164479713578852402>",
  END_EMPTY = "<:PB3E:1164479719316652076>",
  END_HALF = "<:PB3HF:1164479711573983272>",
  END_FULL = "<:PB3F:1164479723225763892>",
}
