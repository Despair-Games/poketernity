import type { LegacyAnimConfig } from "#animations/anim-config";
import type { ChargeAnim } from "#enums/charge-anim";

export const chargeAnims = new Map<ChargeAnim, LegacyAnimConfig | [LegacyAnimConfig, LegacyAnimConfig] | null>();
