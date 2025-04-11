import {
  ChannelType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import type { Command } from "../../types/command";
import handleAchievementAutocomplete from "./achievementHandler/handleAchievementAutocomplete";
import handleGrantAchievement from "./achievementHandler/handleGrantAchievement";
import { ProgressBarBuilder } from "@src/tcg/formatting/percentBar";
import config from "@src/config";
import { isTextChannel } from "@sapphire/discord.js-utilities";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-admin")
    .setDescription("Admin commands for TCG game")
    .setContexts([InteractionContextType.Guild])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("debug-progress-bar")
        .setDescription("Debug the progress bar")
        .addIntegerOption((option) =>
          option
            .setName("value")
            .setDescription("Value of the progress bar")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("length")
            .setDescription("How many emojis long the progress bar is")
            .setMinValue(4)
            .setRequired(false)
        )
        .addIntegerOption((option) =>
          option
            .setName("max_value")
            .setDescription("Max value of the progress bar")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(false)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("grant-achievement")
        .setDescription("Grant an achievement to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to grant the achievement to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("achievement")
            .setDescription("Achievement to grant")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("maintenance")
        .setDescription("Manage maintenance mode")
        .addBooleanOption((option) =>
          option
            .setName("maintenance")
            .setDescription("Enable or disable maintenance mode")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .addChannelTypes(ChannelType.GuildText)
            .setDescription(
              "Channel to send maintenance message to (Default: current channel)"
            )
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("send_message")
            .setDescription(
              "Send a maintenance message to the channel (Default: true)"
            )
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "grant-achievement":
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });

          try {
            await handleGrantAchievement(interaction);
            await interaction.editReply({
              content: "Achievement granted successfully.",
            });
          } catch (error) {
            console.error("Error granting achievement:", error);
            await interaction.editReply({
              content: "Failed to grant achievement.",
            });
          }

          break;
        case "debug-progress-bar":
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });

          const maxValue = interaction.options.getInteger("max_value");
          const value = interaction.options.getInteger("value", true);
          const length = interaction.options.getInteger("length");

          try {
            const progressBar = new ProgressBarBuilder()
              .setValue(value)
              .setMaxValue(maxValue ?? 100)
              .setLength(length ?? 12)
              .build();
            const bar = progressBar.barString;

            await interaction.editReply({
              content: `**Progress Bar:**\n${bar}`,
            });
          } catch (error) {
            console.error("Error in progress bar builder:", error);
            await interaction.editReply({
              content: "Failed to build progress bar.",
            });
          }

          break;
        case "maintenance":
          handleMaintenance(interaction);
          break;
        default:
          await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
          });
          await interaction.editReply({
            content: "Invalid subcommand.",
          });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  async autocomplete(interaction) {
    try {
      return await handleAchievementAutocomplete(interaction);
    } catch (error) {
      console.error("Error in achievement autocomplete:", error);
      await interaction.respond([]);
    }
  },
};

async function handleMaintenance(interaction: ChatInputCommandInteraction) {
  const sendMessage = interaction.options.getBoolean("send_message") ?? true;
  const channel =
    interaction.options.getChannel<ChannelType.GuildText>("channel") ??
    interaction.channel;

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const maintenance = interaction.options.getBoolean("maintenance", true);
  try {
    config.maintenance = maintenance;
    await interaction.editReply({
      content: `Maintenance mode is now ${
        maintenance ? "enabled" : "disabled"
      }.`,
    });

    if (sendMessage && isTextChannel(channel)) {
      const message = maintenance
        ? `The game has entered maintenance mode. New challenges will not be accepted. Thank you for your patience.`
        : `The game has exited maintenance mode. New challenges are now accepted.`;

      const maintenanceEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Maintenance Mode")
        .setDescription(message);

      await channel.send({
        embeds: [maintenanceEmbed],
      });
    }
  } catch (error) {
    console.error("Error in maintenance mode:", error);
    await interaction.editReply({
      content: "Failed to set maintenance mode.",
    });
  }
}
