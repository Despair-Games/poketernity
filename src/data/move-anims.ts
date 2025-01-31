import type { AnimConfig } from "#app/data/anim-config";
import type { Moves } from "#enums/moves";

export const moveAnims = new Map<Moves, AnimConfig | [AnimConfig, AnimConfig] | null>();
