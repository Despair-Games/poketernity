import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { SturdyAbAttr } from "#abilities/sturdy-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import Overrides from "#app/overrides";
import { BattlerTag } from "#battler-tags/battler-tag";
import { allMoves } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import type { MovePhase } from "#phases/move-phase";
import { isNil, NumberHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Confusion_(status_condition) Confusion} status condition
 */
export class ConfusedTag extends BattlerTag {
  /** Chance of self-inflicted damage `= 33%` */
  public readonly ACTIVATION_CHANCE: number = 33;

  constructor(turnCount: number, sourceMoveId: MoveId) {
    super(BattlerTagType.CONFUSED, BattlerTagLapseType.MOVE, turnCount, sourceMoveId, undefined, true);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !globalScene.arena.hasTerrain(TerrainType.MISTY) || !pokemon.isGrounded();
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);

    globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.CONFUSION, pokemon.getBattlerIndex()));
    globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:confusedOnAdd", { pokemonNameWithAffix }));
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);

    globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:confusedOnRemove", { pokemonNameWithAffix }));
  }

  override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);

    globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:confusedOnOverlap", { pokemonNameWithAffix }));
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret =
      (lapseType !== BattlerTagLapseType.CUSTOM && super.lapse(pokemon, lapseType))
      || !isNil(Overrides.STATUS_ACTIVATION_OVERRIDE);

    if (ret) {
      const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);

      globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:confusedLapse", { pokemonNameWithAffix }));
      globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.CONFUSION, pokemon.getBattlerIndex()));

      const damageHolder = new NumberHolder(this.getDamage(pokemon));

      if (damageHolder.value > 0) {
        globalScene.phaseManager.queueMessagePhase(i18next.t("battlerTags:confusedLapseHurtItself"));

        if (pokemon.isFullHp()) {
          applyAbAttrs<SturdyAbAttr>(
            AbAttrFlag.STURDY,
            pokemon,
            false,
            pokemon,
            allMoves.get(this.sourceMoveId ?? MoveId.NONE),
            damageHolder,
          );
        }

        pokemon.damageAndUpdate(damageHolder.value);
        pokemon.waveData.hitCount++;
        globalScene.phaseManager.getCurrentPhase<MovePhase>()?.cancel();
      }
    }

    return ret;
  }

  /**
   * Helper function for checking if Confusion activates and retrieving self-inflicted damage from confusion
   * @param pokemon - the confused Pokemon
   * @returns the amount of damage inflicted
   */
  public getDamage(pokemon: Pokemon): number {
    // 33% chance of hitting self with a 40 base power move
    if (
      (pokemon.randSeedInt(100) < this.ACTIVATION_CHANCE && Overrides.STATUS_ACTIVATION_OVERRIDE !== false)
      || Overrides.STATUS_ACTIVATION_OVERRIDE === true
    ) {
      const atk = pokemon.getEffectiveStat(Stat.ATK, undefined, undefined, AbilityApplyMode.IGNORE);
      const def = pokemon.getEffectiveStat(Stat.DEF, undefined, undefined, AbilityApplyMode.IGNORE);

      return toDmgValue(
        ((((2 * pokemon.level) / 5 + 2) * 40 * atk) / def / 50 + 2) * (pokemon.randSeedIntRange(85, 100) / 100),
      );
    }

    return 0;
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:confusedDesc");
  }
}
