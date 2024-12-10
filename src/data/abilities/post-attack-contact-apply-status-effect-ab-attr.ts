import type { StatusEffect } from "#enums/status-effect";
import { PostAttackApplyStatusEffectAbAttr } from "./post-attack-apply-status-effect-ab-attr";

export class PostAttackContactApplyStatusEffectAbAttr extends PostAttackApplyStatusEffectAbAttr {
  constructor(chance: integer, ...effects: StatusEffect[]) {
    super(true, chance, ...effects);
  }
}
