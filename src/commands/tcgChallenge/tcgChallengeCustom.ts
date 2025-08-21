import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { initiateChallengeRequest } from "./gameHandler/initiateChallengeRequest";
import { MAX_TEXT_SPEED, MIN_TEXT_SPEED } from "@src/constants";
import { MAX_INVITE_LENGTH, MIN_INVITE_LENGTH } from "@src/constants"

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-custom-challenge")
    .setDescription("Challenge another user to a custom duel!")
    .setContexts([InteractionContextType.Guild])
    .addIntegerOption((option) =>
      option
        .setName("turn-duration-seconds")
        .setDescription("The turn duration in seconds. Min: 1. Max: 300")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-hand")
        .setDescription("Whether the player's hands are revealed.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-active-card")
        .setDescription("Whether the player's active cards are revealed.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The player you want to challenge")
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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const turnDurationSeconds = Math.max(
        Math.min(
          interaction.options.getInteger("turn-duration-seconds") ?? 45,
          300
        ),
        1
      );
      const revealHand = interaction.options.getBoolean("reveal-hand") ?? false;
      const revealDraw =
        interaction.options.getBoolean("reveal-active-card") ?? false;
      const textSpeedMs = interaction.options.getInteger("text_speed_ms");
      const inviteLength = interaction.options.getInteger("invite_length_mins");
      const goddessMode =
        interaction.options.getBoolean("goddess-mode") ?? false;
      const prescienceMode =
        interaction.options.getBoolean("prescience-mode") ?? false;
      const liteMode = interaction.options.getBoolean("lite-mode") ?? undefined;

      initiateChallengeRequest({
        interaction,
        gameSettings: {
          turnDurationSeconds,
          revealHand,
          revealDraw,
          goddessMode,
          prescienceMode,
          liteMode,
        },
        ranked: false,
        gamemode: undefined,
        textSpeedMs,
        inviteLength,
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
