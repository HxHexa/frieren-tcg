import {
  MAX_INVITE_LENGTH,
  MAX_TEXT_SPEED,
  MIN_INVITE_LENGTH,
  MIN_TEXT_SPEED,
} from "@src/constants";
import type { Command } from "@src/types/command";
import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { GAME_SETTINGS, GameMode } from "./gameHandler/gameSettings";
import { initiateChallengeRequest } from "./gameHandler/initiateChallengeRequest";

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
    )
    .addIntegerOption((option) =>
      option
        .setName("invite_length_mins")
        .setDescription(
          "How long you want your challenge invite to last in minutes. Defaults to 5mins."
        )
        .setMinValue(MIN_INVITE_LENGTH)
        .setMaxValue(MAX_INVITE_LENGTH)
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const gamemode =
        (interaction.options.getString("gamemode") as GameMode) ??
        GameMode.CLASSIC;
      const liteMode = interaction.options.getBoolean("lite-mode") ?? undefined;
      const gameSettings = { ...GAME_SETTINGS[gamemode], liteMode };
      const textSpeedMs = interaction.options.getInteger("text_speed_ms");
      const inviteLength = interaction.options.getInteger("invite_length_mins");

      initiateChallengeRequest({
        interaction,
        gameSettings,
        ranked: true,
        textSpeedMs,
        inviteLength,
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
