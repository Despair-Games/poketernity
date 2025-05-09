import { ELECTRIC_IMMUNE_ABILITIES } from "#app/constants/ability-constants";
import { MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";

export class IonDelugeAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.ION_DELUGE, ArenaTagRelativeSide.ALL, { turnCount: 1 });
  }

  /**
   * Grants (+1) if the user or its ally has an Electric-type immunity, either
   * from its typing or from its {@link ELECTRIC_IMMUNE_ABILITIES | Ability}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const allyHasElectricImmunity = user
      .getField()
      .some(
        (p) =>
          p.getAttackTypeEffectiveness(ElementalType.ELECTRIC) === 0
          || ELECTRIC_IMMUNE_ABILITIES.some((ab) => p.hasAbility(ab)),
      );

    return allyHasElectricImmunity ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
