import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BURN_SYNERGY_ABILITIES, POISON_SYNERGY_ABILITIES } from "#constants/ability-constants";
import { MAJOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { getMoveTargets, type Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { coerceArray } from "#utils/common-utils";
import { getStatusEffectHealText } from "#utils/status-effect-utils";

/**
 * Move attribute to cure a set of {@linkcode StatusEffect | status effects}
 * from the user or target, depending on if the effect is {@linkcode selfTarget | self-targeted}.
 */
export class HealStatusEffectAttr extends MoveEffectAttr {
  /** List of Status Effects to cure */
  private readonly effects: StatusEffect[];

  /**
   * @param selfTarget - Whether this move targets the user
   * @param effects - status effect or list of status effects to cure
   */
  constructor(selfTarget: boolean, effects: StatusEffect | StatusEffect[]) {
    super(selfTarget, { lastHitOnly: true });
    this.effects = coerceArray(effects);
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
   * - If the target of this effect is the user, defer scoring to {@linkcode getAllyTargetScore}
   * (*unless the user is asleep, and therefore cannot cure its own status*).
   * - Otherwise, grant a {@link MAJOR_EFFECT_SCORE_PENALTY | major penalty}
   * (*using the move would cure an opponent's status effect*)
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (this.selfTarget) {
      if (user.hasStatusEffect(StatusEffect.SLEEP, false, true)) {
        return 0;
      }
      return this.getAllyTargetScore(user, user, move);
    }

    if (!target.hasStatusEffect(this.effects, false, true)) {
      return 0;
    }

    return MAJOR_EFFECT_SCORE_PENALTY;
  }

  /**
   * @returns This attribute's Ally Target Score modifier as follows:
   * - If the target doesn't have a relevant status effect for this effect, grant (+0).
   * - If the target is burned or poisoned, and it has an ability that synergizes with that
   * status effect, grant a {@link MAJOR_EFFECT_SCORE_PENALTY | major penalty}.
   * - Otherwise, grant (+1) + 50%(+1)
   */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, _move: Move): number {
    const effect = target.getStatusEffect(true);

    if (!this.effects.includes(effect)) {
      return 0;
    }

    if (
      (effect === StatusEffect.BURN && BURN_SYNERGY_ABILITIES.some((abId) => target.hasAbility(abId)))
      || ([StatusEffect.POISON, StatusEffect.TOXIC].includes(effect)
        && POISON_SYNERGY_ABILITIES.some((abId) => target.hasAbility(abId)))
    ) {
      return MAJOR_EFFECT_SCORE_PENALTY;
    }

    return this.getRandomScore(user, 50, 2, 1);
  }
}
