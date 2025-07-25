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
import { handleVsCharacter } from "./playerHandlers/vsCharactersHandler";
import { CHAR_OPTIONS } from "@src/constants";


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
        .addIntegerOption((option) =>
          option
            .setName("page")
            .setDescription("The page to get the match history for")
            .setRequired(false)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("head-to-head")
        .setDescription("Get the head to head record against another player")
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription(
              "The player you want to see the head-to-head record against."
            )
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The first player whose head-to-head record you want to see, defaults to yourself"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("vs-characters")
        .setDescription("Get the record against a character")
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription("Select the character to get stats for.")
            .setRequired(true)
            .addChoices(CHAR_OPTIONS)
        )
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The first player whose record you want to see, defaults to yourself"
            )
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
        case "vs-characters":
          {
            await handleVsCharacter(interaction);
          }
          break;
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "Interaction failed.",
      });
    }
  },
};
