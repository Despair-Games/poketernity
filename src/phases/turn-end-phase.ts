import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { PhaseId } from "#enums/phase-id";
import { TerrainType } from "#enums/terrain-type";
import { TurnEndEvent } from "#events/battle-scene";
import type { Pokemon } from "#field/pokemon";
import { TurnHealModifier, TurnHeldItemTransferModifier, TurnStatusEffectModifier } from "#modifier/modifier";
import { FieldPhase } from "#phases/abstract-field-phase";
import i18next from "i18next";

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
          globalScene.phaseManager.queuePokemonHealPhase(
            pokemon.getBattlerIndex(),
            Math.max(pokemon.getMaxHp() >> 4, 1),
            {
              message: i18next.t("battle:turnEndHpRestore", { pokemonName: getPokemonNameWithAffix(pokemon) }),
            },
          );
        }
        applyAbAttrs<PostTurnAbAttr>(AbAttrFlag.POST_TURN, pokemon, false);
       // TODO: Temporary workaround so that bad dreams doesn't hurt Pokemon waking up in the same turn. Has to be fixed with #1211
        applyAbAttrs<PostTurnAbAttr>(AbAttrFlag.BAD_DREAMS, pokemon, false);
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
