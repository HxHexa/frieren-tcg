import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ThreadChannel,
  SendableChannels,
} from "discord.js";
import type { Command } from "@src/types/command";
import { CardEmoji } from "@tcg/formatting/emojis";

const TRUE_DURATION = 1.5 * 60 * 1000;

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("card-poll")
    .setDescription("Poll")
    .addStringOption((option) =>
      option
        .setName("cards")
        .setDescription("The card names to vote on")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.channel?.isSendable()) return;
    const cardInput = interaction.options.getString("cards", true);
    const cards = parseCardInput(cardInput);
    await sendCardPoll(interaction.channel, cards);
  },
};

function parseCardInput(input: string) {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .map((entry) => {
      const [emojiPart, namePart] = entry.split(":").map((s) => s.trim());

      return {
        name: namePart,
        emoji: emojiPart ?? CardEmoji.GENERIC,
      };
    })
    .filter((card) => card.name.length > 0);
}

export async function sendCardPoll(
  channel: ThreadChannel | SendableChannels,
  cards: { name: string; emoji: string }[]
) {
  const message = await channel.send({
    content: `Vote ends <t:${Math.floor((Date.now() + TRUE_DURATION) / 1000)}:R>`,
    poll: {
      question: { text: "Which card do you want your team to play?" },
      answers: cards.map((card) => ({
        emoji: card.emoji,
        text: truncateSpellName(card.name),
      })),
      duration: 1,
      allowMultiselect: false,
    },
  });

  setTimeout(async () => {
    await message.poll?.end();
  }, TRUE_DURATION);
}

const MAX_LENGTH = 55;
const EMPOWER_LENGTH = 3;
const ELLIPSIS = "...";

function truncateSpellName(name: string) {
  if (name.length <= MAX_LENGTH) return name;

  const keepStart = MAX_LENGTH - ELLIPSIS.length - EMPOWER_LENGTH;
  if (keepStart <= 0) {
    return name.slice(-EMPOWER_LENGTH);
  }

  return name.slice(0, keepStart) + ELLIPSIS + name.slice(-EMPOWER_LENGTH);
}
