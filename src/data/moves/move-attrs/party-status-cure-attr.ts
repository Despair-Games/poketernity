import { globalScene } from "#app/global-scene";
import { SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import type { AbilityId } from "#enums/ability-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Cures the user's party of non-volatile status conditions, ie. Heal Bell, Aromatherapy
 */
export class PartyStatusCureAttr extends MoveEffectAttr {
  /** Message to display after using move */
  private message: string | null;
  /** Skips mons with this ability, ie. Soundproof */
  private abilityCondition: AbilityId;

  constructor(message: string | null, abilityCondition: AbilityId) {
    super(true);

    this.message = message;
    this.abilityCondition = abilityCondition;
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const partyPokemon = user.getParty();
    partyPokemon.forEach((p) => this.cureStatus(p, user.id));

    if (this.message) {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", this.message);
    }

    return true;
  }

  /**
   * Tries to cure the status of the given {@linkcode Pokemon}
   * @param pokemon The {@linkcode Pokemon} to cure.
   * @param userId The ID of the (move) {@linkcode Pokemon | user}.
   */
  private cureStatus(pokemon: Pokemon, userId: number) {
    if (!pokemon.isOnField() || pokemon.id === userId) {
      // user always cures its own status, regardless of ability
      pokemon.resetStatus();
      pokemon.updateInfo();
    } else if (!pokemon.hasAbility(this.abilityCondition)) {
      pokemon.resetStatus();
      pokemon.updateInfo();
    } else {
      globalScene.phaseManager.createAndUnshiftPhase(
        "ShowAbilityPhase",
        pokemon.id,
        pokemon.getPassiveAbility()?.id === this.abilityCondition,
      );
    }
  }

  /**
   * @returns (+1) for each party member that would have its status effect cured by this effect,
   * up to the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const party = user.getParty();
    const numPartyMembersWithRemovableStatus = party.filter(
      (p) => p.hasNonVolatileStatusEffect(false, true) && (p.id === user.id || !p.hasAbility(this.abilityCondition)),
    ).length;

    return Math.min(numPartyMembersWithRemovableStatus, SOFT_EFFECT_SCORE_LIMIT);
  }
}
