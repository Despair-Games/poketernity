import type { PhaseMap } from "#app/phase-manager";

export type PhaseKey = keyof PhaseMap;
export type PhaseConstructorMap = {
  [P in PhaseKey]: ConstructorParameters<PhaseMap[P]>;
};
