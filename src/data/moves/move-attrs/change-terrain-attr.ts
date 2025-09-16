import { globalScene } from "#app/global-scene";
import { SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { TerrainType } from "#enums/terrain-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to add terrain of a set type to the field.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Terrain_moves | Terrain moves}
 */
export class ChangeTerrainAttr extends MoveEffectAttr {
  private readonly terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super(true);

    this.terrainType = terrainType;
  }

  public override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetTerrain(this.terrainType, true, true);
  }

  public override getCondition(): MoveConditionFunc | null {
    return (_user, _target, _move) => !globalScene.arena.hasTerrain(this.terrainType);
  }

  /**
   * @returns An Effect Score based on how much the user's non-fainted party benefits
   * from the Terrain to set compared to the opponents' benefit.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const currentTerrain = globalScene.arena.terrain?.terrainType ?? TerrainType.NONE;

    const userBenefit = user
      .getParty()
      .filter((p) => p.isAllowedInBattle())
      .reduce(
        (score, p) => score + p.getTerrainBenefitScore(this.terrainType) - p.getTerrainBenefitScore(currentTerrain),
        0,
      );

    const oppBenefit = user
      .getOpposingParty()
      .filter((p) => p.isAllowedInBattle())
      .reduce(
        (score, p) =>
          score + p.getTerrainBenefitScore(this.terrainType, true) - p.getTerrainBenefitScore(currentTerrain, true),
        0,
      );

    const rawScore = userBenefit - oppBenefit;
    const minScore = Math.floor(rawScore);
    const tierUpChance = Math.floor((rawScore - minScore) * 100);

    return Math.min(this.getRandomScore(user, tierUpChance, minScore + 1, minScore), SOFT_EFFECT_SCORE_LIMIT);
  }
}
