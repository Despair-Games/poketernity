import type { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Cures the user's party of non-volatile status conditions, ie. Heal Bell, Aromatherapy
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */

export class PartyStatusCureAttr extends MoveEffectAttr {
  /** Message to display after using move */
  private message: string | null;
  /** Skips mons with this ability, ie. Soundproof */
  private abilityCondition: Abilities;

  constructor(message: string | null, abilityCondition: Abilities) {
    super();

    this.message = message;
    this.abilityCondition = abilityCondition;
  }

  //The same as MoveEffectAttr.canApply, except it doesn't check for the target's HP.
  override canApply(user: Pokemon, target: Pokemon, move: Move) {
    const isTargetValid =
      (this.selfTarget && user.hp && !user.getTag(BattlerTagType.FRENZY))
      || (!this.selfTarget && (!target.getTag(BattlerTagType.PROTECTED) || move.hasFlag(MoveFlags.IGNORE_PROTECT)));
    return !!isTargetValid;
  }

  /** Cures the status of all Pokemon in the user's party */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!this.canApply(user, target, move)) {
      return false;
    }
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
      pokemon.resetStatus(false);
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
