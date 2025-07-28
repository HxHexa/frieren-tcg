import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  SectionBuilder,
} from "discord.js";
import { GameSettings } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import { buildThreadLink } from "@src/util/formatting/links";

export type ChallengeRequestOptions = {
  requesterId: string;
  opponentId?: string; // If false, is an open challenge
  ranked?: boolean;
  gameOptions: GameSettings;
  textSpeedMs: number;
  statusMessage?: string;
  includeButtons?: boolean;
  threadId?: string;
};

export const ACCEPT_BUTTON_ID = "tcg-accept";
export const DECLINE_BUTTON_ID = "tcg-decline";
export const CANCEL_OPEN_INVITE_BUTTON_ID = "tcg-open-invite-cancel";

export default function buildChallengeRequest({
  gameOptions,
  textSpeedMs,
  ranked = false,
  statusMessage,
  requesterId,
  opponentId,
  includeButtons = true,
  threadId,
}: ChallengeRequestOptions) {
  const {
    turnDurationSeconds,
    revealHand,
    revealDraw,
    prescienceMode,
    goddessMode,
    liteMode,
  } = gameOptions;

  const optsMap = {
    "Turn Duration": `${turnDurationSeconds}s`,
    "Reveal Hand": revealHand ? "Yes" : "No",
    "Reveal Draw": revealDraw ? "Yes" : "No",
    "Prescience Mode": prescienceMode ? "Yes" : "No",
    "Goddess Mode": goddessMode ? "Yes" : "No",
    "Lite Mode": liteMode ? "Yes" : "No",
    "Text Speed": `${textSpeedMs}ms`,
  };

  const optsText = Object.entries(optsMap)
    .map(([key, value]) => `${key}: \`${value}\``)
    .join(", ");

  const title = `### ${ranked ? "Ranked " : ""}${opponentId ? "Challenge Request" : "Open Invite"}`;
  if (!statusMessage) {
    statusMessage = opponentId
      ? `<@${requesterId}> has challenged <@${opponentId}> to a ${ranked ? "**ranked** " : ""}TCG duel`
      : `<@${requesterId}> has sent an open invite for a ${ranked ? "**ranked** " : ""}TCG duel`;
  }

  const secondaryButton = opponentId
    ? new ButtonBuilder()
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
        .setCustomId(DECLINE_BUTTON_ID)
    : new ButtonBuilder()
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(CANCEL_OPEN_INVITE_BUTTON_ID);

  const optsDisplay = new TextDisplayBuilder().setContent(optsText);

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(title),
      new TextDisplayBuilder().setContent(statusMessage)
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .setAccentColor(0xffffff);

  if (threadId) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(optsDisplay)
        .setButtonAccessory(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Thread")
            .setURL(buildThreadLink(threadId))
        )
    );
  } else {
    container.addTextDisplayComponents(optsDisplay);
  }

  if (includeButtons) {
    container.addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success)
          .setCustomId(ACCEPT_BUTTON_ID),
        secondaryButton
      )
    );
  }

  return container;
}
