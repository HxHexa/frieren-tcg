import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
  GuildMemberRoleManager,
} from "discord.js";
import type { Command } from "@src/types/command";
import config from "@src/config";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("matchfinding-ping")
    .setDescription(
      "Add or remove the TCG Matchfinding Ping which anyone can use to ping players looking for matches."
    )
    .setContexts([InteractionContextType.Guild]),

  async execute(interaction: ChatInputCommandInteraction) {
    if (
      !interaction.guild ||
      !interaction.member ||
      !(interaction.member.roles instanceof GuildMemberRoleManager)
    )
      return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (
      interaction.member.roles instanceof GuildMemberRoleManager &&
      !interaction.member.roles.cache.has(config.matchfindingPingId)
    ) {
      await interaction.member.roles.add(config.matchfindingPingId);
	  await interaction.editReply(`Added the <@&${config.matchfindingPingId}> role! Run the command again to remove it.`);
    } else {
      await interaction.member.roles.remove(config.matchfindingPingId);
      await interaction.editReply(`Removed the <@&${config.matchfindingPingId}> role`);
    }
  },
};
