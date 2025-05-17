import { RANK_SCORE_TO_RANK_MAPPING } from "@src/constants";
import { getDiscordServer, getMemberFromDiscordId } from "@src/util/discord";
import {
  PermissionFlagsBits,
  type Client,
  type Collection,
  type GuildMember,
  type Role,
  type User,
} from "discord.js";
import { GameMode } from "./gameSettings";
import { getTopNPlayersInGamemode } from "@src/commands/tcgStats/statsHandlers/globalStats";

export type Rank = {
  rankLevel: number;
  rankTitle: string;
  rankRoleId: string;
};

export const getRank = (score: number): Rank => {
  if (score >= 500) {
    return RANK_SCORE_TO_RANK_MAPPING[500];
  } else if (score <= 0) {
    return RANK_SCORE_TO_RANK_MAPPING[0];
  } else {
    const flooredScore = Math.floor(score / 100) * 100;
    if (flooredScore in RANK_SCORE_TO_RANK_MAPPING) {
      return RANK_SCORE_TO_RANK_MAPPING[flooredScore];
    } else {
      throw new Error(
        `Invalid score ${score} with floored score ${flooredScore}`
      );
    }
  }
};

/**
 * Returns a collection of roles for a member with all rank roles removed and the new rank role added
 * @param member The Discord guild member to update roles for
 * @param rank The rank to assign to the member
 * @returns A collection of roles with the updated rank role
 */
export async function getNewRolesForRank(
  member: GuildMember,
  rank: Rank
): Promise<Collection<string, Role>> {
  const currentRoles = member.roles.cache;

  const allRankRoleIds = Object.values(RANK_SCORE_TO_RANK_MAPPING).map(
    (rankMapping) => rankMapping.rankRoleId
  );

  const rankRoleIdSet = new Set(allRankRoleIds);
  const rolesWithoutOldRanks = currentRoles.filter(
    (role) => !rankRoleIdSet.has(role.id)
  );

  const newRankRole = member.guild.roles.cache.get(rank.rankRoleId);

  if (!newRankRole) {
    console.error(
      `Rank role with ID ${rank.rankRoleId} not found in guild ${member.guild.id} cache. This indicates a configuration issue.`
    );
    return rolesWithoutOldRanks;
  }

  const finalRoles = rolesWithoutOldRanks.set(newRankRole.id, newRankRole);

  return finalRoles;
}

export async function updateMemberRoles(
  client: Client,
  user: User,
  newRank: Rank
) {
  try {
    const member = await getMemberFromDiscordId(client, user.id);
    if (!member) {
      console.error(`Could not find Discord member for user ${user.id}`);
      return;
    }

    const newRoles = await getNewRolesForRank(member, newRank);
    const discordServer = await getDiscordServer(client);
    if (!discordServer) {
      throw new Error("Frieren discord server not found");
    }
    if (
      !discordServer.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {
      throw new Error("Missing MANAGE_ROLES permission");
    }

    if (!member.manageable) {
      throw new Error("User is not manageable");
    }

    await member.roles.set(newRoles, "Rank Sync");
  } catch (error) {
    console.error(`Failed to update roles for user ${user.id}:`, error);
  }
}

export async function removeAllRankRoles(client: Client) {
  const guild = await getDiscordServer(client);
  if (!guild) {
    throw new Error("Frieren discord server not found");
  }

  const ladderPlayers = await getTopNPlayersInGamemode(GameMode.CLASSIC, 100);
  if (!ladderPlayers) {
    throw new Error("Failed to get ladder players");
  }

  for (const { player } of ladderPlayers) {
    try {
      const member = await getMemberFromDiscordId(client, player.discordId);
      if (!member) {
        console.error(
          `Could not find Discord member for user ${player.discordId}`
        );
        continue;
      }

      const currentRoles = member.roles.cache;
      const rankRoleIdSet = new Set(
        Object.values(RANK_SCORE_TO_RANK_MAPPING).map(
          (rankMapping) => rankMapping.rankRoleId
        )
      );
      const rolesWithoutRankRoles = currentRoles.filter(
        (role) => !rankRoleIdSet.has(role.id)
      );

      if (
        !member.guild.members.me?.permissions.has(
          PermissionFlagsBits.ManageRoles
        )
      ) {
        throw new Error("Missing MANAGE_ROLES permission");
      }

      if (!member.manageable) {
        throw new Error("User is not manageable");
      }

      await member.roles.set(rolesWithoutRankRoles, "Ladder reset");
    } catch (error) {
      console.error(
        `Failed to remove rank roles for user ${player.discordId}:`,
        error
      );
    }
  }
}
