import { MoveChargeAnim } from "#app/data/battle-anims/move-charge-anim";
import { applyMoveChargeAttrs } from "#app/utils/move-utils";
import { InstantChargeAttr } from "#app/data/move-attrs/instant-charge-attr";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { MoveResult } from "#enums/move-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitCheckResult } from "#enums/hit-check-result";
import i18next from "i18next";
import { HitCheckPhase } from "./hit-check-phase";
import { MoveEndPhase } from "./move-end-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Phase for the "charging turn" of two-turn moves (e.g. Dig).
 * @extends {@linkcode PokemonPhase}
 */
export class MoveChargePhase extends HitCheckPhase {
  override readonly id = PhaseId.MOVE_CHARGE;

  public override start() {
    super.start();

    const user = this.getUserPokemon();
    const target = this.getFirstTarget();
    const move = this.move.getMove();

    // If the target is somehow not defined, or the move is somehow not a ChargingMove,
    // immediately end this phase.
    if (!user || !target || !move.isChargingMove()) {
      console.warn("Invalid parameters for MoveChargePhase");
      return this.end();
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

    new MoveChargeAnim(move.chargeAnim, move.id, user, target.getBattlerIndex()).play(false, () => {
      move.showChargeText(user, target);

      applyMoveChargeAttrs(MoveEffectAttr, user, target, move);
      user.addTag(BattlerTagType.CHARGING, 1, move.id, user.id);
      this.checkInstantCharge();
    });
  }

  /** Checks the move's instant charge conditions, then ends this phase. */
  protected checkInstantCharge(): void {
    const user = this.getUserPokemon();
    const move = this.move.getMove();

    if (user && move.isChargingMove()) {
      const instantCharge = new BooleanHolder(false);

      applyMoveChargeAttrs(InstantChargeAttr, user, null, move, instantCharge);

      if (instantCharge.value) {
        // this MoveEndPhase will be duplicated by the queued MovePhase if not removed
        globalScene.tryRemovePhase((phase) => phase instanceof MoveEndPhase && phase.getPokemon() === user);
        // queue a new MovePhase for this move's attack phase
        globalScene.useMove({ pokemon: user, targets: this.targets, move: this.move, followUp: false, when: "eager" });
      } else {
        user.getMoveQueue().push({ moveId: move.id, targets: this.targets });
      }

      // Add this move's charging phase to the user's move history
      user.pushMoveHistory({
        move: this.move.getMove(),
        targets: this.targets,
        result: MoveResult.OTHER,
        type: user.getMoveType(move),
      });
    }
    this.end();
  }
}
