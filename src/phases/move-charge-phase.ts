import { MoveChargeAnim } from "#animations/move-charge-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitCheckResult } from "#enums/hit-check-result";
import { MoveResult } from "#enums/move-result";
import { InstantChargeAttr } from "#moves/instant-charge-attr";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { HitCheckPhase } from "#phases/base/hit-check-phase";
import { BooleanHolder } from "#utils/common-utils";
import { applyMoveChargeAttrs } from "#utils/move-utils";
import i18next from "i18next";

/**
 * Phase for the "charging turn" of two-turn moves (e.g. Dig).
 */
export class MoveChargePhase extends HitCheckPhase {
  public override readonly phaseName = "MoveChargePhase";

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

    const excludedResults: HitCheckResult[] = [HitCheckResult.HIT, HitCheckResult.MISS];
    if (!excludedResults.includes(targetHitCheck)) {
      switch (targetHitCheck) {
        case HitCheckResult.NO_EFFECT:
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
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
        // queue a new MovePhase for this move's attack phase
        globalScene.phaseManager.createAndUnshiftPhase("MovePhase", user, this.targets, this.move, {
          followUp: true,
        });
      } else {
        user.getMoveQueue().push({ move, targets: this.targets, type: user.getMoveType(move) });
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
