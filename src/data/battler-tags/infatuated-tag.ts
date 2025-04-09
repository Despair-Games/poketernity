import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import type { MovePhase } from "#app/phases/move-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import i18next from "i18next";
import Overrides from "#app/overrides";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Infatuation | Infatuation} status effect
 * @extends BattlerTag
 */
export class InfatuatedTag extends BattlerTag {
  public readonly ACTIVATION_CHANCE: number = 100 * (1 / 2);

  constructor(sourceMoveId: number, sourceId: number) {
    super(BattlerTagType.INFATUATED, BattlerTagLapseType.MOVE, 1, sourceMoveId, sourceId);
  }

  override canAdd(pokemon: Pokemon): boolean {
    if (this.sourceId) {
      const pkm = globalScene.getPokemonById(this.sourceId);

      if (pkm) {
        return pokemon.isOppositeGender(pkm);
      } else {
        console.warn("canAdd: this.sourceId is not a valid pokemon id!", this.sourceId);
        return false;
      }
    } else {
      console.warn("canAdd: this.sourceId is undefined");
      return false;
    }
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:infatuatedOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        sourcePokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
      }),
    );
  }

  override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:infatuatedOnOverlap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:infatuatedLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          sourcePokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
        }),
      );
      globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.ATTRACT, pokemon.getBattlerIndex()));

      if (
        (pokemon.randSeedInt(100) < this.ACTIVATION_CHANCE && Overrides.STATUS_ACTIVATION_OVERRIDE !== false)
        || Overrides.STATUS_ACTIVATION_OVERRIDE === true
      ) {
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("battlerTags:infatuatedLapseImmobilize", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          }),
        );
        (globalScene.phaseManager.getCurrentPhase() as MovePhase).cancel();
      }
    }

    return ret;
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:infatuatedOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override isSourceLinked(): boolean {
    return true;
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:infatuatedDesc");
  }
}
