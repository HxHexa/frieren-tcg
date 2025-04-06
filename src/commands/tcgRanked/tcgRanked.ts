import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import handlePlayerStats from "./rankedHandlers/playerStats";

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
            .setDescription("The user to get ranked stats for"),
        ),
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
        }
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "tcg-ranked failed",
      });
    }
  },
};
