import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { DoubleBerryEffectAbAttr } from "#abilities/double-berry-effect-ab-attr";
import type { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { ReduceBerryUseThresholdAbAttr } from "#abilities/reduce-berry-use-threshold-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { HitResult } from "#enums/hit-result";
import { type BattleStat, Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { getBerryName } from "#utils/berry-utils";
import { NumberHolder, toDmgValue, ValueHolder } from "#utils/common-utils";
import { randSeedInt } from "#utils/random-utils";
import { getStatusEffectHealText } from "#utils/status-effect-utils";
import i18next from "i18next";

type BerryPredicate = (pokemon: Pokemon) => boolean;

export function getBerryPredicate(berryType: BerryType): BerryPredicate {
  switch (berryType) {
    case BerryType.SITRUS:
      return (pokemon: Pokemon) => pokemon.getHpRatio() < 0.5;
    case BerryType.LUM:
      return (pokemon: Pokemon) => pokemon.hasNonVolatileStatusEffect(true, true);
    case BerryType.ENIGMA:
      return (pokemon: Pokemon) => pokemon.turnData.attacksReceived.some((a) => a.result === HitResult.SUPER_EFFECTIVE);
    case BerryType.LIECHI:
    case BerryType.GANLON:
    case BerryType.PETAYA:
    case BerryType.APICOT:
    case BerryType.SALAC:
      return (pokemon: Pokemon) => {
        const threshold = new ValueHolder(0.25);
        // Offset BerryType such that LIECHI -> Stat.ATK = 1, GANLON -> Stat.DEF = 2, so on and so forth
        const stat: BattleStat = berryType - BerryType.ENIGMA;
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() <= threshold.value && pokemon.getStatStage(stat) < 6;
      };
    case BerryType.LANSAT:
      return (pokemon: Pokemon) => {
        const threshold = new ValueHolder(0.25);
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() <= threshold.value && !pokemon.hasTag(BattlerTagType.CRIT_BOOST);
      };
    case BerryType.STARF:
      return (pokemon: Pokemon) => {
        const threshold = new ValueHolder(0.25);
        applyAbAttrs<ReduceBerryUseThresholdAbAttr>(AbAttrFlag.REDUCE_BERRY_USE_THRESHOLD, pokemon, false, threshold);
        return pokemon.getHpRatio() <= threshold.value;
      };
    case BerryType.LEPPA:
      return (pokemon: Pokemon) => {
        return pokemon.getMoveset().some((m) => !m.getPpRatio());
      };
  }
}

type BerryEffectFunc = (pokemon: Pokemon, berryOwner?: Pokemon) => void;

// TODO: simplify this
export function getBerryEffectFunc(berryType: BerryType): BerryEffectFunc {
  switch (berryType) {
    case BerryType.SITRUS:
    case BerryType.ENIGMA:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        pokemon.waveData.berriesEaten.push(berryType);
        const hpHealed = new NumberHolder(toDmgValue(pokemon.getMaxHp() / 4));
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, hpHealed);
        globalScene.phaseManager.createAndUnshiftPhase("PokemonHealPhase", pokemon.getBattlerIndex(), hpHealed.value, {
          message: i18next.t("battle:hpHealBerry", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            berryName: getBerryName(berryType),
          }),
        });
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LUM:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        pokemon.waveData.berriesEaten.push(berryType);
        if (pokemon.hasNonVolatileStatusEffect(false, true)) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
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
        pokemon.waveData.berriesEaten.push(berryType);
        // Offset BerryType such that LIECHI -> Stat.ATK = 1, GANLON -> Stat.DEF = 2, so on and so forth
        const stat: BattleStat = berryType - BerryType.ENIGMA;
        const statStages = new NumberHolder(1);
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, statStages);
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          pokemon.getBattlerIndex(),
          pokemon,
          [stat],
          statStages.value,
        );
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LANSAT:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        pokemon.waveData.berriesEaten.push(berryType);
        pokemon.addTag(BattlerTagType.CRIT_BOOST);
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.STARF:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        pokemon.waveData.berriesEaten.push(berryType);
        const randStat = randSeedInt(Stat.SPD, Stat.ATK);
        const stages = new NumberHolder(2);
        applyAbAttrs<DoubleBerryEffectAbAttr>(AbAttrFlag.DOUBLE_BERRY_EFFECT, pokemon, false, stages);
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          pokemon.getBattlerIndex(),
          pokemon,
          [randStat],
          stages.value,
        );
        applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
      };
    case BerryType.LEPPA:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        pokemon.waveData.berriesEaten.push(berryType);
        const ppRestoreMove = pokemon.getMoveset().find((m) => !m.getPpRatio())
          ? pokemon.getMoveset().find((m) => !m.getPpRatio())
          : pokemon.getMoveset().find((m) => m.getPpRatio() < 1);
        if (ppRestoreMove !== undefined) {
          ppRestoreMove.ppUsed = Math.max(ppRestoreMove.ppUsed - 10, 0);
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("battle:ppHealBerry", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              moveName: ppRestoreMove!.name,
              berryName: getBerryName(berryType),
            }),
          );
          applyAbAttrs<PostItemLostAbAttr>(AbAttrFlag.POST_ITEM_LOST, berryOwner ?? pokemon, false);
        }
      };
  }
}
