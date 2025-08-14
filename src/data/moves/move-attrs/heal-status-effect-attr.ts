import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  MAJOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_PENALTY,
} from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveId } from "#enums/move-id";
import type { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { getMoveTargets, type Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { getStatusEffectHealText } from "#utils/status-effect-utils";

/**
 * Move attribute to cure a set of {@linkcode StatusEffect | status effects}
 * from the user or target, depending on if the effect is {@linkcode selfTarget | self-targeted}.
 */
export class HealStatusEffectAttr extends MoveEffectAttr {
  /** List of Status Effects to cure */
  private effects: StatusEffect[];

  /**
   * @param selfTarget - Whether this move targets the user
   * @param effects - status effect or list of status effects to cure
   */
  constructor(selfTarget: boolean, effects: StatusEffect | StatusEffect[]) {
    super(selfTarget, {
      lastHitOnly: true,
      overridesAllyTargetPenalty: true,
    });
    this.effects = [effects].flat(1);
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    // Special edge case for shield dust blocking Sparkling Aria curing burn
    const moveTargets = getMoveTargets(user, move.id);
    if (
      target.hasAbilityWithAttr(AbAttrFlag.IGNORE_MOVE_EFFECTS)
      && move.id === MoveId.SPARKLING_ARIA
      && moveTargets.targets.length === 1
    ) {
      return false;
    }

    const pokemon = this.selfTarget ? user : target;
    if (pokemon.hasStatusEffect(this.effects, false, true)) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        getStatusEffectHealText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
      );
      pokemon.resetStatus();
      pokemon.updateInfo();

      return true;
    }

    return false;
  }

  public isOfEffect(effect: StatusEffect): boolean {
    return this.effects.includes(effect);
  }

  /**
   * @returns This attribute's Effect Score modifier as follows:
   * - If the affected Pokemon doesn't have a relevant status effect, grant (+0).
   * - Otherwise, if the affected Pokemon is either the user or its ally, grant (+1) + 50%(+1)
   * - Otherwise, grant (-1) [using the move would cure an opponent's status effect]
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const pokemon = this.selfTarget ? user : target;

    if (!pokemon.hasStatusEffect(this.effects)) {
      return 0;
    }

    if (!pokemon.isOpponent(user)) {
      return this.getRandomScore(user, 50, MAJOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_BONUS);
    }
    return MINOR_EFFECT_SCORE_PENALTY;
  }
}
