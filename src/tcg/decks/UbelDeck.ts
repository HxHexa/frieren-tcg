import Card, { Nature } from "@tcg/card";
import CommonCardAction from "@tcg/util/commonCardActions";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { signatureMoves } from "./utilDecks/signatureMoves";
import { a_malevolentShrine } from "./utilDecks/ubelSignature";

export const empathyFailureName = "Stalking";

export const a_reelseiden = new Card({
  title: "Shallow Slash",
  description: ([dmg, atkSpd]) =>
    `HP-4. DMG ${dmg}. If used by Übel, has a 20% of missing if the opponent didn't use an Attack card before this move is used. If the attack misses, ATK+${atkSpd}, SPD+${atkSpd}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [8, 2],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 20 },
  hpCost: 4,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364756398772322304/GIF_3910829828.gif?ex=680b7cb1&is=680a2b31&hm=7aa3935ddcec9e8d1c44d6caec5f6288432c3f2800b2cec08ee42c0e5c94a25b&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

export const a_cleave = new Card({
  title: "Cleave",
  description: ([dmg, atkSpd]) =>
    `HP-6. DMG ${dmg}. If used by Übel,has a 40% of missing if the opponent didn't use an Attack card before this move is used. If the attack misses, ATK+${atkSpd}, SPD+${atkSpd}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [12, 3],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 40 },
  hpCost: 6,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364386420554203196/GIF_3999614558.gif?ex=680a241f&is=6808d29f&hm=ed397e2ab4a3166d3e6975560d40d37d928ff1a6df755fabb56425cf283d0f89&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(`A brutal slash!`, TCGThread.Gameroom);

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

export const a_dismantle = new Card({
  title: "Dismantle",
  description: ([dmg, atkSpd]) =>
    `HP-8. DMG ${dmg}. If used by Übel, has a 60% of missing if the opponent didn't use an Attack card before this move is used. If the attack misses, ATK+${atkSpd}, SPD+${atkSpd}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [16, 4],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 60 },
  hpCost: 8,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364758389111918673/GIF_1476107048.gif?ex=680b7e8b&is=680a2d0b&hm=28e6e00072ec765df91914cdea3090c0c582b5079a9ec977ca21a3f70be5aea0&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} tries to cut ${opponent.name} into pieces!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

export const rushdown = new Card({
  title: "Rushdown",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) =>
    `Increases SPD by ${spd} for 4 turns. Attacks will not miss during this period. At the end of every turn, HP-2.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cosmetic: {
    cardGif:
      "https://media.discordapp.net/attachments/1360969158623232300/1364216562600509570/GIF_2060261812.gif?ex=6808dd2e&is=68078bae&hm=120ce38d9abf8a42357d0bd650f0e5c63da9ea2232bd5ceae2716ee67a2fb67f&=&width=1440&height=820",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} rushes towards the enemy!`,
      TCGThread.Gameroom
    );

    const turnCount = 4;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Rushdown",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns. Attacks will not miss`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} is being reckless.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-2, StatsEnum.HP);
        },

        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          _messageCache.push(`${character.name} retreats.`, TCGThread.Gameroom);
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, _characterIndex) {
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
      })
    );
  },
});

const slowdown = new Card({
  title: "Slow Down",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, endOfTurnHp]) =>
    `SPD-10 for 2 turns. Heal ${hp}HP, then ${endOfTurnHp} HP at the end of each turn. Attacks will not hit while this effect is active.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10, 5],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364216703541837844/GIF_2189012353.gif?ex=6808dd50&is=68078bd0&hm=644b405b52a67b684bda6bfff12ce2ffa99d091de554b967213e07aa87883a8d&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} takes cover to ponder the fleeting nature of her life.`,
      TCGThread.Gameroom
    );

    const turnCount = 2;
    character.adjustStat(-10, StatsEnum.SPD);
    const hpIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(hpIncrease, StatsEnum.HP);

    const endOfTurnHpIncrease = this.calculateEffectValue(this.effects[1]);
    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Recompose",
        description: `Decreases SPD by 10 for ${turnCount} turns. Attacks will not hit. Heal ${endOfTurnHpIncrease} at turn end.`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} took a break and recoups.`,
            TCGThread.Gameroom
          );
          character.adjustStat(endOfTurnHpIncrease, StatsEnum.HP);
        },

        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} has recomposed ${character.cosmetic.pronouns.reflexive}.`,
            TCGThread.Gameroom
          );
          character.adjustStat(10, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, _characterIndex) {
          character.adjustStat(10, StatsEnum.SPD);
        },
      })
    );
  },
});

