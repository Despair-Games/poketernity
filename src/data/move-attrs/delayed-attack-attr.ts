import { ArenaTagType } from "#enums/arena-tag-type";
import { type Pokemon, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveAnimPhase } from "#app/phases/move-anim-phase";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { type ChargeAnim, MoveChargeAnim } from "#app/data/battle-anims";
import type { Move } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import type { DelayedAttackTag } from "#app/data/arena-tag";
import type { MoveConditionFunc } from "#app/data/move-conditions";

/**
 * Attack Move that doesn't hit the turn it is played and doesn't allow for multiple
 * uses on the same target. Examples are Future Sight or Doom Desire.
 * @extends OverrideMoveEffectAttr
 * @param tagType The {@linkcode ArenaTagType} that will be placed on the field when the move is used
 * @param chargeAnim The {@linkcode ChargeAnim | Charging Animation} used for the move
 * @param chargeText The text to display when the move is used
 */
export class DelayedAttackAttr extends OverrideMoveEffectAttr {
  public chargeAnim: ChargeAnim;
  private chargeText: string;

  constructor(chargeAnim: ChargeAnim, chargeText: string) {
    super();

    this.chargeAnim = chargeAnim;
    this.chargeText = chargeText;
  }

  /**
   * Queues a delayed attack against the given target, adding an arena tag
   * for the effect if it doesn't already exist.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move.
   * @param move the {@linkcode Move} being used.
   * @param args additional arguments for this function:
   * - `[0]` a {@linkcode BooleanHolder} that becomes `true` if other move effects in the turn are overridden.
   * - `[1]` `true` if the move is used virtually (i.e. for the move's "attack phase"); `false` otherwise.
   * @see {@linkcode DelayedAttackTag}
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    // Edge case for the move applied on a pokemon that has fainted
    if (!target) {
      return true;
    }

    const overridden: BooleanHolder = args[0];
    const virtual: boolean = args[1];

    if (!virtual) {
      overridden.value = true;
      globalScene.unshiftPhase(new MoveAnimPhase(new MoveChargeAnim(this.chargeAnim, move.id, user)));
      globalScene.queueMessage(
        this.chargeText
          .replace("{TARGET}", getPokemonNameWithAffix(target))
          .replace("{USER}", getPokemonNameWithAffix(user)),
      );
      user.pushMoveHistory({ move: move.id, targets: [target.getBattlerIndex()], result: MoveResult.OTHER });
      // Add a Delayed Attack tag to the arena if it doesn't already exist
      globalScene.arena.addTag(ArenaTagType.DELAYED_ATTACK, user.id);
      // Queue an attack on the added (or existing) tag
      const tag = globalScene.arena.getTag(ArenaTagType.DELAYED_ATTACK) as DelayedAttackTag;
      if (tag) {
        tag.addAttack(user, move.id, target.getBattlerIndex());
      }
      return true;
    } else {
      globalScene.queueMessage(
        i18next.t("moveTriggers:tookMoveAttack", {
          pokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(target.id) ?? undefined),
          moveName: move.name,
        }),
      );
    }
    return true;
  }

  /** Delayed attacks fail if another delayed attack is already queued against the target */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const delayedAttackTag = globalScene.arena.getTag(ArenaTagType.DELAYED_ATTACK) as DelayedAttackTag;
      return !delayedAttackTag?.delayedAttacks.some((attack) => attack.targetIndex === target.getBattlerIndex());
    };
  }
}
