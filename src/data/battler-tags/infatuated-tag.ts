import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import type { Pokemon } from "#field/pokemon";
import type { MovePhase } from "#phases/move-phase";
import i18next from "i18next";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Infatuation | Infatuation} status effect
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
      }
      console.warn("canAdd: this.sourceId is not a valid pokemon id!", this.sourceId);
      return false;
    }
    console.warn("canAdd: this.sourceId is undefined");
    return false;
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:infatuatedOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        sourcePokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
      }),
    );
  }

  override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:infatuatedOnOverlap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("battlerTags:infatuatedLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          sourcePokemonName: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
        }),
      );
      globalScene.phaseManager.createAndUnshiftPhase("CommonAnimPhase", CommonAnim.ATTRACT, pokemon.getBattlerIndex());

      if (
        (pokemon.randSeedInt(100) < this.ACTIVATION_CHANCE && activeOverrides.STATUS_ACTIVATION_OVERRIDE !== false)
        || activeOverrides.STATUS_ACTIVATION_OVERRIDE === true
      ) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
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

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
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
