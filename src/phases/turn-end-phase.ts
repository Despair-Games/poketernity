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
import { FieldPhase } from "./field-phase";
import { PokemonHealPhase } from "./pokemon-heal-phase";

export class TurnEndPhase extends FieldPhase {
  override start() {
    super.start();

    globalScene.currentBattle.incrementTurn();
    globalScene.eventTarget.dispatchEvent(new TurnEndEvent(globalScene.currentBattle.turn));

    const handlePokemon = (pokemon: Pokemon) => {
      if (!pokemon.switchOutStatus) {
        pokemon.lapseTags(BattlerTagLapseType.TURN_END);

        globalScene.applyModifiers(TurnHealModifier, pokemon.isPlayer(), pokemon);

        if (globalScene.arena.terrain?.terrainType === TerrainType.GRASSY && pokemon.isGrounded()) {
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

    globalScene.arena.lapseTags();

    if (globalScene.arena.weather && !globalScene.arena.weather.lapse()) {
      globalScene.arena.trySetWeather(WeatherType.NONE, false);
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    }

    if (globalScene.arena.terrain && !globalScene.arena.terrain.lapse()) {
      globalScene.arena.trySetTerrain(TerrainType.NONE, false);
    }

    this.end();
  }
}
