import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { TerrainType } from "#enums/terrain-type";
import { TurnEndEvent } from "#events/battle-scene";
import type { Pokemon } from "#field/pokemon";
import { TurnHealModifier, TurnHeldItemTransferModifier, TurnStatusEffectModifier } from "#modifier/modifier";
import { BattlePhase } from "#phases/base/battle-phase";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

export class TurnEndPhase extends BattlePhase {
  public override readonly phaseName = "TurnEndPhase";

  public override start(): void {
    const { arena, currentBattle, eventTarget } = globalScene;
    const { terrain } = arena;

    currentBattle.incrementTurn();
    eventTarget.dispatchEvent(new TurnEndEvent(currentBattle.turn));

    const handlePokemon = (pokemon: Pokemon): void => {
      if (!pokemon.switchOutStatus) {
        pokemon.lapseTags(BattlerTagLapseType.TURN_END);

        globalScene.applyModifiers(TurnHealModifier, pokemon.isPlayer(), pokemon);

        if (arena.hasTerrain(TerrainType.GRASSY) && pokemon.isGrounded()) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "PokemonHealPhase",
            pokemon.getBattlerIndex(),
            Math.max(pokemon.getMaxHp() >> 4, 1),
            {
              message: i18next.t("battle:turnEndHpRestore", { pokemonName: getPokemonNameWithAffix(pokemon) }),
            },
          );
        }
        applyAbAttrs("PostTurnAbAttr", pokemon, false);
        // TODO: Temporary workaround so that bad dreams doesn't hurt Pokemon waking up in the same turn. cf https://github.com/Despair-Games/poketernity/issues/1211
        // cf https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts `onResidualOrder` and `onResidualSubOrder`
        applyAbAttrs("BadDreamsAbAttr", pokemon, false);
      }

      globalScene.applyModifiers(TurnStatusEffectModifier, pokemon.isPlayer(), pokemon);

      globalScene.applyModifiers(TurnHeldItemTransferModifier, pokemon.isPlayer(), pokemon);
    };

    for (const pokemon of inSpeedOrder()) {
      handlePokemon(pokemon);
    }

    arena.lapseTags();

    // TODO: is this `if` necessary?
    if (terrain && !terrain.lapse()) {
      arena.trySetTerrain(TerrainType.NONE, false);
    }

    this.end();
  }
}
