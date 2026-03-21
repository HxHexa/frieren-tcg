import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageType,
  PublicThreadChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
  User,
  Message,
  MessageFlags,
} from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { tcgMain } from "@src/tcgMain";
import {
  handleDatabaseOperations,
  DatabaseOperationResult,
} from "./handleDatabaseOperations";
import buildBattleResults from "@src/ui/battleResults";
import sendMoveThreadMessage from "./utils/sendMoveThreadMessage";
import config from "@/src/config";
import { isGuildBasedChannel } from "@sapphire/discord.js-utilities";

export const initiateGame = async (
  interaction: ChatInputCommandInteraction,
  addThreadFunc: (channelId?: string | undefined) => Promise<Message<boolean>>,
  gameId: string,
  challenger: User,
  opponent: User,
  gameSettings: GameSettings,
  ranked: boolean,
  textSpeedMs: number,
  gameMode?: GameMode
) => {
  try {
    const channel = await interaction.client.channels.fetch(
      interaction.channelId
    );

    if (channel && channel instanceof TextChannel) {
      const gameThread = (await channel.threads.create({
        name: `${ranked ? "Ranked " : ""}TCG Game Thread: ${challenger.displayName} vs ${opponent.displayName} (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      })) as PublicThreadChannel<false>;
      await Promise.all([
        gameThread.members.add(challenger.id),
        gameThread.members.add(opponent.id),
      ]);

      addThreadFunc(gameThread.id).catch((error) => {
        console.error("Failed to add thread link:", error);
      });

      (async () => {
        try {
          const messages = await channel.messages.fetch({
            limit: 10,
            after: gameId,
          });
          const systemMessage = messages.find(
            (msg) =>
              msg.type === MessageType.ThreadCreated &&
              msg.author.id === interaction.client.user.id
          );

          if (systemMessage) {
            await systemMessage.delete();
          }
        } catch (error) {
          console.error("Failed to delete system message:", error);
        }
      })();

      const publicThread = gameSettings.pollCards;

      const [challengerThread, opponentThread] = gameSettings.pollCards
        ? await Promise.all([
            interaction.client.channels.fetch(
              config.teamVote.challengerChannel
            ),
            interaction.client.channels.fetch(config.teamVote.opponentChannel),
          ])
        : await Promise.all([
            buildThread(channel, challenger, gameId, publicThread),
            buildThread(
              channel,
              opponent,
              gameId,
              publicThread ?? gameSettings.publicChallengedThread
            ),
          ]);

      if (
        !isGuildBasedChannel(challengerThread) ||
        !isGuildBasedChannel(opponentThread)
      ) {
        throw new Error("Failed to create or fetch move selection threads.");
      }

      sendMoveThreadMessage(gameThread, challenger, challengerThread);
      sendMoveThreadMessage(gameThread, opponent, opponentThread);

      const gameRes = await tcgMain(
        challenger,
        opponent,
        gameThread,
        challengerThread,
        opponentThread,
        gameSettings,
        textSpeedMs
      );

      const { winner, loser, winnerCharacter, loserCharacter } = gameRes;

      if (challengerThread.isThread() && opponentThread.isThread()) {
        // thread cleanup
        await Promise.all([
          gameThread.setArchived(true, "Game completed."),
          gameThread.members.remove(challenger.id),
          gameThread.members.remove(opponent.id),
          challengerThread.setArchived(true, "Game completed."),
          challengerThread.members.remove(challenger.id),
          opponentThread.setArchived(true, "Game completed."),
          opponentThread.members.remove(opponent.id),
        ]);
      }

      let dbRes: DatabaseOperationResult | null = null;

      // handle database operations
      if (winner && winnerCharacter && loser && loserCharacter && gameMode) {
        try {
          dbRes = await handleDatabaseOperations({
            winner,
            winnerCharacter,
            loser,
            loserCharacter,
            ranked,
            gameMode,
            gameThread,
            bannedCharacters: gameRes.bannedCharacters,
          });
        } catch (error) {
          console.error(
            `Error in database operation calculation for Winner UserID ${winner.id} vs Loser UserID ${loser.id}`
          );
          console.error(error); // just log and continue
        }
      }

      const container = buildBattleResults({
        gameRes: { ...gameRes, challenger, opponent },
        dbRes,
        threadId: gameThread.id,
        gameId,
      });

      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
      });
    } else {
      await interaction.editReply({
        content:
          "The application doesn't have permission to create threads in this channel, or the channel doesn't support threads.",
        components: [],
        flags: [],
      });
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: "An error occurred while initiating the game.",
      components: [],
      flags: [], // flags must be explicitly set when editing a reply which may have components to one that uses the content field
    });
  }
};

async function buildThread(
  channel: TextChannel,
  user: User,
  gameId: string,
  publicThread = false
) {
  const thread = await channel.threads.create({
    name: `TCG Move Select: ${user.displayName}'s Move Selection Thread (ID: ${gameId})`,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
    type: publicThread ? ChannelType.PublicThread : ChannelType.PrivateThread,
  });
  await thread.members.add(user.id);
  return thread;
}
