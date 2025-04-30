import Game from "../game";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";

export default class CommonCardAction {
  // common attack function that returns the attack's damage
  static commonAttack(
    game: Game,
    characterIndex: number,
    option: {
      damage: number;
      hpCost: number;
      isTimedEffectAttack?: boolean;
      pierceFactor?: number;
    }
  ): number {
    const isTimedEffectAttack = option.isTimedEffectAttack ?? false;
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    if (
      option.hpCost === 0 ||
      character.adjustStat(-option.hpCost, StatsEnum.HP)
    ) {
      const actualDamage = game.attack({
        attackerIndex: characterIndex,
        damage:
          option.damage + (option.pierceFactor ?? 0) * opponent.stats.stats.DEF,
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
    tag: string,
    newTimedEffect: TimedEffect
  ) {
    const character = game.getCharacter(characterIndex);
    const timedEffectIndex = character.timedEffects.findIndex(
      (timedEffect) => tag in timedEffect.tags
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
