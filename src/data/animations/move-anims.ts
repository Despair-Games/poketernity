import type { LegacyAnimConfig } from "#animations/anim-config";
import type { MoveId } from "#enums/move-id";

export const moveAnims = new Map<MoveId, LegacyAnimConfig | [LegacyAnimConfig, LegacyAnimConfig] | null>();
