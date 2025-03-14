import type { AnimConfig } from "#app/data/animations/anim-config";
import type { MoveId } from "#enums/move-id";

export const moveAnims = new Map<MoveId, AnimConfig | [AnimConfig, AnimConfig] | null>();
