import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getWinrate } from "@src/util/utils";
import { getMatchHistoryAgainstCharacter } from "@src/util/db/getMatchHistory";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export async function handleVsCharacter(
  interaction: ChatInputCommandInteraction
) {
  const playerId = interaction.options.getUser("player") ?? interaction.user;
  const character: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;

  const vsCharacterMatches = await getMatchHistoryAgainstCharacter(
    playerId.id,
    character
  );

  if (vsCharacterMatches.length === 0) {
    await interaction.editReply({
      content: `There are no records of ${playerId} against ${character} in the current ladder.`,
    });
    return;
  }

  const mirrorMatches = vsCharacterMatches.filter(
    (match) => match.winnerCharacter.name === match.loserCharacter.name
  );
  const playerIdWins = vsCharacterMatches.filter(
    (match) => match.winner.discordId === playerId.id
  ).length;
  const playerIdLosses = vsCharacterMatches.length - playerIdWins;
  const overallWinrate = getWinrate(playerIdWins, playerIdLosses);

  const playerIdMirrorWins = mirrorMatches.filter(
    (match) => match.winner.discordId === playerId.id
  ).length;
  const playerIdMirrorLosses = mirrorMatches.length - playerIdMirrorWins;
  const mirrorWinrate = getWinrate(playerIdMirrorWins, playerIdMirrorLosses);

  const overallRecordSummary = [
    `**Overall Record vs Character:**`,
    `- Total Matches: ${overallWinrate.total}`,
    `- Record: ${playerIdWins} wins - ${playerIdLosses} losses (${overallWinrate.winrate}% win rate)`,
    `**Mirror Matches:**`,
    `- Total Mirror Matches: ${mirrorMatches.length}`,
    `- Record: ${playerIdMirrorWins} wins - ${playerIdMirrorLosses} losses (${mirrorWinrate.winrate}% win rate)`,
    `\n`,
  ].join("\n");

  const paginated = formatMatchHistoryPages(
    vsCharacterMatches,
    playerId,
    `${playerId.displayName}'s Head-to-Head vs ${character}`,
    { prependDescription: overallRecordSummary }
  );

  await paginated.run(interaction);
}
