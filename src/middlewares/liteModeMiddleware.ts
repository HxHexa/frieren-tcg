import { Interaction } from "discord.js";
import { Middleware, NextMiddleware } from "@src/types/middleware";
import { updateTcgLiteMode } from "@src/util/db/preferences";
import { getPlayer } from "@src/util/db/getPlayer";

/**
 * Middleware to update the player's TCG lite mode preference everywhere
 * if the '/tcg-preferences lite-mode' command is used.
 */
const liteModeMiddleware: Middleware = async (
  interaction: Interaction,
  next: NextMiddleware
) => {
  if (!interaction.isChatInputCommand()) {
    return await next();
  }

  const subcommand = interaction.options.getSubcommand(true);
  if (subcommand !== "lite-mode") {
    return await next();
  }

  try {
    const enabled = interaction.options.getBoolean("enabled", true);
    const player = await getPlayer(interaction.user.id);

    updateTcgLiteMode(player.id, enabled);
  } catch (error) {
    console.error("Error in textSpeedMiddleware:", error);
    throw error;
  }

  await next();
};

export default liteModeMiddleware;
