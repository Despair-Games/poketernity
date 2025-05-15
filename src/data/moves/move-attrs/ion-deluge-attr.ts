import { ELECTRIC_IMMUNE_ABILITIES } from "#constants/ability-constants";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";

/**
 * Attribute to apply the effect of {@link https://bulbapedia.bulbagarden.net/wiki/Ion_Deluge_(move) | Ion Deluge}.
 * Converts all {@linkcode ElementalType.NORMAL | NORMAL}-type moves to
 * {@linkcode ElementalType.ELECTRIC | ELECTRIC}-type for the rest of the turn.
 * @extends AddArenaTagAttr
 */
export class IonDelugeAttr extends AddArenaTagAttr {
  constructor(failOnOverlap: boolean = true) {
    super(ArenaTagType.ION_DELUGE, ArenaTagRelativeSide.ALL, { turnCount: 1, failOnOverlap });
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
