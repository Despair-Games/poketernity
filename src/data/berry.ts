import type { DoubleBerryEffectAbAttr } from "#app/data/abilities/ab-attrs/double-berry-effect-ab-attr";
import type { PostItemLostAbAttr } from "#app/data/abilities/ab-attrs/post-item-lost-ab-attr";
import type { ReduceBerryUseThresholdAbAttr } from "#app/data/abilities/ab-attrs/reduce-berry-use-threshold-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { getStatusEffectHealText } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { NumberHolder, randSeedInt, toDmgValue } from "#app/utils";
import { getBerryName } from "#app/utils/berry-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { HitResult } from "#enums/hit-result";
import { Stat, type BattleStat } from "#enums/stat";
import i18next from "i18next";

export type BerryPredicate = (pokemon: Pokemon) => boolean;

export function getBerryPredicate(berryType: BerryType): BerryPredicate {
  switch (berryType) {
    case BerryType.SITRUS:
      return (pokemon: Pokemon) => pokemon.getHpRatio() < 0.5;
    case BerryType.LUM:
      return (pokemon: Pokemon) => pokemon.hasNonVolatileStatusEffect(true, true);
    case BerryType.ENIGMA:
      return (pokemon: Pokemon) =>
        !!pokemon.turnData.attacksReceived.filter((a) => a.result === HitResult.SUPER_EFFECTIVE).length;
    case BerryType.LIECHI:
    case BerryType.GANLON:
    case BerryType.PETAYA:
    case BerryType.APICOT:
    case BerryType.SALAC:
      return (pokemon: Pokemon) => {
        const threshold = new NumberHolder(0.25);
        // Offset BerryType such that LIECHI -> Stat.ATK = 1, GANLON -> Stat.DEF = 2, so on and so forth
        const stat: BattleStat = berryType - BerryType.ENIGMA;
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() < threshold.value && pokemon.getStatStage(stat) < 6;
      };
    case BerryType.LANSAT:
      return (pokemon: Pokemon) => {
        const threshold = new NumberHolder(0.25);
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() < 0.25 && !pokemon.getTag(BattlerTagType.CRIT_BOOST);
      };
    case BerryType.STARF:
      return (pokemon: Pokemon) => {
        const threshold = new NumberHolder(0.25);
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() < 0.25;
      };
    case BerryType.LEPPA:
      return (pokemon: Pokemon) => {
        const threshold = new NumberHolder(0.25);
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return !!pokemon.getMoveset().find((m) => !m.getPpRatio());
      };
  }
}

export type BerryEffectFunc = (pokemon: Pokemon, berryOwner?: Pokemon) => void;

export function getBerryEffectFunc(berryType: BerryType): BerryEffectFunc {
  switch (berryType) {
    case BerryType.SITRUS:
    case BerryType.ENIGMA:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        const hpHealed = new NumberHolder(toDmgValue(pokemon.getMaxHp() / 4));
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, hpHealed);
        globalScene.queuePokemonHeal(true, pokemon.getBattlerIndex(), hpHealed.value, {
          message: i18next.t("battle:hpHealBerry", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            berryName: getBerryName(berryType),
          }),
        });
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LUM:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        if (pokemon.hasNonVolatileStatusEffect(false, true)) {
          globalScene.queueMessage(
            getStatusEffectHealText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
          );
        }
        pokemon.resetStatus(true);
        pokemon.updateInfo();
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LIECHI:
    case BerryType.GANLON:
    case BerryType.PETAYA:
    case BerryType.APICOT:
    case BerryType.SALAC:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        // Offset BerryType such that LIECHI -> Stat.ATK = 1, GANLON -> Stat.DEF = 2, so on and so forth
        const stat: BattleStat = berryType - BerryType.ENIGMA;
        const statStages = new NumberHolder(1);
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, statStages);
        globalScene.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [stat], statStages.value),
        );
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LANSAT:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        pokemon.addTag(BattlerTagType.CRIT_BOOST);
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.STARF:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        const randStat = randSeedInt(Stat.SPD, Stat.ATK);
        const stages = new NumberHolder(2);
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, stages);
        globalScene.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [randStat], stages.value),
        );
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LEPPA:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        const ppRestoreMove = pokemon.getMoveset().find((m) => !m.getPpRatio())
          ? pokemon.getMoveset().find((m) => !m.getPpRatio())
          : pokemon.getMoveset().find((m) => m.getPpRatio() < 1);
        if (ppRestoreMove !== undefined) {
          ppRestoreMove!.ppUsed = Math.max(ppRestoreMove!.ppUsed - 10, 0);
          globalScene.queueMessage(
            i18next.t("battle:ppHealBerry", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              moveName: ppRestoreMove!.getName(),
              berryName: getBerryName(berryType),
            }),
          );
          applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
        }
      };
  }
}
