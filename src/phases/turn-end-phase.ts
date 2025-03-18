import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { TurnEndEvent } from "#app/events/battle-scene";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { TurnHealModifier, TurnHeldItemTransferModifier, TurnStatusEffectModifier } from "#app/modifier/modifier";
import { TerrainType } from "#enums/terrain-type";
import i18next from "i18next";
import { FieldPhase } from "./abstract-field-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";

export class TurnEndPhase extends FieldPhase {
  override readonly id = PhaseId.TURN_END;

  public override start(): void {
    super.start();

    const { arena, currentBattle, eventTarget } = globalScene;
    const { terrain } = arena;

    currentBattle.incrementTurn();
    eventTarget.dispatchEvent(new TurnEndEvent(currentBattle.turn));

    const handlePokemon = (pokemon: Pokemon): void => {
      if (!pokemon.switchOutStatus) {
        pokemon.lapseTags(BattlerTagLapseType.TURN_END);

        globalScene.applyModifiers(TurnHealModifier, pokemon.isPlayer(), pokemon);

        if (terrain?.terrainType === TerrainType.GRASSY && pokemon.isGrounded()) {
          globalScene.queuePokemonHeal(true, pokemon.getBattlerIndex(), Math.max(pokemon.getMaxHp() >> 4, 1), {
            message: i18next.t("battle:turnEndHpRestore", { pokemonName: getPokemonNameWithAffix(pokemon) }),
          });
        }
        applyAbAttrs(AbAttrFlag.POST_TURN, pokemon, false);
      }

      globalScene.applyModifiers(TurnStatusEffectModifier, pokemon.isPlayer(), pokemon);

      globalScene.applyModifiers(TurnHeldItemTransferModifier, pokemon.isPlayer(), pokemon);
    };

    this.executeForAll(handlePokemon);

    arena.lapseTags();

    if (terrain && !terrain.lapse()) {
      arena.trySetTerrain(TerrainType.NONE, false);
    }

    this.end();
  }
}
