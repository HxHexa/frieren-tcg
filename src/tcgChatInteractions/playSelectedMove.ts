import {
  ActionRowBuilder,
  ComponentType,
  StringSelectMenuBuilder,
  GuildTextBasedChannel,
  User,
} from "discord.js";
import Character from "@tcg/character";
import Card from "@tcg/card";
import { createCountdownTimestamp } from "@src/util/utils";

// handle card selection and play the card
// returns the card played
export const playSelectedMove = async (
  player: User,
  playerThread: GuildTextBasedChannel,
  character: Character,
  playerPossibleMove: Record<string, Card>,
  turnDurationSeconds: number
): Promise<Card | null> => {
  if (character.skipTurn) {
    character.skipTurn = false;
  }

  // Create the dropdown menu
  const moveSelectId = `move-select-${player.username}-${Date.now()}`;
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(moveSelectId)
    .setPlaceholder("Select your Move")
    .addOptions(
      Object.entries(playerPossibleMove).map(([index, card]) => ({
        label: `${card.getTitle()}`,
        value: `${index}`,
        emoji: card.emoji,
      }))
    );

  const dropdown =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const response = await playerThread.send({
    content: `*(Time left: ${createCountdownTimestamp(turnDurationSeconds)})* Select your move:`,
    components: [dropdown],
  });

  const cardsIndices: string[] = Object.keys(playerPossibleMove);
  const randomIndexString =
    cardsIndices[Math.floor(Math.random() * (cardsIndices.length - 1))]; // -1 so Forfeit is always avoided
  const randomIndex: number = parseInt(randomIndexString);
  const randomCard: Card = playerPossibleMove[randomIndexString];

  return new Promise<Card>((resolve) => {
    response
      .awaitMessageComponent({
        filter: (i) => {
          i.deferUpdate();
          return i.user.id === player.id && i.customId === moveSelectId;
        },
        componentType: ComponentType.StringSelect,
        time: turnDurationSeconds * 1000,
      })
      .then((i) => {
        const selectedCardIndex = parseInt(i.values[0]);
        const selectedCard = playerPossibleMove[i.values[0]] ?? randomCard;
        if (selectedCardIndex < 6) {
          character.playCard(selectedCardIndex);
        }

        response.edit({
          content: `You selected ${selectedCard.emoji} **${selectedCard.getTitle()}**`,
          components: [],
        });

        resolve(selectedCard);
      })
      .catch((err) => {
        console.log(`Collection failed: ${err}`);
        if (randomIndex < 6) {
          character.playCard(randomIndex);
        }

        response.edit({
          content: `You selected ${randomCard.emoji} **${randomCard.getTitle()}**`,
          components: [],
        });

        resolve(randomCard);
      });
  });
};
