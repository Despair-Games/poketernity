import { TurnStartPhase } from "#app/phases/turn-start-phase";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Fusion Flare", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const fusionFlare = MoveId.FUSION_FLARE;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override.moveset([fusionFlare]);
    game.override.startingLevel(1);

    game.override.enemySpecies(SpeciesId.RATTATA);
    game.override.enemyMoveset([MoveId.REST, MoveId.REST, MoveId.REST, MoveId.REST]);

    game.override.battleType("single");
    game.override.startingWave(97);
    game.override.disableCrits();
  });

  it("should thaw freeze status condition", async () => {
    await game.startBattle([SpeciesId.RESHIRAM]);

    const partyMember = game.scene.getPlayerPokemon()!;

    game.move.select(fusionFlare);

    await game.phaseInterceptor.to(TurnStartPhase, false);

    // Inflict freeze quietly and check if it was properly inflicted
    partyMember.trySetStatus(StatusEffect.FREEZE, false);
    expect(partyMember.getStatusEffect(true)).toBe(StatusEffect.FREEZE);

    await game.toNextTurn();

    // Check if FUSION_FLARE thawed freeze
    expect(partyMember.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });
});
