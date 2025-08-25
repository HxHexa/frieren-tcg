import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { AuraPlatoon } from "../characters/characterData/characterUtil/auraPlatoon";
import Rolls from "../util/rolls";
import mediaLinks from "../formatting/mediaLinks";

const rusted_blades = new Card({
  title: "Rusted Blades",
  cardMetadata: { nature: Nature.Attack, armyStrength: 10 },
  description: ([atk]) =>
    `ATK+${atk}. Army Strength+10. Summon 2 Swordsmen platoons.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_rustedBlades_gif,
  },
  effects: [3],
  hpCost: 5,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth the swordsmen platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Swordsmen);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Swordsmen);
    selfStat(0, StatsEnum.ATK);
  },
});

const weathered_shields = new Card({
  title: "Weathered Shields",
  cardMetadata: { nature: Nature.Util, armyStrength: 10 },
  description: ([def]) =>
    `DEF+${def}. Army Strength+10. Summon 2 Shieldbearers platoons.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_weatheredShields_gif,
  },
  effects: [3],
  hpCost: 5,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth the shieldbearers platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Shieldbearers);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Shieldbearers);
    selfStat(0, StatsEnum.DEF);
  },
});

const broken_arrows = new Card({
  title: "Broken Arrows",
  cardMetadata: { nature: Nature.Attack, armyStrength: 10 },
  description: ([spd]) =>
    `SPD+${spd}. Army Strength+10. Summon 2 Archers platoons.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_brokenArrows_gif,
  },
  effects: [3],
  hpCost: 5,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth the archers platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Archers);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Archers);
    selfStat(0, StatsEnum.SPD);
  },
});

const fallen_empire = new Card({
  title: "Fallen Empire",
  cardMetadata: { nature: Nature.Attack, armyStrength: 15 },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Army Strength+15. Summons 1 Swordsmen, 1 Shieldbearer and 1 Archer platoon.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_fallenEmpire_gif,
  },
  effects: [2],
  hpCost: 10,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`Before ${name} stands an army rivaling that of an empire.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Swordsmen);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Shieldbearers);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Archers);

    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
  },
});

const retreat = new Card({
  title: "Retreat",
  cardMetadata: { nature: Nature.Util, hideEmpower: true },
  description: () =>
    `Until the end of the turn, halve ATK. All damage taken that turn will be taken by the Army instead. This move fails if you have no army.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_retreat_gif,
  },
  effects: [],
  priority: 2,
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStats, flatSelfStat, possessive }
  ) {
    sendToGameroom(
      `${name} commanded the army to protect ${possessive} retreat.`
    );
    if (self.additionalMetadata.auraPlatoonQueue.length === 0) {
      sendToGameroom(`But there is no army to protect ${possessive}.`);
      return;
    }

    self.additionalMetadata.auraRetreat = true;
    const currentAtk = selfStats.ATK;
    const atkReduction = Number((currentAtk / 2).toFixed(2));
    flatSelfStat(atkReduction, StatsEnum.ATK, -1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Retreat",
        description: `Halve ATK. All damage taken this turn will be taken by the Army instead.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`${name} returned from hiding.`);
          self.additionalMetadata.auraRetreat = false;
          flatSelfStat(atkReduction, StatsEnum.ATK);
        },
      })
    );
  },
});

const rot = new Card({
  title: "Rot",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_rot_gif,
  },
  description: ([stat, dmg]) =>
    `For the next 3 turns, ATK+${stat} and SPD+${stat}. Each hit by Swordsmen and Archers platoons deal an additional ${dmg} flat damage. At each turn end, HP-3.`,
  effects: [2, 1],
  cardAction: ({
    name,
    self,
    sendToGameroom,
    calcEffect,
    possessive,
    flatSelfStat,
  }) => {
    sendToGameroom(`${name}'s army strikes with poisoned blades.`);
    const stat = calcEffect(0);
    const damage = calcEffect(1);

    flatSelfStat(stat, StatsEnum.ATK);
    flatSelfStat(stat, StatsEnum.SPD);
    self.additionalMetadata.auraRotDamage += damage;

    self.timedEffects.push(
      new TimedEffect({
        name: "Rot",
        description: `ATK+${stat}. SPD+${stat}. Each Swordsmen and Archer attacks deal ${damage} flat damage.`,
        turnDuration: 3,
        priority: -1,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          sendToGameroom(`${name} expenses ${possessive} mana...`);
          flatSelfStat(3, StatsEnum.HP, -1);
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom("The wounds scab over.");
          flatSelfStat(stat, StatsEnum.ATK, -1);
          flatSelfStat(stat, StatsEnum.SPD, -1);
          self.additionalMetadata.auraRotDamage -= damage;
        },
      })
    );
  },
});

