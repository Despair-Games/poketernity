import { type Pokemon, HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class HpSplitAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const hpValue = Math.floor((target.hp + user.hp) / 2);
    [user, target].forEach((p) => {
      if (p.hp < hpValue) {
        const healing = p.heal(hpValue - p.hp);
        if (healing) {
          globalScene.damageNumberHandler.add(p, healing, HitResult.HEAL);
        }
      } else if (p.hp > hpValue) {
        const damage = p.damage(p.hp - hpValue, true);
        if (damage) {
          globalScene.damageNumberHandler.add(p, damage);
        }
      }
      p.updateInfo();
    });

    return true;
  }
}
