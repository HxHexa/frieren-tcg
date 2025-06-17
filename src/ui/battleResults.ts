import {
  ContainerBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  ButtonBuilder,
  ButtonStyle,
  User,
} from "discord.js";

import { buildMessageLink, buildThreadLink } from "@src/util/formatting/links";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { TCGResult } from "@src/tcgMain";
import { DatabaseOperationResult } from "@src/commands/tcgChallenge/gameHandler/handleDatabaseOperations";
import { charWithEmoji } from "@tcg/formatting/emojis";
import { CHARACTER_MAP } from "@tcg/characters/characterList";
import { Rank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";

type BattleResultsOptions = {
  gameRes: TCGResult & {
    challenger: User;
    opponent: User;
  };
  dbRes?: DatabaseOperationResult | null; // if undefined, it means the game was not ranked or was tied
  threadId: string;
  gameId: string;
};

export default function buildBattleResults({
  gameRes,
  dbRes,
  threadId,
  gameId,
}: BattleResultsOptions) {
  const { challenger, opponent } = gameRes;

  const playerOneSection = perPlayerSectionLogic({
    isFirst: true,
    notTied: gameRes.winner !== undefined,
    user: gameRes.winner ?? challenger,
    character: gameRes.winnerCharacter ?? gameRes.challengerCharacter,
    rank: dbRes?.winnerRank,
    rankedChange: dbRes?.winnerRankedUp,
    newRank: dbRes?.winnerNewRank,
    scoreChange: dbRes?.winnerScoreGain,
    newScore: dbRes?.winnerNewPoints,
  });

  const loserScoreLoss = dbRes?.loserScoreLoss ?? 0;
  const playerTwoSection = perPlayerSectionLogic({
    isFirst: false,
    notTied: gameRes.winner !== undefined,
    user: gameRes.loser ?? opponent,
    character: gameRes.loserCharacter ?? gameRes.opponentCharacter,
    rank: dbRes?.loserRank,
    rankedChange: dbRes?.loserRankedDown,
    newRank: dbRes?.loserNewRank,
    scoreChange: -1 * loserScoreLoss,
    newScore: dbRes?.loserNewPoints,
  });

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `### Battle Results${gameRes.winner ? "" : " - Tied"}`
      )
    )
    .addTextDisplayComponents(playerOneSection.line)
    .addSectionComponents(playerOneSection.section)
    .addTextDisplayComponents(playerTwoSection.line)
    .addSectionComponents(
      playerTwoSection.section,
      new SectionBuilder()
        .setButtonAccessory(
          new ButtonBuilder()
            .setLabel("Thread")
            .setStyle(ButtonStyle.Link)
            .setURL(buildThreadLink(threadId))
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `-# [Game ID: ${gameId}](${buildMessageLink(gameId)})`
          )
        )
    )
    .setAccentColor(0xffffff);

  return container;
}

const perPlayerSectionLogic = ({
  isFirst,
  notTied,
  user,
  character,
  rank,
  rankedChange,
  newRank,
  scoreChange,
  newScore,
}: {
  isFirst: boolean;
  notTied: boolean;
  user: User;
  character: CharacterName | undefined;
  rank: Rank | null | undefined;
  rankedChange: boolean | undefined | null;
  newRank: Rank | null | undefined;
  scoreChange: number | undefined | null;
  newScore: number | undefined | null;
}) => {
  const line = new TextDisplayBuilder().setContent(
    notTied
      ? isFirst
        ? `**Winner** <@${user.id}>`
        : `**Loser** <@${user.id}>`
      : `<@${user.id}>`
  );

  const rankLine = rank
    ? `Rank: ${rank.rankTitle}`
    : newRank && rankedChange
      ? `Rank ${isFirst ? "up!" : "down..."} New rank: **${newRank.rankTitle}**`
      : null;

  const rankPointsLine =
    newScore !== null && newScore !== undefined
      ? `Rank Points: ${newScore}${
          scoreChange && scoreChange !== 0
            ? scoreChange > 0
              ? ` (+**${scoreChange}**)`
              : ` (-**${Math.abs(scoreChange)}**)`
            : ""
        }`
      : null;

  const charFormatted = character ? charWithEmoji(character) : "Unselected";
  const charLink = character
    ? CHARACTER_MAP[character]?.cosmetic?.imageUrl
    : undefined;

  const section = buildPlayerSection(
    charFormatted,
    rankLine,
    rankPointsLine,
    charLink
  );

  return { line, section };
};

const buildPlayerSection = (
  charFormatted: string,
  rankLine: string | null,
  rankPointsLine: string | null,
  charLink?: string
) => {
  const section = new SectionBuilder();

  if (rankLine) {
    section.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(rankLine)
    );
  }
  if (rankPointsLine) {
    section.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(rankPointsLine)
    );
  }

  section.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`Character: ${charFormatted}`)
  );

  if (charLink) {
    section.setThumbnailAccessory(new ThumbnailBuilder().setURL(charLink));
  }
  return section;
};