const immortalWall = new Card({
  title: "Immortal Wall",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_immortalWall_gif,
  },
  description: ([def, dmg, shieldDmg]) =>
    `For the next 3 turns, DEF+${def}. Once per turn, if hit, counter attack for ${dmg} + ${shieldDmg}x #Shieldbearers. At each turn end, HP-3.`,
  effects: [3, 4, 1],
  cardAction: ({
    name,
    self,
    sendToGameroom,
    calcEffect,
    possessive,
    flatSelfStat,
    flatAttack,
  }) => {
    sendToGameroom(`${name}'s army stands in formation.`);
    const def = calcEffect(0);
    const counterDamage = calcEffect(1);
    const perShieldCounterDamage = calcEffect(2);

    flatSelfStat(def, StatsEnum.DEF);

    // Add damage calculation function to queue
    self.additionalMetadata.auraCounterAttacksDamage.push(
      (shieldbearersCount: number) => {
        return counterDamage + shieldbearersCount * perShieldCounterDamage;
      }
    );

    self.ability.abilityCounterEffect = (
      _game,
      _characterIndex,
      _messageCache,
      _attackDamage
    ) => {
      if (
        !self.additionalMetadata.auraCounterAttackedThisTurn &&
        self.additionalMetadata.auraCounterAttacksDamage.length > 0
      ) {
        sendToGameroom(`${name}'s army countered the attack.`);
        const shieldbearersCount =
          self.additionalMetadata.auraPlatoonQueue.filter(
            (p) => p === AuraPlatoon.Shieldbearers
          ).length;
        console.log("Countering");
        console.log(`shieldbearersCount: ${shieldbearersCount}`);
        console.log(
          `counter damages: ${self.additionalMetadata.auraCounterAttacksDamage}`
        );
        self.additionalMetadata.auraCounterAttacksDamage.forEach(
          (damageFunc) => {
            flatAttack(damageFunc(shieldbearersCount));
          }
        );

        self.additionalMetadata.auraCounterAttackedThisTurn = true;
      }
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Loyalty",
        description: `DEF+${def}. Once per turn, if hit, counter attack for ${counterDamage} + ${perShieldCounterDamage}x #Shieldbearers.`,
        turnDuration: 3,
        priority: -1,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          sendToGameroom(`${name} expenses ${possessive} mana...`);
          flatSelfStat(3, StatsEnum.HP, -1);
          self.additionalMetadata.auraCounterAttackedThisTurn = false;
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom("The army falls apart.");
          flatSelfStat(def, StatsEnum.DEF, -1);
          self.additionalMetadata.auraCounterAttacksDamage.shift();
          console.log("Deducing");
          console.log(
            `counter damages: ${self.additionalMetadata.auraCounterAttacksDamage}`
          );
        },
      })
    );
  },
});

const guillotine = new Card({
  title: "Guillotine",
  cardMetadata: { nature: Nature.Attack, armyStrength: -20 },
  description: ([dmg, swrdDmg]) =>
    `Army Strength -20. DMG ${dmg} + ${swrdDmg}x #Swordsmen. Remove all Swordsmen afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_guillotine_gif,
  },
  effects: [14, 2],
  hpCost: 8,
  cardAction: function (
    this: Card,
    {
      self,
      calcEffect,
      name,
      possessive,
      sendToGameroom,
      flatAttack,
      flatSelfStat,
    }
  ) {
    const swordsmenCount = self.additionalMetadata.auraPlatoonQueue.filter(
      (p) => p === AuraPlatoon.Swordsmen
    ).length;
    const damage = calcEffect(0) + swordsmenCount * calcEffect(1);
    sendToGameroom(`${name} heaved ${possessive} blade.`);
    flatAttack(damage);

    // remove swordsmen
    const lostAttack = swordsmenCount * 2;
    flatSelfStat(lostAttack, StatsEnum.ATK, -1);
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Swordsmen
      );
  },
});

const stolen_valor = new Card({
  title: "Stolen Valor",
  cardMetadata: { nature: Nature.Util, armyStrength: -20 },
  description: ([hp, shieldsHeal]) =>
    `Army Strength -20. Heal ${hp}HP + ${shieldsHeal}x #Shieldsbearer. Remove all Shieldsbearer afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_stolenValor_gif,
  },
  effects: [10, 2],
  cardAction: function (
    this: Card,
    { self, calcEffect, name, possessive, sendToGameroom, flatSelfStat }
  ) {
    const shieldbearersCount = self.additionalMetadata.auraPlatoonQueue.filter(
      (p) => p === AuraPlatoon.Shieldbearers
    ).length;
    const heal = calcEffect(0) + shieldbearersCount * calcEffect(1);
    sendToGameroom(
      `${name} absorbed what remains of ${possessive} army's lifeforce.`
    );
    flatSelfStat(heal, StatsEnum.HP);

    // remove shieldsbearers
    const lostDefense = shieldbearersCount * 2;
    flatSelfStat(lostDefense, StatsEnum.DEF, -1);
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Shieldbearers
      );
  },
});

