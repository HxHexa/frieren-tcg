import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import handlePlayerProfile from "./playerHandlers/profileHandler";
import handleMatchHistory from "./playerHandlers/matchHandler";
import { handleVsCharacter } from "./playerHandlers/vsCharactersHandler";
import { handleVsRecord } from "./playerHandlers/handleVsRecord";
import { CHAR_OPTIONS } from "@src/constants";
import seasonAutocomplete, {
  seasonOption,
} from "../tcgStats/statsHandlers/seasonAutocomplete";

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
            .setMinValue(1)
        )
        .addIntegerOption(seasonOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("vs-record")
        .setDescription("Get a player's record against others")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player whose vs record you want to see, defaults to yourself"
            )
        )
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription(
              "The opponent to the player, defaults to a list of all opponents"
            )
        )
        .addIntegerOption(seasonOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("vs-character-record")
        .setDescription("Get a player's record against a character")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player whose vs record you want to see, defaults to yourself"
            )
        )
        .addStringOption((option) =>
          option
            .setName("player-character")
            .setDescription(
              "Select the character to get stats for, defaults to an overview."
            )
            .addChoices(CHAR_OPTIONS)
        )
        .addStringOption((option) =>
          option
            .setName("opponent-character")
            .setDescription(
              "Select the character to get stats against, defaults to an overview."
            )
            .addChoices(CHAR_OPTIONS)
        )
        .addIntegerOption(seasonOption)
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
        case "vs-record":
          {
            await handleVsRecord(interaction);
          }
          break;
        case "vs-character-record":
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

  async autocomplete(interaction) {
    await seasonAutocomplete(interaction);
  },
};
