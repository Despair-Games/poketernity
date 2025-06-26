// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { HIGHEST_STAT_BOOST_TAG_TYPES } from "#constants/battler-tag-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityBattlerTag } from "#battler-tags/ability-battler-tag";
import type { BattlerTag } from "#battler-tags/battler-tag";
import { allAbilities } from "#data/data-lists";
import type { AbilityId } from "#enums/ability-id";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { EFFECTIVE_STATS, getStatKey, Stat, type EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Boosts the owner's highest {@linkcode EFFECTIVE_STATS | effective stat} by 30%.
 *
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Protosynthesis_(Ability) | Protosynthesis}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Quark_Drive_(Ability) | Quark Drive}.
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode HIGHEST_STAT_BOOST_TAG_TYPES}
 */
export abstract class HighestStatBoostTag extends AbilityBattlerTag {
  public stat: Stat;
  public multiplier: number;

  constructor(tagType: BattlerTagType, ability: AbilityId) {
    super(tagType, ability, BattlerTagLapseType.CUSTOM, 1);
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.stat = source.stat as Stat;
    this.multiplier = source.multiplier;
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    let highestStat: EffectiveStat;
    EFFECTIVE_STATS.map((s) => pokemon.getEffectiveStat(s)).reduce((highestValue: number, value: number, i: number) => {
      if (value > highestValue) {
        highestStat = EFFECTIVE_STATS[i];
        return value;
      }
      return highestValue;
    }, 0);

    highestStat = highestStat!; // tell TS compiler it's defined!
    this.stat = highestStat;

    switch (this.stat) {
      case Stat.SPD:
        this.multiplier = 1.5;
        break;
      default:
        this.multiplier = 1.3;
        break;
    }

    globalScene.phaseManager.createAndPushPhase(
      "MessagePhase",
      i18next.t("battlerTags:highestStatBoostOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        statName: i18next.t(getStatKey(highestStat)),
      }),
    );
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:highestStatBoostOnRemove", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        abilityName: allAbilities[this.ability].name,
      }),
    );
  }
}
