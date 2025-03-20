import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";

/**
 * BattlerTag for the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Magic_Coat_(move) | Magic Coat}.
 * Reflects status moves back at the attacker.
 * @extends BattlerTag
 * @see {@linkcode MovePhase.tryReflectMove}
 */
export class MagicCoatTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.MAGIC_COAT, BattlerTagLapseType.TURN_END, 1);
  }

  override onAdd(pokemon: Pokemon): void {
    globalScene.queueMessage(
      i18next.t("battlerTags:magicCoatOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override apply(
    _pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    reflected: BooleanHolder,
  ): boolean {
    if (!simulated) {
      globalScene.queueMessage(this.getReflectionMessage(attacker, move));
    }
    reflected.value = true;
    return true;
  }

  private getReflectionMessage(attacker: Pokemon, move: Move) {
    // "{pokemonNameWithAffix}'s {moveName} was bounced back by Magic Coat!"
    return i18next.t("battlerTags:magicCoatOnApply", {
      pokemonNameWithAffix: getPokemonNameWithAffix(attacker),
      moveName: move.name,
    });
  }
}
