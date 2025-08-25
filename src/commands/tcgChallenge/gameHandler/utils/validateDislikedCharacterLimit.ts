import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { playerExceedsDislikedLimit } from "@src/util/db/preferences";

export async function validateDislikedCharacterLimit(
  interaction: ChatInputCommandInteraction
): Promise<boolean> {
  if (await playerExceedsDislikedLimit(interaction.user.id)) {
    await interaction.reply({
      content:
        "Cannot start game: Too many disliked characters selected. Update your preferences with `/tcg-preferences disliked-character`.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}
