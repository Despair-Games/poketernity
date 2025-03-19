import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SemiInvulnerableBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { Abilities } from "#enums/abilities";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag for effects that ground the source, allowing Ground-type moves to hit them.
 * @description `IGNORE_FLYING`: Persistent grounding effects (i.e. from Smack Down and Thousand Waves)
 * @extends BattlerTag
 */
export class GroundedTag extends BattlerTag {
  constructor(tagType: BattlerTagType, lapseType: BattlerTagLapseType, sourceMoveId: MoveId) {
    super(tagType, lapseType, 1, sourceMoveId);
  }

  /**
   * Smack Down and Thousand Arrows have special messages when knocking an ungrounded Pokemon down
   * @param pokemon the Pokemon being grounded
   */
  override onAdd(pokemon: Pokemon) {
    const isSmackDownOrThousandArrows = [MoveId.SMACK_DOWN, MoveId.THOUSAND_ARROWS].includes(this.sourceMoveId);
    const wasNotGrounded =
      pokemon.isOfType(ElementalType.FLYING, true, true)
      || pokemon.hasAbility(Abilities.LEVITATE)
      || pokemon.getTag(BattlerTagType.FLOATING)
      || pokemon.getTag(...SemiInvulnerableBattlerTagTypes);

    if (isSmackDownOrThousandArrows && wasNotGrounded) {
      globalScene.queueMessage(
        i18next.t("battlerTags:groundedSmackDown", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
  }
}
