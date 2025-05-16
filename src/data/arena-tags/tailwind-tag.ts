import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTag } from "#arena-tags/arena-tag";
import { AbilityId } from "#enums/ability-id";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import type { Arena } from "#field/arena";
import { ShowAbilityPhase } from "#phases/show-ability-phase";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Tailwind_(move) Tailwind}.
 * Doubles the Speed of the Pokémon who created this arena tag, as well as all allied Pokémon.
 * Applies this arena tag for 4 turns (including the turn the move was used).
 * @extends ArenaTag
 */
export class TailwindTag extends ArenaTag {
  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.TAILWIND, turnCount, MoveId.TAILWIND, sourceId, side);
  }

  override onAdd(_arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.queueMessagePhase(i18next.t(`arenaTag:tailwindOnAdd${this.i18nSideKey}`));
    }

    const source = globalScene.getPokemonById(this.sourceId!); //TODO: this bang is questionable!
    const party = source?.getField() ?? [];

    for (const pokemon of party) {
      // Apply the CHARGED tag to party members with the WIND_POWER ability
      if (pokemon.hasAbility(AbilityId.WIND_POWER) && !pokemon.getTag(BattlerTagType.CHARGED)) {
        pokemon.addTag(BattlerTagType.CHARGED);
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("abilityTriggers:windPowerCharged", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            moveName: this.getMoveName(),
          }),
        );
      }
      // Raise attack by one stage if party member has WIND_RIDER ability
      if (pokemon.hasAbility(AbilityId.WIND_RIDER)) {
        globalScene.phaseManager.unshiftPhase(new ShowAbilityPhase(pokemon.getBattlerIndex()));
        globalScene.phaseManager.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.ATK], 1),
        );
      }
    }
  }

  override onRemove(_arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.queueMessagePhase(i18next.t(`arenaTag:tailwindOnRemove${this.i18nSideKey}`));
    }
  }
}
