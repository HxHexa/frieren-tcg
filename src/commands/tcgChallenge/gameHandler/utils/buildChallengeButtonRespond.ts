import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  MessageFlags,
  User,
} from "discord.js";
import buildChallengeRequest, {
  ACCEPT_BUTTON_ID,
  DECLINE_BUTTON_ID,
  CANCEL_OPEN_INVITE_BUTTON_ID,
} from "@src/ui/challengeRequest";
import { GameMode, GameSettings } from "../gameSettings";
import { initiateGame } from "../initiateGame";
import validateMatchButtonInteractions from "./validateMatchButtonInteractions";
import { playerExceedsDislikedLimit } from "@src/util/db/preferences";

export const buildChallengeButtonRespond = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null,
  gameSettings: GameSettings,
  ranked: boolean,
  textSpeedMs: number,
  gameMode?: GameMode
) => {
  const containerOpts = {
    requesterId: challenger.id,
    opponentId: opponent?.id,
    ranked,
    gameOptions: gameSettings,
    textSpeedMs,
  };

  const container = buildChallengeRequest(containerOpts);

  const updateStatus = async (
    interaction: ButtonInteraction,
    statusMessage: string
  ) => {
    const newContainer = buildChallengeRequest({
      ...containerOpts,
      statusMessage,
      includeButtons: false,
    });
    return await interaction.update({
      flags: MessageFlags.IsComponentsV2,
      components: [newContainer],
    });
  };

  const editReply = async (
    interaction: ChatInputCommandInteraction,
    statusMessage: string,
    threadId?: string
  ) => {
    const newContainer = buildChallengeRequest({
      ...containerOpts,
      statusMessage,
      includeButtons: false,
      threadId,
    });
    return await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: [newContainer],
    });
  };

  await interaction.editReply({
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  });

  const response = await interaction.fetchReply();

  if (response) {
    let challengeResolved = false; // track if challenge was successfully resolved

    const collector = response.createMessageComponentCollector({
      time: 300_000, // 5 minutes
      filter: async (i) =>
        validateMatchButtonInteractions(i, challenger, opponent, ranked),
    });

    // handle button clicks
    collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      if (buttonInteraction.customId === ACCEPT_BUTTON_ID) {
        // check if the accepting player exceeds disliked character limit
        const acceptingPlayer = opponent ?? buttonInteraction.user;
        if (await playerExceedsDislikedLimit(acceptingPlayer.id)) {
          await buttonInteraction.reply({
            content:
              "Cannot accept challenge: Too many disliked characters selected. Update your preferences with `/tcg-preferences disliked-character`.",
            flags: MessageFlags.Ephemeral,
          });
          // dont return so the collector continue for other players
          return;
        }

        // mark challenge as resolved and stop collector
        challengeResolved = true;
        collector.stop("game_started");

        const acceptMessage = opponent
          ? `Challenge accepted by ${opponent}! Setting up the game...`
          : `Open invite accepted by ${buttonInteraction.user}! Setting up the game...`;

        await updateStatus(buttonInteraction, acceptMessage);

        const addThreadFunc = editReply.bind(null, interaction, acceptMessage);

        // start game
        await initiateGame(
          interaction,
          addThreadFunc,
          response.id,
          challenger,
          opponent ?? buttonInteraction.user,
          gameSettings,
          ranked,
          textSpeedMs,
          gameMode
        );
      } else if (buttonInteraction.customId === DECLINE_BUTTON_ID) {
        challengeResolved = true;
        collector.stop("declined");
        await updateStatus(
          buttonInteraction,
          `Challenge declined by ${opponent}!`
        );
      } else if (buttonInteraction.customId === CANCEL_OPEN_INVITE_BUTTON_ID) {
        challengeResolved = true;
        collector.stop("cancelled");
        const cancelMessage = `${challenger} has cancelled their open invite.`;

        await updateStatus(buttonInteraction, cancelMessage);
      }
    });

    // Handle collector end (timeout)
    collector.on("end", async (collected, reason) => {
      if (!challengeResolved && reason === "time") {
        const timeoutMessage = opponent
          ? `Challenge request expired. ${opponent} did not respond in time.`
          : `Open invite expired. Nobody accepted the invite in time.`;

        try {
          // use message.edit() instead of interaction.editReply() for timeouts
          const newContainer = buildChallengeRequest({
            ...containerOpts,
            statusMessage: timeoutMessage,
            includeButtons: false,
          });
          await response.edit({
            flags: MessageFlags.IsComponentsV2,
            components: [newContainer],
          });
        } catch (error) {
          console.error("Failed to update expired challenge message:", error);
        }
      }
    });
  }
};
