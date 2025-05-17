import Game from "@tcg/game";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";

export default class CommonCardAction {
  // common attack function that returns the attack's damage
  static commonAttack(
    game: Game,
    characterIndex: number,
    option: {
      damage: number;
      hpCost: number;
      isTimedEffectAttack?: boolean;
      additionalPierceFactor?: number;
    }
  ): number {
    const isTimedEffectAttack = option.isTimedEffectAttack ?? false;
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor =
      (character.additionalMetadata.pierceFactor ??= 0) +
      (option.additionalPierceFactor ?? 0);
    if (
      option.hpCost === 0 ||
      character.adjustStat(-option.hpCost, StatsEnum.HP)
    ) {
      const actualDamage = game.attack({
        attackerIndex: characterIndex,
        damage: option.damage + pierceFactor * opponent.stats.stats.DEF,
        isTimedEffectAttack,
      });
      return actualDamage;
    } else {
      return 0;
    }
  }

  // function that looks up a character's timed effect and replace a timed effect with certain tag
  static replaceOrAddNewTimedEffect(
    game: Game,
    characterIndex: number,
    metadata: keyof TimedEffect["metadata"],
    newTimedEffect: TimedEffect
  ) {
    const character = game.getCharacter(characterIndex);
    const timedEffectIndex = character.timedEffects.findIndex(
      (timedEffect) => metadata in timedEffect.metadata
    );
    if (timedEffectIndex !== -1) {
      const previousTimedEffect = character.timedEffects.splice(
        timedEffectIndex,
        1,
        newTimedEffect
      );
      previousTimedEffect[0].replacedAction?.(
        game,
        characterIndex,
        game.messageCache
      );
    } else {
      character.timedEffects.push(newTimedEffect);
    }
  }
}
