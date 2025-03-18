import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Telekinesis raises the target into the air for three turns and causes all moves used against the target (aside from OHKO moves) to hit the target unless the target is in a semi-invulnerable state from Fly/Dig.
 * The first effect is provided by {@linkcode FloatingTag}, the accuracy-bypass effect is provided by TelekinesisTag
 * The effects of Telekinesis can be baton passed to a teammate. Unlike the mainline games, Telekinesis can be baton-passed to Mega Gengar.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Telekinesis_(move) | Telekinesis}
 * @extends BattlerTag
 */
export class TelekinesisTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(
      BattlerTagType.TELEKINESIS,
      [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.AFTER_MOVE],
      3,
      sourceMoveId,
      undefined,
      true,
    );
  }

  override onAdd(pokemon: Pokemon) {
    globalScene.queueMessage(
      i18next.t("battlerTags:telekinesisOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
