import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { type MovePhase } from "#app/phases/move-phase";
import { PhaseId } from "#enums/phase-id";

export const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  globalScene.hasPhase((phase) => phase.is<MovePhase>(PhaseId.MOVE));
