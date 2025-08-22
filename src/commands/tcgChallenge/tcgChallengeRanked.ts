import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { initiateChallengeRequest } from "./gameHandler/initiateChallengeRequest";
import { GAME_SETTINGS, GameMode } from "./gameHandler/gameSettings";
import { MAX_TEXT_SPEED, MIN_TEXT_SPEED } from "@src/constants";
import { playerExceedsDislikedLimit } from "@src/util/db/preferences";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-ranked-challenge")
    .setDescription("Challenge another user to a Ranked duel!")
    .setContexts([InteractionContextType.Guild])
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The player you want to challenge")
    )
    .addStringOption((option) =>
      option
        .setName("gamemode")
        .setDescription("Select the gamemode. Defaults to Classic.")
        .setRequired(false)
        .addChoices(
          Object.entries(GAME_SETTINGS)
            .filter(([, game]) => game.optionName && game.allowedOption)
            .map(([key, game]) => ({
              name: game.optionName ?? "optionName should be defined",
              value: key,
            }))
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("lite-mode")
        .setDescription("Disable printing of media (GIFs/character portraits).")
    )
    .addIntegerOption((option) =>
      option
        .setName("text_speed_ms")
        .setDescription(
          "What the delay between game messages should be in ms. Defaults to 1500ms."
        )
        .setMinValue(MIN_TEXT_SPEED)
        .setMaxValue(MAX_TEXT_SPEED)
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // check if player exceeds disliked character limit
      if (await playerExceedsDislikedLimit(interaction.user.id)) {
        await interaction.reply({
          content:
            "Cannot start game: Too many disliked characters selected. Update your preferences with `/tcg-preferences disliked-character`.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const gamemode =
        (interaction.options.getString("gamemode") as GameMode) ??
        GameMode.CLASSIC;
      const liteMode = interaction.options.getBoolean("lite-mode") ?? undefined;
      const gameSettings = { ...GAME_SETTINGS[gamemode], liteMode };
      const textSpeedMs = interaction.options.getInteger("text_speed_ms");

      initiateChallengeRequest({
        interaction,
        gameSettings,
        ranked: true,
        textSpeedMs,
        gamemode,
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Failed to start game.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