export const defend = new Card({
  title: "Defend",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [20],
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364384151616094239/GIF_3928500915.gif?ex=680a2202&is=6808d082&hm=09e4cc493604c6e0be6f9a04263c49d93dd9a7d20bb18c78f6b58d1fd303c9b6&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to defend against an incoming attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Defend",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const sorganeil = new Card({
  title: "Sorganeil",
  cardMetadata: { nature: Nature.Util },
  description: () =>
    `Priority-2. Will fail if the opponent's SPD is higher than your SPD by 35 or more. Set opponent's SPD to 1. Clear opponent's timed effects. Opponent can only wait next turn. Attacks will hit with 100% certainty.`,
  emoji: CardEmoji.UBEL_CARD,
  priority: -2,
  effects: [],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364748769165447188/GIF_3534737554.gif?ex=680b7596&is=680a2416&hm=97e22820e064efed4dc8688572fffad891c01cdaac28df0e7a8e0ca77661521c&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);

    if (opponent.stats.stats.SPD - character.stats.stats.SPD >= 35) {
      messageCache.push(
        `${character.name}'s gaze cannot keep up with ${opponent.name}'s speed!`,
        TCGThread.Gameroom
      );
      return;
    }

    opponent.skipTurn = true;
    const opponentOriginalSpeed = opponent.stats.stats.SPD;
    opponent.setStat(1, StatsEnum.SPD);
    messageCache.push(
      `${character.name} traps ${opponent.name} in ${character.cosmetic.pronouns.possessive} gaze!`,
      TCGThread.Gameroom
    );

    const newTimedEffects: TimedEffect[] = [];
    opponent.timedEffects.map((timedEffect) => {
      if (!timedEffect.removableBySorganeil) {
        newTimedEffects.push(timedEffect);
      }
      if (
        timedEffect.executeEndOfTimedEffectActionOnRemoval &&
        timedEffect.endOfTimedEffectAction
      ) {
        timedEffect.endOfTimedEffectAction(
          game,
          1 - characterIndex,
          messageCache
        );
      }
    });
    opponent.timedEffects = newTimedEffects;

    character.timedEffects.push(
      new TimedEffect({
        name: "Sorganeil",
        description: `Cannot miss next turn's attack`,
        turnDuration: 2,
        priority: -1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} averted ${character.cosmetic.pronouns.possessive} gaze. ${opponent.name} got free from ${character.name}'s Sorganeil.`,
            TCGThread.Gameroom
          );
          opponent.setStat(opponentOriginalSpeed, StatsEnum.SPD);
        },
      })
    );
  },
});

export const empathy = new Card({
  title: "Empathy",
  cardMetadata: { nature: Nature.Util },
  description: () =>
    `Will fail if used before turn 5. Use the opponent's signature move at this card's empower level -2.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [],
  cardAction: () => {},
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364937614494535711/GIF_3999726425.gif?ex=680b7cb6&is=680a2b36&hm=8e54664c9778ca6cc49807519b9e0afd09dffa377209d98eb3c92f78c4ce1d1b&",
  },
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    if (game.turnCount < 5) {
      return new Card({
        title: empathyFailureName,
        cardMetadata: { nature: Nature.Default },
        description: () => "Not enough time to empathize. This move will fail.",
        effects: [],
        emoji: CardEmoji.UBEL_CARD,
        cardAction: ({ name, opponent, sendToGameroom }) => {
          sendToGameroom(
            `${name} didn't get enough time to know ${opponent.name} well enough!`
          );
        },
        empathized: true,
      });
    } else {
      const opponent = game.getCharacter(1 - characterIndex);
      const signatureCard = signatureMoves[opponent.name];
      return new Card({
        ...signatureCard,
        empowerLevel: this.empowerLevel - 2,
        empathized: true,
        cosmetic: this.cosmetic,
      });
    }
  },
});

export const ubelDeck = [
  { card: a_reelseiden, count: 3 },
  { card: a_cleave, count: 2 },
  { card: a_dismantle, count: 2 },
  { card: a_malevolentShrine, count: 1 },
  { card: rushdown, count: 2 },
  { card: defend, count: 2 },
  { card: slowdown, count: 2 },
  { card: sorganeil, count: 1 },
  { card: empathy, count: 1 },
];
