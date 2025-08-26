import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { handlePlayerPreferences } from "./preferencesHandlers/preferencesHandler";
import { MAX_TEXT_SPEED, MIN_TEXT_SPEED } from "@src/constants";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-preferences")
    .setDescription("Manage your preferences")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-text-speed")
        .setDescription("Set your preferred TCG text display speed")
        .addIntegerOption((option) =>
          option
            .setName("speed")
            .setDescription(
              "The text speed (e.g., 500 for fast, 2000 for slow - in milliseconds)"
            )
            .setRequired(true)
            .setMinValue(MIN_TEXT_SPEED)
            .setMaxValue(MAX_TEXT_SPEED)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("favourite-character")
        .setDescription(
          "Add or remove a character from your list of favourite characters"
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lite-mode")
        .setDescription(
          "Enable or disable TCG lite mode (gifs will be disabled)"
        )
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable TCG lite mode")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disliked-character")
        .setDescription(
          "Add or remove a character from your list of disliked characters"
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View your current player preferences")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
      withResponse: true,
    });

    try {
      handlePlayerPreferences(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
