import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { HitHealAttr } from "#moves/hit-heal-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Class for abilities that make drain moves deal damage to user instead of healing them.
 * @todo All this does is queue an activation message when the source is hit with a
 * drain move. This is really jank and doesn't account for Heal Block, etc.
 */
export class ReverseDrainAbAttr extends PostDefendAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.REVERSE_DRAIN);
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("abilityTriggers:reverseDrain", { pokemonNameWithAffix: getPokemonNameWithAffix(attacker) }),
      );
    }
  }

  public override canApply(...[, , , move]: Parameters<this["apply"]>): boolean {
    return move.hasAttr(HitHealAttr);
  }
}
