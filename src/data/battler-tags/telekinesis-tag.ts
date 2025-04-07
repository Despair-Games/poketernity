// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FloatingTag } from "#app/data/battler-tags/floating-tag";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag that handles the accuracy bypassing effects of {@link https://bulbapedia.bulbagarden.net/wiki/Telekinesis_(move) | Telekinesis}.
 * All moves used against a Pokemon with this tag (aside from OHKO moves) will hit the unless the target is in a semi-invulnerable state from Fly/Dig.
 * The floating effect of Telekinesis is provided by {@linkcode FloatingTag}.
 * The Telekinesis tag can be baton-passed to a teammate.
 * Custom: Unlike the mainline games, it doesn't lapse when baton-passed to Mega Gengar.
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
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:telekinesisOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
