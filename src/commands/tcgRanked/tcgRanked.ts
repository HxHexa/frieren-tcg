import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import handlePlayerStats from "./rankedHandlers/playerStats";
import { GAME_SETTINGS } from "../tcgChallenge/gameHandler/gameSettings";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import { handleGlobalStats } from "./rankedHandlers/globalStats";
import { handleCharacterGlobalStats } from "./rankedHandlers/characterStats";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-ranked")
    .setDescription("Get stats for TCG ranked games")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("player")
        .setDescription("Get ranked stats for a player, defaults to yourself")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to get ranked stats for")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("global-leaderboard")
        .setDescription(
          "Get the global top player leaderboard for a certain gamemode."
        )
        .addStringOption((option) =>
          option
            .setName("gamemode")
            .setDescription(
              "Select the gamemode to get stats for. Defaults to Classic."
            )
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character-leaderboard")
        .setDescription(
          "Get the character leaderboard for a certain character."
        )
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription("Select the character to get stats for.")
            .setRequired(true)
            .addChoices(
              Object.entries(CHARACTER_LIST).map(([_key, character]) => ({
                name: character.name,
                value: character.name,
              }))
            )
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      switch (subcommand) {
        case "player": {
          await handlePlayerStats(interaction);
          break;
        }
        case "global-leaderboard": {
          await handleGlobalStats(interaction);
          break;
        }
        case "character-leaderboard": {
          await handleCharacterGlobalStats(interaction);
          break;
        }
        default:
          await interaction.editReply({
            content: "Invalid subcommand",
          });
          break;
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "tcg-ranked failed",
      });
    }
  },
};
