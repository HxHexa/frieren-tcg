import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { StatsEnum } from "@tcg/stats";

type StatInfo = {
  emoji: string;
};

export const statDetails: Record<StatsEnum, StatInfo> = {
  [StatsEnum.HP]: { emoji: "❤️" },
  [StatsEnum.ATK]: { emoji: "⚔️" },
  [StatsEnum.DEF]: { emoji: "🛡️" },
  [StatsEnum.TrueDEF]: { emoji: "💠" },
  [StatsEnum.SPD]: { emoji: "⚡" },
  [StatsEnum.Ability]: { emoji: "✨" },
};

export enum CharacterEmoji {
  AURA = "<:AuraSmug:1211325441755979806>",
  DENKEN = "<:DenkenOld:1198339325436371074>",
  EDEL = "<:EdelMad:1258499320504914003>",
  FERN = "<:FernThink:1179413599739986012>",
  FLAMME = "<:FlammeSmile2:1159196263930146879>",
  FRIEREN = "<:Frieren3:790429364570423346>",
  HIMMEL = "<:HimmelCharming:1185700266452992010>",
  LAUFEN = "<:LaufenNom:1198338042449113190>",
  LINIE = "<:LinieBaka:1343985694351032393>",
  METHODE = "<:Methode:1210701480693075998>",
  SEIN = "<:SeinCool:1189748661287137370>",
  SENSE = "<:SenseStare:1204637493077610546>",
  SERIE = "<:SerieHowCute:1357814502023758205>",
  STARK = "<:StarkPoint:1165025263747342386>",
  STILLE = "🐦‍🔥",
  UBEL = "<:UbelSnipsnip:1140592823243112468>",
  WIRBEL = "<:WirbelSmug:1208067233411240068>",

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

export const characterNameToEmoji: Record<CharacterName, CharacterEmoji> = {
  [CharacterName.Aura]: CharacterEmoji.AURA,
  [CharacterName.Denken]: CharacterEmoji.DENKEN,
  [CharacterName.Edel]: CharacterEmoji.EDEL,
  [CharacterName.Fern]: CharacterEmoji.FERN,
  [CharacterName.Flamme]: CharacterEmoji.FLAMME,
  [CharacterName.Frieren]: CharacterEmoji.FRIEREN,
  [CharacterName.Himmel]: CharacterEmoji.HIMMEL,
  [CharacterName.Laufen]: CharacterEmoji.LAUFEN,
  [CharacterName.Linie]: CharacterEmoji.LINIE,
  [CharacterName.Methode]: CharacterEmoji.METHODE,
  [CharacterName.Sein]: CharacterEmoji.SEIN,
  [CharacterName.Sense]: CharacterEmoji.SENSE,
  [CharacterName.Serie]: CharacterEmoji.SERIE,
  [CharacterName.Stark]: CharacterEmoji.STARK,
  [CharacterName.Stille]: CharacterEmoji.STILLE,
  [CharacterName.Ubel]: CharacterEmoji.UBEL,
  [CharacterName.Wirbel]: CharacterEmoji.WIRBEL,
};

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

  AURA_CARD = "<:AuraCard:1398828308589969519>",
  DENKEN_CARD = "<:DenkenCard:1358052686418673725>",
  EDEL_CARD = "<:EdelCard:1373076891749322802>",
  FLAMME_CARD = "<:FlammeCard:1378048592912056540>",
  FRIEREN_CARD = "<:FrierenCard:1347717556932317234>",
  FERN_CARD = "<:FernCard:1363517169585099013>",
  HIMMEL_CARD = "<:HimmelCard:1358052672787185845>",
  SERIE_CARD = "<:SerieCard:1347718191136378961>",
  LINIE_CARD = "<:LinieCard:1347719706164990065>",
  METHODE_CARD = "<:MethodeCard:1383568841107574935>",
  SEIN_CARD = "<:SeinCard:1347718390235791431>",
  STARK_CARD = "<:StarkCard:1347720915219124264>",
  LAUFEN_CARD = "<:LaufenCard:1347723068943892490>",
  STILLE_CARD = "<:StilleCard:1347722643922751624>",
  UBEL_CARD = "<:UbelCard:1362910824133562679>",
  WIRBEL_CARD = "<:WirbelCard:1377726387326287882>",

  FLOWER_FIELD = "<:FlowerFieldCard:1347719503290695803>",
  MANA_CARD = "<:ManaCard:1363597189229576322>",
  DONUT_CARD = "<:DonutCard:1365436094191239228>",
  JUMBO_BERRY_CARD = "<:IceCreamCard:1365436733088596048>",
  ROOST_CARD = "<:NestCard:1365437097481343027>",
  EDEL_STATUS_CARD = "<:EdelStatusCard:1378404191159976138>",
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

export function charWithEmoji(char: CharacterName) {
  const entry = characterNameToEmoji[char];
  return entry ? `${entry} ${char}` : char;
}
