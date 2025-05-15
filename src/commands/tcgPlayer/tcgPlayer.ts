import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import handlePlayerProfile from "./playerHandlers/profileHandler";
import handleMatchHistory from "./playerHandlers/matchHandler";
import { handleHeadToHead } from "./playerHandlers/headToHeadHandler";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-player")
    .setDescription("Get information about a TCG player")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("profile")
        .setDescription(
          "Get a player's profile with ladder ranks, achievements, and character masteries"
        )
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player to get the profile of, defaults to yourself"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("match-history")
        .setDescription("Get a player's match history")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player to get the match history of, defaults to yourself"
            )
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("head-to-head")
        .setDescription("Get a player's head to head record")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("The player to get the head to head record of")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      // sub commands
      switch (subcommand) {
        case "profile":
          {
            await handlePlayerProfile(interaction);
          }
          break;
        case "match-history":
          {
            await handleMatchHistory(interaction);
          }
          break;
        case "head-to-head":
          {
            await handleHeadToHead(interaction);
          }
          break;
      }
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
