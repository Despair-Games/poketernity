import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import { FormChangeItemTypeAttr } from "#moves/form-change-item-type-attr";
import { MatchUserTypeAttr } from "#moves/match-user-type-attr";
import type { Move } from "#moves/move";
import { TerrainPulseTypeAttr } from "#moves/terrain-pulse-type-attr";
import type { PokemonAttackCondition } from "#types/move-types";
import type { NumberHolder } from "#utils/common-utils";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  private readonly newType: ElementalType;
  private readonly powerMultiplier: number;
  private readonly condition: PokemonAttackCondition;

  constructor(newType: ElementalType, powerMultiplier: number, condition: PokemonAttackCondition) {
    super(true);
    this._flags.add(AbAttrFlag.MOVE_TYPE_CHANGE);

    this.newType = newType;
    this.powerMultiplier = powerMultiplier;
    this.condition = condition;
  }

  // TODO: Decouple this into two attributes (type change / power boost)
  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender?: Pokemon,
    moveType?: NumberHolder,
    power?: NumberHolder,
  ): boolean {
    // Revelation Dance, Judgement and Multi-Attack, and Terrain Pulse ignore ability-based move type changes
    if (
      move.hasAttr(MatchUserTypeAttr)
      || move.hasAttr(FormChangeItemTypeAttr)
      || move.hasAttr(TerrainPulseTypeAttr)
      || !this.condition(pokemon, defender, move)
    ) {
      return false;
    }
    if (moveType != null) {
      moveType.value = this.newType;
    }
    if (power != null) {
      power.value *= this.powerMultiplier;
    }
    return true;
  }
}
