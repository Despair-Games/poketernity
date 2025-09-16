import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { AbilityId } from "#enums/ability-id";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Tailwind_(move) Tailwind}. \
 * Doubles the Speed of the Pokémon who created this arena tag, as well as all allied Pokémon. \
 * Applies this arena tag for 4 turns (including the turn the move was used).
 */
export class TailwindTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.TAILWIND;
  // This asserts to the compiler that `sourceId` is defined at all times for this tag
  public declare sourceId: number;

  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(turnCount, MoveId.TAILWIND, sourceId, side);
  }

  override onAdd(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:tailwindOnAdd${this.i18nSideKey}`),
      );
    }

    const source = globalScene.getPokemonById(this.sourceId);
    if (source == null) {
      return;
    }
    const party = source.getField();

    for (const pokemon of party) {
      // Apply the CHARGED tag to party members with the WIND_POWER ability
      if (pokemon.hasAbility(AbilityId.WIND_POWER) && !pokemon.hasTag(BattlerTagType.CHARGED)) {
        pokemon.addTag(BattlerTagType.CHARGED);
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("abilityTriggers:windPowerCharged", {
            pokemonName: getPokemonNameWithAffix(pokemon),
            moveName: this.getMoveName(),
          }),
        );
      }
      // Raise attack by one stage if party member has WIND_RIDER ability
      if (pokemon.hasAbility(AbilityId.WIND_RIDER)) {
        globalScene.phaseManager.createAndUnshiftPhase("ShowAbilityPhase", pokemon.getBattlerIndex());
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          pokemon.getBattlerIndex(),
          pokemon,
          [Stat.ATK],
          1,
        );
      }
    }
  }

  override onRemove(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:tailwindOnRemove${this.i18nSideKey}`),
      );
    }
  }
}
