// import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
// import Card, { Nature } from "../../card";
// import { CardEmoji } from "../../formatting/emojis";
// import { StatsEnum } from "../../stats";
// import CommonCardAction from "../../util/commonCardActions";
// import { serie_offensiveMagic } from "../utilDecks/serieMagic";
// import { GameMessageContext } from "@tcg/gameContextProvider";

// // Regurgitate (x5) : use any offensive magic spell you stole from the mages you digested
// // Oh nom nom nom (x3) : 15 DMG, -2 DEF : restores an equal amount of HP compared to the damage
// // Avenging my friends ! (x2) : for one turn, the mimic turns into a clone of another mage the assimilated, with their middle attacking card option.
// // Camouflage (x4) : +5 DE
// // Call to Ctuhlu : 60 DMG, sets HP to 1.

// const a_regurgitate = new Card({
//   title: "Regurgitate",
//   cardMetadata: { nature: Nature.Util },
//   description: () => `Use a random offensive spell at Empower level -2`,
//   emoji: CardEmoji.SERIE_CARD,
//   effects: [],
//   cardAction: function (this: Card, context: GameMessageContext) {
//     const { self: character, messageCache } = context;
//     messageCache.push(
//       `${character.name} regurgitated a spell it stole from a mage it munched on.`,
//       TCGThread.Gameroom
//     );

//     const baseCard =
//       serie_offensiveMagic[
//         Math.floor(Math.random() * serie_offensiveMagic.length)
//       ];
//     const newCard = new Card({
//       ...baseCard,
//       empowerLevel: this.empowerLevel - 2,
//     });

//     messageCache.push(
//       `${character.name} used **${newCard.getTitle()}**.`,
//       TCGThread.Gameroom
//     );
//     newCard.cardAction(context);
//   },
// });

// const omNomNomNom = new Card({
//   title: "Om Nom Nom Nom",
//   cardMetadata: { nature: Nature.Attack },
//   description: ([dmg]) =>
//     `DMG ${dmg}. Restores HP by half of the move's dealt damage.`,
//   emoji: CardEmoji.ENERGY,
//   effects: [5],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} gobbles the opposition!`,
//       TCGThread.Gameroom
//     );

//     const damage = this.calculateEffectValue(this.effects[0]);
//     const dealtDamage = CommonCardAction.commonAttack(game, characterIndex, {
//       damage,
//     });

//     character.adjustStat(dealtDamage / 2, StatsEnum.HP, game);
//   },
// });

// const mimic = new Card({
//   title: "Mimic",
//   cardMetadata: { nature: Nature.Util },
//   description: () =>
//     `Use the card the opponent used last turn at this card's empower level -3.`,
//   emoji: CardEmoji.LINIE_CARD,
//   effects: [],
//   cardAction: function (this: Card, context) {
//     const {
//       game,
//       self: character,
//       selfIndex: characterIndex,
//       opponent,
//       messageCache,
//     } = context;
//     messageCache.push(
//       `${character.name} imitates ${opponent.name}'s last move.`,
//       TCGThread.Gameroom
//     );

//     const lastCard =
//       game.additionalMetadata.lastUsedCards?.[1 - characterIndex];
//     if (lastCard) {
//       const newCard = new Card({
//         ...lastCard,
//         empowerLevel: this.empowerLevel - 3,
//       });

//       messageCache.push(
//         `${character.name} uses ${newCard.getTitle()}`,
//         TCGThread.Gameroom
//       );
//       newCard.cardAction(context);
//     } else {
//       messageCache.push(
//         "There was no move to imitate. The move failed!",
//         TCGThread.Gameroom
//       );
//     }
//   },
// });

// const camouflage = new Card({
//   title: `Camouflage`,
//   cardMetadata: { nature: Nature.Defense },
//   description: ([def]) => `DEF + ${def}`,
//   emoji: CardEmoji.SHIELD,
//   effects: [4],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} camouflaged itself!`,
//       TCGThread.Gameroom
//     );
//     character.adjustStat(
//       this.calculateEffectValue(this.effects[0]),
//       StatsEnum.DEF
//     );
//   },
// });

// const a_callOfCthulhu = new Card({
//   title: "Call of Cthulhu",
//   description: ([dmg]) => `HP set to 1. DMG ${dmg}.`,
//   emoji: CardEmoji.ENERGY,
//   effects: [30],
//   cardMetadata: { nature: Nature.Attack, signature: true },
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} heeds the call of Cthulhu.`,
//       TCGThread.Gameroom
//     );

//     character.setStat(1, StatsEnum.HP);
//     const damage = this.calculateEffectValue(this.effects[0]);
//     CommonCardAction.commonAttack(game, characterIndex, { damage });
//   },
// });

// export const angryMimicDeck = [
//   { card: a_regurgitate, count: 5 },
//   { card: omNomNomNom, count: 3 },
//   { card: mimic, count: 2 },
//   { card: camouflage, count: 4 },
//   { card: a_callOfCthulhu, count: 1 },
// ];
