import type { LegacyAnimConfig } from "#app/data/animations/anim-config";
import type { ChargeAnim } from "#enums/charge-anim";

export const chargeAnims = new Map<ChargeAnim, LegacyAnimConfig | [AnimConfig, LegacyAnimConfig] | null>();
