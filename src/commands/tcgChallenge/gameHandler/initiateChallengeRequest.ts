import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { handleOpponent } from "./utils/handleOpponent";
import { buildChallengeButtonRespond } from "./utils/buildChallengeButtonRespond";
import config from "@src/config";
import { getPlayerPreferences } from "@src/util/db/preferences";
import { DEFAULT_TEXT_SPEED } from "@src/constants";
import { getPlayer } from "@src/util/db/getPlayer";

export async function initiateChallengeRequest(prop: {
  interaction: ChatInputCommandInteraction;
  gameSettings: GameSettings;
  ranked: boolean;
  textSpeedMs: number | null;
  gamemode?: GameMode;
}): Promise<void> {
  const { interaction, gameSettings, ranked, gamemode, textSpeedMs } = prop;
  if (config.maintenance) {
    await interaction.reply({
      content:
        "The game is currently under maintenance. New challenges are not allowed.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const player = await getPlayer(interaction.user.id);
  const playerPreferences = await getPlayerPreferences(player.id);
  if (gameSettings.liteMode === undefined) {
    gameSettings.liteMode = playerPreferences
      ? playerPreferences.tcgLiteMode
      : false;
  }

  let preferredTextSpeed = textSpeedMs;
  if (!preferredTextSpeed) {
    preferredTextSpeed = playerPreferences
      ? playerPreferences.tcgTextSpeed
      : DEFAULT_TEXT_SPEED;
  }

  await interaction.deferReply();

  const challenger = interaction.user;
  const opponent = interaction.options.getUser("opponent");

  if (!(await handleOpponent(interaction, challenger, opponent, ranked))) {
    return;
  }

  return buildChallengeButtonRespond(
    interaction,
    challenger,
    opponent,
    gameSettings,
    ranked,
    preferredTextSpeed,
    gamemode
  );
}
