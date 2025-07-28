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

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-challenge")
    .setDescription("Challenge another user to a duel!")
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
        .setName("goddess-mode")
        .setDescription("Play with the Goddess deck, with one of every card.")
    )
    .addBooleanOption((option) =>
      option
        .setName("prescience-mode")
        .setDescription(
          "Play with all cards available to use, with no Discard."
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
      const gamemode =
        (interaction.options.getString("gamemode") as GameMode) ??
        GameMode.CLASSIC;
      const gameSettings = { ...GAME_SETTINGS[gamemode] };
      const textSpeedMs = interaction.options.getInteger("text_speed_ms");

      if (!gameSettings.prescienceMode) {
        gameSettings.prescienceMode =
          interaction.options.getBoolean("prescience-mode") ?? false;
      }

      gameSettings.goddessMode =
        interaction.options.getBoolean("goddess-mode") ?? false;
      gameSettings.liteMode =
        interaction.options.getBoolean("lite-mode") ?? undefined;

      initiateChallengeRequest({
        interaction,
        gameSettings,
        ranked: false,
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
