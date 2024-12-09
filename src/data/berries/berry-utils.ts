import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { NumberHolder, randSeedInt, toDmgValue } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryType } from "#enums/berry-type";
import { type BattleStat, Stat } from "#enums/stat";
import i18next from "i18next";
import { applyAbAttrs, applyPostItemLostAbAttrs, DoubleBerryEffectAbAttr, PostItemLostAbAttr } from "../ability";
import { type BerryEffectFunc, getBerryName } from "../berry";
import { getStatusEffectHealText } from "../status-effect";

export function getBerryEffectFunc(berryType: BerryType): BerryEffectFunc {
  switch (berryType) {
    case BerryType.SITRUS:
    case BerryType.ENIGMA:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        const hpHealed = new NumberHolder(toDmgValue(pokemon.getMaxHp() / 4));
        applyAbAttrs(DoubleBerryEffectAbAttr, pokemon, null, false, hpHealed);
        globalScene.unshiftPhase(
          new PokemonHealPhase(
            pokemon.getBattlerIndex(),
            hpHealed.value,
            i18next.t("battle:hpHealBerry", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              berryName: getBerryName(berryType),
            }),
            true,
          ),
        );
        applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
      };
    case BerryType.LUM:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        if (pokemon.status) {
          globalScene.queueMessage(getStatusEffectHealText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)));
        }
        pokemon.resetStatus(true, true);
        pokemon.updateInfo();
        applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
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
        applyAbAttrs(DoubleBerryEffectAbAttr, pokemon, null, false, statStages);
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [stat], statStages.value));
        applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
      };
    case BerryType.LANSAT:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        pokemon.addTag(BattlerTagType.CRIT_BOOST);
        applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
      };
    case BerryType.STARF:
      return (pokemon: Pokemon, berryOwner?: Pokemon) => {
        if (pokemon.battleData) {
          pokemon.battleData.berriesEaten.push(berryType);
        }
        const randStat = randSeedInt(Stat.SPD, Stat.ATK);
        const stages = new NumberHolder(2);
        applyAbAttrs(DoubleBerryEffectAbAttr, pokemon, null, false, stages);
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [randStat], stages.value));
        applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
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
          applyPostItemLostAbAttrs(PostItemLostAbAttr, berryOwner ?? pokemon, false);
        }
      };
  }
}
