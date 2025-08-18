import { globalScene } from "#app/global-scene";
import { BAD_MOVE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
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
   * @todo This doesn't actually apply abilities that negate the effect (i.e. Soundproof)
   */
  private cureStatus(pokemon: Pokemon, userId: number) {
    if (this.hasRemovableStatusEffect(pokemon, userId)) {
      pokemon.resetStatus();
      pokemon.updateInfo();
    } else if (pokemon.hasAbility(this.abilityCondition)) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "ShowAbilityPhase",
        pokemon.id,
        pokemon.getPassiveAbility()?.id === this.abilityCondition,
      );
    }
  }

  /**
   * Determines whether a given Pokemon has a non-volatile status effect that
   * can be cured by this attribute's effect.
   * @param pokemon - The {@linkcode Pokemon} to check
   * @param userId - The ID of the Pokemon that originally used the move with this effect
   * @returns `true` if the given {@linkcode pokemon} has a curable status effect
   */
  private hasRemovableStatusEffect(pokemon: Pokemon, userId: number): boolean {
    return (
      pokemon.hasNonVolatileStatusEffect(false, true)
      && (!pokemon.isOnField() || pokemon.id === userId || !pokemon.hasAbility(this.abilityCondition))
    );
  }

  /**
   * @returns (+1) for each party member that would have its status effect cured by this effect,
   * up to the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const party = user.getParty();
    const numPartyMembersWithRemovableStatus = party.filter((p) => this.hasRemovableStatusEffect(p, user.id)).length;

    if (numPartyMembersWithRemovableStatus === 0) {
      return BAD_MOVE_PENALTY;
    }

    return Math.min(numPartyMembersWithRemovableStatus, SOFT_EFFECT_SCORE_LIMIT);
  }
}
