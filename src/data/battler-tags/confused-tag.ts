import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import type { MovePhase } from "#app/phases/move-phase";
import { toDmgValue, isNullOrUndefined } from "#app/utils";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import type { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import { TerrainType } from "#enums/terrain-type";
import i18next from "i18next";
import Overrides from "#app/overrides";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Confusion_(status_condition) Confusion} status condition
 * @extends BattlerTag
 */
export class ConfusedTag extends BattlerTag {
  public readonly ACTIVATION_CHANCE: number = 33;
  constructor(turnCount: number, sourceMoveId: MoveId) {
    super(BattlerTagType.CONFUSED, BattlerTagLapseType.MOVE, turnCount, sourceMoveId, undefined, true);
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !globalScene.arena.hasTerrain(TerrainType.MISTY) || !pokemon.isGrounded();
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.unshiftPhase(new CommonAnimPhase(pokemon.getBattlerIndex(), undefined, CommonAnim.CONFUSION));
    globalScene.queueMessage(
      i18next.t("battlerTags:confusedOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:confusedOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:confusedOnOverlap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret =
      (lapseType !== BattlerTagLapseType.CUSTOM && super.lapse(pokemon, lapseType))
      || !isNullOrUndefined(Overrides.STATUS_ACTIVATION_OVERRIDE);

    if (ret) {
      globalScene.queueMessage(
        i18next.t("battlerTags:confusedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      globalScene.unshiftPhase(new CommonAnimPhase(pokemon.getBattlerIndex(), undefined, CommonAnim.CONFUSION));

      const damage = this.getDamage(pokemon);
      if (damage > 0) {
        globalScene.queueMessage(i18next.t("battlerTags:confusedLapseHurtItself"));
        pokemon.damageAndUpdate(damage);
        pokemon.battleData.hitCount++;
        (globalScene.getCurrentPhase() as MovePhase).cancel();
      }
    }
    return ret;
  }

  /**
   * Helper function for checking if Confusion activates and retrieving self-inflicted damage from confusion
   * @param pokemon the confused Pokemon
   * @returns the amount of damage inflicted
   */
  public getDamage(pokemon: Pokemon): number {
    // 1/3 chance of hitting self with a 40 base power move
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
