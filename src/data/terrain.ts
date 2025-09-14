import type { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { ProtectAttr } from "#moves/protect-attr";

/** Class representing Terrain effects */
export class Terrain {
  public terrainType: TerrainType;
  public turnsLeft: number;

  /**
   * @param terrainType - The {@linkcode TerrainType} that is being represented
   * @param turnsLeft - How many turns the terrain still has left
   */
  constructor(terrainType: TerrainType, turnsLeft: number = 0) {
    this.terrainType = terrainType;
    this.turnsLeft = turnsLeft;
  }

  /**
   * Decrements {@linkcode turnsLeft} and checks if it is greater than `0`
   * @returns `true` if `turnsLeft` is greater than `0`
   */
  lapse(): boolean {
    if (this.turnsLeft) {
      return --this.turnsLeft !== 0;
    }

    return true;
  }

  /**
   * Function to return a multiplier for specific types
   * Electric, Grassy, and Psychic give their corresponding types 30% boost
   * @param attackType - the Attacking  {@linkcode ElementalType}
   * @returns a multiplier (1.3 or 1)
   */
  getAttackTypeMultiplier(attackType: ElementalType): number {
    switch (this.terrainType) {
      case TerrainType.ELECTRIC:
        if (attackType === ElementalType.ELECTRIC) {
          return 1.3;
        }
        break;
      case TerrainType.GRASSY:
        if (attackType === ElementalType.GRASS) {
          return 1.3;
        }
        break;
      case TerrainType.PSYCHIC:
        if (attackType === ElementalType.PSYCHIC) {
          return 1.3;
        }
        break;
    }

    return 1;
  }

  /**
   * Checks if the weather should cancel the move
   * Psychic terrain cancels positive priority moves that target grounded Pokemon
   * @param user - The attacker {@linkcode Pokemon}
   * @param targets - The targets' {@linkcode BattlerIndex}
   * @param move - The {@linkcode Move} being used
   * @returns true if the move is cancelled, false otherwise
   */
  isMoveTerrainCancelled(user: Pokemon, targets: BattlerIndex[], move: Move): boolean {
    switch (this.terrainType) {
      case TerrainType.PSYCHIC:
        if (!move.hasAttr(ProtectAttr)) {
          // Cancels move if the move has positive priority and targets a Pokemon grounded on the Psychic Terrain
          return (
            move.getPriority(user) > 0
            && user.getOpponents().some((o) => targets.includes(o.getBattlerIndex()) && o.isGrounded())
          );
        }
    }

    return false;
  }
}
