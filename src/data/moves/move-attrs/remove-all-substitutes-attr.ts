import { globalScene } from "#app/global-scene";
import { MAJOR_EFFECT_SCORE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to remove all Substitutes from the field.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Tidy_Up_(move) | Tidy Up}
 * @see {@linkcode SubstituteTag}
 */
export class RemoveAllSubstitutesAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  public override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    globalScene
      .getField(true)
      .forEach((pokemon) => pokemon.findAndRemoveTags((tag) => tag.tagType === BattlerTagType.SUBSTITUTE));
    return true;
  }

  /**
   * @returns A score based on the Pokemon on the field with an active Substitute:
   * - Each opponent to the user that has a Substitute yields a {@linkcode MINOR_EFFECT_SCORE_BONUS}.
   * - Each ally to the user (including the user itself) that has a Substitute yields a {@linkcode MAJOR_EFFECT_SCORE_PENALTY}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const pokemonWithSubstitute = globalScene.getField(true).filter((p) => p.hasTag(BattlerTagType.SUBSTITUTE));

    return pokemonWithSubstitute.reduce(
      (score, pokemon) => score + (pokemon.isOpponent(user) ? MINOR_EFFECT_SCORE_BONUS : MAJOR_EFFECT_SCORE_PENALTY),
      0,
    );
  }
}
