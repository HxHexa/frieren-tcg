import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import { GAME_SETTINGS } from "../tcgChallenge/gameHandler/gameSettings";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import { handleGlobalStats } from "./statsHandlers/globalStats";
import { handleCharacterGlobalStats } from "./statsHandlers/characterLeaderboard";
import { handleCharacterStats } from "./statsHandlers/characterStats";

const charOptions = Object.entries(CHARACTER_LIST).map(([, character]) => ({
  name: character.name,
  value: character.name,
}));

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-stats")
    .setDescription("Get stats for TCG ranked games")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
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
            .addChoices(charOptions)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character")
        .setDescription("Get match stats for a certain character.")
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription(
              "Select the character to get stats for, defaults to an overview."
            )
            .setRequired(false)
            .addChoices(charOptions)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      switch (subcommand) {
        case "global-leaderboard": {
          await handleGlobalStats(interaction);
          break;
        }
        case "character-leaderboard": {
          await handleCharacterGlobalStats(interaction);
          break;
        }
        case "character": {
          const character = interaction.options.getString("character");
          await handleCharacterStats(interaction, character);
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
