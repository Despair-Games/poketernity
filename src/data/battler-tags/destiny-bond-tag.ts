import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitResult } from "#enums/hit-result";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag applied to the {@linkcode Move.DESTINY_BOND} user.
 * @extends BattlerTag
 */
export class DestinyBondTag extends BattlerTag {
  constructor(sourceMoveId: MoveId, sourceId: number) {
    super(BattlerTagType.DESTINY_BOND, BattlerTagLapseType.PRE_MOVE, 1, sourceMoveId, sourceId, true);
  }

  /**
   * Lapses either before the user's move and does nothing
   * or after receiving fatal damage. When the damage is fatal,
   * the attacking Pokemon is taken down as well, unless it's a boss.
   *
   * @param pokemon Pokemon that is attacking the Destiny Bond user.
   * @param lapseType CUSTOM or PRE_MOVE
   * @returns `false` if the tag source fainted or one turn has passed since the application
   */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType !== BattlerTagLapseType.CUSTOM) {
      return super.lapse(pokemon, lapseType);
    }

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;

    if (!source || !source.isFainted() || !pokemon.isOnField() || source.getAlly() === pokemon) {
      return false;
    }

    if (pokemon.isBossImmune()) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:destinyBondLapseIsBoss", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      return false;
    }

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:destinyBondLapse", {
        pokemonNameWithAffix: getPokemonNameWithAffix(source),
        pokemonNameWithAffix2: getPokemonNameWithAffix(pokemon),
      }),
    );

    pokemon.damageAndUpdate(pokemon.hp, {
      result: HitResult.ONE_HIT_KO,
      preventEndure: true,
    });

    return false;
  }
}
