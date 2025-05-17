import { FRIEREN_DISCORD_SERVER } from "@src/constants";
import type { Client, GuildMember } from "discord.js";
export async function getMemberFromDiscordId(
  client: Client,
  discordId: string
): Promise<GuildMember> {
  const guild = await getDiscordServer(client);
  if (!guild) {
    throw new Error("Frieren discord server not found");
  }

  try {
    const member = await guild.members.fetch(discordId);
    return member;
  } catch (error) {
    throw new Error(`Failed to fetch member: ${error}`);
  }
}

export async function getDiscordServer(client: Client) {
  return await client.guilds.fetch(FRIEREN_DISCORD_SERVER);
}
