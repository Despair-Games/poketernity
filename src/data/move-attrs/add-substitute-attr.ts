import { BattlerTagType } from "#enums/battler-tag-type";
import { type Pokemon, HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { SubstituteTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

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

  /**
   * Removes 1/4 of the user's maximum HP (rounded down) to create a substitute for the user
   * @param user the {@linkcode Pokemon} that used the move.
   * @param target n/a
   * @param move the {@linkcode Move} with this attribute.
   * @param args n/a
   * @returns true if the attribute successfully applies, false otherwise
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    user.damageAndUpdate(Math.floor(user.getMaxHp() * this.hpCost), HitResult.OTHER, false, true, true);
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
      !user.getTag(SubstituteTag) && user.hp > Math.floor(user.getMaxHp() * this.hpCost) && user.getMaxHp() > 1;
  }

  override getFailedText(user: Pokemon, _target: Pokemon, _move: Move, _cancelled: BooleanHolder): string | null {
    if (user.getTag(SubstituteTag)) {
      return i18next.t("moveTriggers:substituteOnOverlap", { pokemonName: getPokemonNameWithAffix(user) });
    } else if (user.hp <= Math.floor(user.getMaxHp() / 4) || user.getMaxHp() === 1) {
      return i18next.t("moveTriggers:substituteNotEnoughHp");
    } else {
      return i18next.t("battle:attackFailed");
    }
  }
}
