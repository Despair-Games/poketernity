import { type Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to split HP evenly between the user and target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pain_Split_(move) | Pain Split}.
 * @extends MoveEffectAttr
 */
export class HpSplitAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const hpValue = Math.floor((target.hp + user.hp) / 2);
    [user, target].forEach((p) => {
      if (p.hp < hpValue) {
        p.heal(hpValue - p.hp);
      } else if (p.hp > hpValue) {
        p.damageAndUpdate(p.hp - hpValue, { ignoreSegments: true });
      }
      p.updateInfo();
    });

    return true;
  }
}
