import { globalScene } from "#app/global-scene";
import { MoveChargeAnim } from "#app/data/battle-anims";
import { applyMoveChargeAttrs } from "#app/data/move";
import { InstantChargeAttr } from "#app/data/move-attrs/instant-charge-attr";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { MoveResult } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { MovePhase } from "#app/phases/move-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { HitCheckPhase } from "./hit-check-phase";
import { HitCheckResult } from "#enums/hit-check-result";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";

/**
 * Phase for the "charging turn" of two-turn moves (e.g. Dig).
 * @extends {@linkcode PokemonPhase}
 */
export class MoveChargePhase extends HitCheckPhase {
  public override start() {
    super.start();

    const user = this.getUserPokemon();
    const target = this.getFirstTarget();
    const move = this.move.getMove();

    // If the target is somehow not defined, or the move is somehow not a ChargingMove,
    // immediately end this phase.
    if (!user || !target || !move.isChargingMove()) {
      console.warn("Invalid parameters for MoveChargePhase");
      return super.end();
    }

    const targetHitCheck = move.hitCheckOnCharge ? this.hitCheck(target)[0] : HitCheckResult.HIT;

    if (![HitCheckResult.HIT, HitCheckResult.MISS].includes(targetHitCheck)) {
      switch (targetHitCheck) {
        case HitCheckResult.NO_EFFECT:
          globalScene.queueMessage(
            i18next.t("battle:hitResultNoEffect", { pokemonName: getPokemonNameWithAffix(target) }),
          );
          break;
        case HitCheckResult.PENDING:
        case HitCheckResult.ERROR:
          console.warn(`Unexpected hit check result ${HitCheckResult[targetHitCheck]}. Aborting phase.`);
          return this.end();
      }

      return super.end();
    }

    new MoveChargeAnim(move.chargeAnim, move.id, user).play(false, () => {
      move.showChargeText(user, target);

      applyMoveChargeAttrs(MoveEffectAttr, user, target, move);
      user.addTag(BattlerTagType.CHARGING, 1, move.id, user.id);
      this.end();
    });
  }

  /** Checks the move's instant charge conditions, then ends this phase. */
  public override end() {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    if (user && move.isChargingMove()) {
      const instantCharge = new BooleanHolder(false);

      applyMoveChargeAttrs(InstantChargeAttr, user, null, move, instantCharge);

      if (instantCharge.value) {
        // this MoveEndPhase will be duplicated by the queued MovePhase if not removed
        globalScene.tryRemovePhase((phase) => phase instanceof MoveEndPhase && phase.getPokemon() === user);
        // queue a new MovePhase for this move's attack phase
        globalScene.unshiftPhase(new MovePhase(user, this.targets, this.move, false));
      } else {
        user.getMoveQueue().push({ move: move.id, targets: this.targets });
      }

      // Add this move's charging phase to the user's move history
      user.pushMoveHistory({ move: this.move.moveId, targets: this.targets, result: MoveResult.OTHER });
    }
    super.end();
  }
}
