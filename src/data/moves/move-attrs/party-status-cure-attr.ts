import type { AbilityId } from "#enums/ability-id";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Cures the user's party of non-volatile status conditions, ie. Heal Bell, Aromatherapy
 * @extends MoveEffectAttr
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

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const partyPokemon = user.getParty();
    partyPokemon.forEach((p) => this.cureStatus(p, user.id));

    if (this.message) {
      globalScene.queueMessage(this.message);
    }

    return true;
  }

  /**
   * Tries to cure the status of the given {@linkcode Pokemon}
   * @param pokemon The {@linkcode Pokemon} to cure.
   * @param userId The ID of the (move) {@linkcode Pokemon | user}.
   */
  public cureStatus(pokemon: Pokemon, userId: number) {
    if (!pokemon.isOnField() || pokemon.id === userId) {
      // user always cures its own status, regardless of ability
      pokemon.resetStatus();
      pokemon.updateInfo();
    } else if (!pokemon.hasAbility(this.abilityCondition)) {
      pokemon.resetStatus();
      pokemon.updateInfo();
    } else {
      globalScene.unshiftPhase(
        new ShowAbilityPhase(pokemon.id, pokemon.getPassiveAbility()?.id === this.abilityCondition),
      );
    }
  }
}
