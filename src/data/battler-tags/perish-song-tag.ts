import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Perish_Song_(move) | Perish Song}.
 * Causes the owner to faint when {@linkcode turnCount} is depleted.
 *
 * Custom implementation: Boss Pokemon are immune to this effect
 * @extends BattlerTag
 */
export class PerishSongTag extends BattlerTag {
  constructor(turnCount: number) {
    super(BattlerTagType.PERISH_SONG, BattlerTagLapseType.TURN_END, turnCount, MoveId.PERISH_SONG, undefined, true);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isBossImmune();
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:perishSongLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          turnCount: this.turnCount,
        }),
      );
    } else {
      // The 2 here is just a number big enough to overcome the G-Max damage reduction
      pokemon.damageAndUpdate(pokemon.hp, {
        result: HitResult.ONE_HIT_KO,
        ignoreSegments: true,
        preventEndure: true,
      });
    }

    return ret;
  }
}
