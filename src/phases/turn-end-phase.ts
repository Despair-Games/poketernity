import { PostTurnAbAttr } from "#app/data/ab-attrs/post-turn-ab-attr";
import { applyPostTurnAbAttrs } from "#app/data/ability";
import { BattlerTagLapseType } from "#app/data/battler-tags";
import { TurnEndEvent } from "#app/events/battle-scene";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  EnemyStatusEffectHealChanceModifier,
  EnemyTurnHealModifier,
  TurnHealModifier,
  TurnHeldItemTransferModifier,
  TurnStatusEffectModifier,
} from "#app/modifier/modifier";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { FieldPhase } from "./abstract-field-phase";
import { PokemonHealPhase } from "./pokemon-heal-phase";

export class TurnEndPhase extends FieldPhase {
  public override start(): void {
    super.start();

    const { arena, currentBattle, eventTarget } = globalScene;
    const { terrain, weather } = arena;

    currentBattle.incrementTurn();
    eventTarget.dispatchEvent(new TurnEndEvent(currentBattle.turn));

    const handlePokemon = (pokemon: Pokemon): void => {
      if (!pokemon.switchOutStatus) {
        pokemon.lapseTags(BattlerTagLapseType.TURN_END);

        globalScene.applyModifiers(TurnHealModifier, pokemon.isPlayer(), pokemon);

        if (terrain?.terrainType === TerrainType.GRASSY && pokemon.isGrounded()) {
          globalScene.unshiftPhase(
            new PokemonHealPhase(
              pokemon.getBattlerIndex(),
              Math.max(pokemon.getMaxHp() >> 4, 1),
              i18next.t("battle:turnEndHpRestore", { pokemonName: getPokemonNameWithAffix(pokemon) }),
              true,
            ),
          );
        }

        if (!pokemon.isPlayer()) {
          globalScene.applyModifiers(EnemyTurnHealModifier, false, pokemon);
          globalScene.applyModifier(EnemyStatusEffectHealChanceModifier, false, pokemon);
        }

        applyPostTurnAbAttrs(PostTurnAbAttr, pokemon);
      }

      globalScene.applyModifiers(TurnStatusEffectModifier, pokemon.isPlayer(), pokemon);

      globalScene.applyModifiers(TurnHeldItemTransferModifier, pokemon.isPlayer(), pokemon);

      pokemon.battleSummonData.turnCount++;
      pokemon.battleSummonData.waveTurnCount++;
    };

    this.executeForAll(handlePokemon);

    arena.lapseTags();

    if (weather && !weather.lapse()) {
      arena.trySetWeather(WeatherType.NONE, false);
      arena.triggerWeatherBasedFormChangesToNormal();
    }

    if (terrain && !terrain.lapse()) {
      arena.trySetTerrain(TerrainType.NONE, false);
    }

    this.end();
  }
}
