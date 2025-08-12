import { MoveChargeAnim } from "#animations/move-charge-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { DelayedAttackTag } from "#arena-tags/delayed-attack-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { ChargeAnim } from "#enums/charge-anim";
import { MoveResult } from "#enums/move-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { OverrideMoveEffectAttr } from "#moves/override-move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attack Move that doesn't hit the turn it is played and doesn't allow for multiple uses on the same target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Future_Sight_(move) | Future Sight}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Doom_Desire_(move) | Doom Desire}.
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
   * If used virtually, this queues a message and proceeds normally.
   *
   * Otherwise, this adds a delayed attack to the field and cancels other move effects
   * for the current attack.
   *
   * @todo Remove the virtual check, this behavior is incorrect and doesn't match mainline
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, overridden: BooleanHolder, virtual: boolean): boolean {
    // Edge case for the move applied on a pokemon that has fainted
    if (!target) {
      return true;
    }

    if (!virtual) {
      overridden.value = true;
      globalScene.phaseManager.createAndUnshiftPhase(
        "MoveAnimPhase",
        new MoveChargeAnim(this.chargeAnim, move.id, user),
      );
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        this.chargeText
          .replace("{TARGET}", getPokemonNameWithAffix(target))
          .replace("{USER}", getPokemonNameWithAffix(user)),
      );
      user.pushMoveHistory({
        move,
        targets: [target.getBattlerIndex()],
        result: MoveResult.OTHER,
        type: user.getMoveType(move),
      });
      // Add a Delayed Attack tag to the arena if it doesn't already exist
      globalScene.arena.addTag(ArenaTagType.DELAYED_ATTACK, user.id);
      // Queue an attack on the added (or existing) tag
      const tag = globalScene.arena.findTag<DelayedAttackTag>(ArenaTagType.DELAYED_ATTACK);
      tag?.addAttack(user, move.id, target.getBattlerIndex());

      return true;
    }
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:tookMoveAttack", {
        pokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(target.id) ?? undefined),
        moveName: user.getPokemonMove(move.id)?.name ?? move.name,
      }),
    );
    return true;
  }

  /** Delayed attacks fail if another delayed attack is already queued against the target */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const delayedAttackTag = globalScene.arena.findTag<DelayedAttackTag>(ArenaTagType.DELAYED_ATTACK);
      return !delayedAttackTag?.delayedAttacks.some((attack) => attack.targetIndex === target.getBattlerIndex());
    };
  }
}