const heartpiercer = new Card({
  title: "Heartpiercer",
  cardMetadata: { nature: Nature.Attack, armyStrength: -20 },
  description: ([dmg, archersDmg]) =>
    `Army Strength -20. DMG ${dmg} + ${archersDmg}x #Archers with 50% Pierce. Remove all Archers afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_heartpiercer_gif,
  },
  effects: [7, 2],
  hpCost: 8,
  cardAction: function (
    this: Card,
    { self, calcEffect, name, sendToGameroom, flatAttack, flatSelfStat }
  ) {
    const archersCount = self.additionalMetadata.auraPlatoonQueue.filter(
      (p) => p === AuraPlatoon.Archers
    ).length;
    const damage = calcEffect(0) + archersCount * calcEffect(1);
    sendToGameroom(`${name} aims for the heart.`);
    flatAttack(damage, 0.5);

    // remove archers
    const lostSpeed = archersCount * 2;
    flatSelfStat(lostSpeed, StatsEnum.SPD, -1);
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Archers
      );
  },
});

export const auserlese = new Card({
  title: "Scales of Obedience - Auserlese",
  cardMetadata: { nature: Nature.Util, signature: true, hideEmpower: true },
  description: () =>
    `Roll a D100. If the result of the roll > Opp's HP - Your HP, HP-10, use your opponent's move as if it's your own. At this turn's end, if Your HP - Opp's HP >= 50, you win, and if Opp's HP - Your HP >= 50, you lose.`,
  priority: 13,
  emoji: CardEmoji.AURA_CARD,
  cosmetic: {
    cardGif: mediaLinks.aura_auserlese_gif,
  },
  effects: [],
  cardAction: function (
    this: Card,
    {
      self,
      name,
      sendToGameroom,
      opponent,
      game,
      opponentStats,
      selfStats,
      opponentIndex,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} tried to manipulate the opponent's aims.`);

    const roll = Rolls.rollD100();
    const hpDiff = opponentStats.HP - selfStats.HP;
    sendToGameroom(`## **HP diff**: ${hpDiff}`);
    sendToGameroom(`# Roll: ${roll}`);

    if (roll > hpDiff) {
      if (!game.gameSettings.liteMode) {
        sendToGameroom(`[⠀](${mediaLinks.aura_auserleseContextShifted_gif})`);
      }
      sendToGameroom(`${name} forced a misdirection!`);
      game.additionalMetadata.auserleseContextReversal[opponentIndex] = true;
      flatSelfStat(10, StatsEnum.HP, -1);
    } else {
      sendToGameroom(`The incantation was not strong enough.`);
    }

    self.timedEffects.push(
      new TimedEffect({
        name: "Scales of Obedience - Auserlese",
        description: `If Your HP - Opp's HP >= 50, you win, and if Opp's HP - Your HP >= 50, you lose.`,
        priority: -13,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, characterIndex, _messageCache) => {
          // clean up
          game.additionalMetadata.auserleseContextReversal[opponentIndex] =
            false;

          // end of turn
          sendToGameroom(`The scale measures the oppositions' mana...`);
          const hpDiffAfter = opponentStats.HP - selfStats.HP;
          sendToGameroom(`## **HP diff**: ${hpDiffAfter}`);

          if (hpDiffAfter <= -50) {
            if (!game.gameSettings.liteMode) {
              sendToGameroom(`[⠀](${mediaLinks.aura_auserleseSucceeded_gif})`);
            }
            sendToGameroom(`${opponent.name} fell into ${name}'s control!`);
            game.additionalMetadata.forfeited[opponentIndex] = true;
          } else if (hpDiffAfter >= 50) {
            if (!game.gameSettings.liteMode) {
              sendToGameroom(`[⠀](${mediaLinks.aura_auserleseFailed_gif})`);
            }
            sendToGameroom(`${name} is shaken with fear...`);
            game.additionalMetadata.forfeited[characterIndex] = true;
          } else {
            sendToGameroom(
              "The scale doesn't tip in any meaningful direction..."
            );
          }
        },
      })
    );
  },
});

const auraDeck = [
  { card: rusted_blades, count: 2 },
  { card: weathered_shields, count: 2 },
  { card: broken_arrows, count: 2 },
  { card: fallen_empire, count: 1 },
  { card: retreat, count: 2 },
  { card: rot, count: 2 },
  { card: immortalWall, count: 1 },
  { card: guillotine, count: 1 },
  { card: stolen_valor, count: 1 },
  { card: heartpiercer, count: 1 },
  { card: auserlese, count: 1 },
];

export default auraDeck;
