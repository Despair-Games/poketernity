import type { AnimConfig } from "#app/data/animations/anim-config";
import type { ChargeAnim } from "#enums/charge-anim";

export const chargeAnims = new Map<ChargeAnim, AnimConfig | [AnimConfig, AnimConfig] | null>();
