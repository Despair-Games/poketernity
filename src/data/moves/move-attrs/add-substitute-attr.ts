import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import i18next from "i18next";

/**
 * Attribute to put in a {@link https://bulbapedia.bulbagarden.net/wiki/Substitute_(doll) | Substitute Doll}
 * for the user.
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class AddSubstituteAttr extends MoveEffectAttr {
  /** The ratio of the user's max HP that is required to apply this effect */
  private hpCost: number;

  constructor(hpCost: number = 0.25) {
    super(true);

    this.hpCost = hpCost;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    user.damageAndUpdate(Math.floor(user.getMaxHp() * this.hpCost), {
      result: HitResult.OTHER,
      ignoreSegments: true,
      preventEndure: true,
      ignoreDynamaxReduction: true,
    });
    user.addTag(BattlerTagType.SUBSTITUTE, 0, move.id, user.id);
    return true;
  }

  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    if (user.isBoss()) {
      return -10;
    }
    return 5;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      !user.getTag(BattlerTagType.SUBSTITUTE)
      && user.hp > Math.floor(user.getMaxHp() * this.hpCost)
      && user.getMaxHp() > 1;
  }

  override getFailedText(user: Pokemon, _target: Pokemon, _move: Move, _cancelled: BooleanHolder): string | null {
    if (user.getTag(BattlerTagType.SUBSTITUTE)) {
      return i18next.t("moveTriggers:substituteOnOverlap", { pokemonName: getPokemonNameWithAffix(user) });
    } else if (user.hp <= Math.floor(user.getMaxHp() / 4) || user.getMaxHp() === 1) {
      return i18next.t("moveTriggers:substituteNotEnoughHp");
    } else {
      return i18next.t("battle:attackFailed");
    }
  }
}
