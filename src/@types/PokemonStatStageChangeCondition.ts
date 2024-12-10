import type Pokemon from "#app/field/pokemon";
import type { BattleStat } from "#enums/stat";

export type PokemonStatStageChangeCondition = (target: Pokemon, statsChanged: BattleStat[], stages: number) => boolean;
