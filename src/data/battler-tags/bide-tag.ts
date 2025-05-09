import { globalScene } from "#app/global-scene";
import { MoveLockTag } from "#battler-tags/move-lock-tag";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import { getMoveTargets, type Move } from "#moves/move";

/**
 * Causes the user of Bide to "store energy" for 2 turns, then attack the last Pokemon that attacked it.
 * The damage dealt is equal to double the attack damage taken during the storing turns.
 * @extends MoveLockTag
 */
export class BideTag extends MoveLockTag {
  private lastAttackerId?: number;
  private damageReceived: number = 0;

  constructor() {
    super(BattlerTagType.BIDE, 3, MoveId.BIDE);
  }

  /**
   * @returns The damage dealt when Bide is used under this tag.
   * This is equal to double the attack damage received during the storing turns.
   */
  public get attackDamage(): number {
    return this.damageReceived * 2;
  }

  /**
   * Updates Bide's future target and records damage after receiving an attack.
   * @param attacker - The {@linkcode Pokemon} that attacked the tag owner
   * @param damage - The damage dealt to the tag owner
   */
  public updateAttackData(attacker: Pokemon, damage: number): void {
    this.lastAttackerId = attacker.id;
    this.damageReceived += damage;
  }

  /**
   * On the last turn of execution, Bide attacks the last Pokemon that attacked the user,
   * or a random near enemy if no such Pokemon exists.
   * @param pokemon - The {@linkcode Pokemon} with this tag
   * @param move - The {@linkcode Move} to be used (in this case, Bide)
   * @returns An array containing the target's {@linkcode BattlerIndex}. While the user
   * is storing energy, this returns the user's index.
   */
  protected override getNextTargets(pokemon: Pokemon, move: Move): BattlerIndex[] {
    if (this.turnCount > 1) {
      return [pokemon.getBattlerIndex()];
    }

    if (this.lastAttackerId !== undefined) {
      const lastAttacker = globalScene.getPokemonById(this.lastAttackerId);

      if (lastAttacker?.isActive(true)) {
        return [lastAttacker.getBattlerIndex()];
      }
    }
    return getMoveTargets(pokemon, move.id, MoveTarget.RANDOM_NEAR_ENEMY).targets;
  }
}
