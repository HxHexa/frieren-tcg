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

export const buildChallengeButtonRespond = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null,
  gameSettings: GameSettings,
  ranked: boolean,
  textSpeedMs: number,
  inviteLength: number,
  gameMode?: GameMode
) => {
  const containerOpts = {
    requesterId: challenger.id,
    opponentId: opponent?.id,
    ranked,
    gameOptions: gameSettings,
    textSpeedMs,
    inviteLength,
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
    const collector = response.createMessageComponentCollector({
      max: 1,
      time: inviteLength * 60_000,
      filter: async (i) =>
        validateMatchButtonInteractions(i, challenger, opponent, ranked),
    });

    // handle button clicks
    collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      if (buttonInteraction.customId === ACCEPT_BUTTON_ID) {
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
        await updateStatus(
          buttonInteraction,
          `Challenge declined by ${opponent}!`
        );
      } else if (buttonInteraction.customId === CANCEL_OPEN_INVITE_BUTTON_ID) {
        const cancelMessage = `${challenger} has cancelled their open invite.`;

        await updateStatus(buttonInteraction, cancelMessage);
      }
    });

    // Handle collector end (timeout)
    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        const timeoutMessage = opponent
          ? `Challenge request expired. ${opponent} did not respond in time.`
          : `Open invite expired. Nobody accepted the invite in time.`;

        try {
          await editReply(interaction, timeoutMessage);
        } catch {
          collector.stop("Failed to edit message");
        }
      }
    });
  }
};
