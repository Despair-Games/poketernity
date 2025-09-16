import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Perish_Song_(move) | Perish Song}.
 * Causes the owner to faint when {@linkcode turnCount} is depleted.
 *
 * Custom implementation: Boss Pokemon are immune to this effect
 */
export class PerishSongTag extends BattlerTag {
  public override musPriority = 2;

  constructor(turnCount: number) {
    super(BattlerTagType.PERISH_SONG, BattlerTagLapseType.TURN_END, turnCount, MoveId.PERISH_SONG, undefined, true);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isBossImmune();
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("battlerTags:perishSongLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          turnCount: this.turnCount,
        }),
      );
    } else {
      pokemon.damageAndUpdate(pokemon.hp, {
        result: HitResult.ONE_HIT_KO,
        ignoreSegments: true,
        preventEndure: true,
      });
    }

    return ret;
  }

  /**
   * Sets MUS to -Infinity on the last turn of this effect, effectively forcing the Pokemon to switch.
   * This should precede and override all other MUS modifiers.
   */
  public override modifyMatchupScore(
    _pokemon: Pokemon,
    _opponent: Pokemon,
    matchupScore: ValueHolder<number>,
  ): boolean {
    if (this.turnCount === 1) {
      matchupScore.value = Number.NEGATIVE_INFINITY;
      return true;
    }
    return false;
  }
}
