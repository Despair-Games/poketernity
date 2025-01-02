import type { ArenaTagType } from "#enums/arena-tag-type";
import { type Pokemon, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveAnimPhase } from "#app/phases/move-anim-phase";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { type ChargeAnim, MoveChargeAnim } from "#app/data/battle-anims";
import type { Move } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

/**
 * Attack Move that doesn't hit the turn it is played and doesn't allow for multiple
 * uses on the same target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Future_Sight_(move) Future Sight}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Doom_Desire_(move) Doom Desire}.
 * @extends OverrideMoveEffectAttr
 */
export class DelayedAttackAttr extends OverrideMoveEffectAttr {
  public tagType: ArenaTagType;
  public chargeAnim: ChargeAnim;
  private chargeText: string;

  constructor(tagType: ArenaTagType, chargeAnim: ChargeAnim, chargeText: string) {
    super();

    this.tagType = tagType;
    this.chargeAnim = chargeAnim;
    this.chargeText = chargeText;
  }

  /**
   * If used virtually, this queues a message and proceeds normally.
   * Otherwise, this adds a delayed attack to the field and cancels other move effects
   * for the current attack.
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, overridden: BooleanHolder, virtual: boolean): boolean {
    // Edge case for the move applied on a pokemon that has fainted
    if (!target) {
      return true;
    }

    if (!virtual) {
      overridden.value = true;
      globalScene.unshiftPhase(new MoveAnimPhase(new MoveChargeAnim(this.chargeAnim, move.id, user)));
      globalScene.queueMessage(
        this.chargeText
          .replace("{TARGET}", getPokemonNameWithAffix(target))
          .replace("{USER}", getPokemonNameWithAffix(user)),
      );
      user.pushMoveHistory({ move: move.id, targets: [target.getBattlerIndex()], result: MoveResult.OTHER });
      const side = target.getArenaTagSide();
      globalScene.arena.addTag(this.tagType, 3, move.id, user.id, side, false, target.getBattlerIndex());
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
}
