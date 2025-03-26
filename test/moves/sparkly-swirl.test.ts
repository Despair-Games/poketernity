import { allMoves } from "#app/data/data-lists";
import { StatusEffect } from "#enums/status-effect";
import { CommandPhase } from "#app/phases/command-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Sparkly Swirl", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({ type: Phaser.HEADLESS });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyLevel(100)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .moveset([MoveId.SPARKLY_SWIRL, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH);

    vi.spyOn(allMoves.get(MoveId.SPARKLY_SWIRL), "accuracy", "get").mockReturnValue(100);
  });

  it("should cure status effect of the user, its ally, and all party pokemon", async () => {
    game.override.battleType("double").statusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([SpeciesId.RATTATA, SpeciesId.RATTATA, SpeciesId.RATTATA]);
    const [leftPlayer, rightPlayer, partyPokemon] = game.scene.getPlayerParty();
    const leftOpp = game.scene.getEnemyPokemon()!;

    vi.spyOn(leftPlayer, "resetStatus");
    vi.spyOn(rightPlayer, "resetStatus");
    vi.spyOn(partyPokemon, "resetStatus");

    game.move.select(MoveId.SPARKLY_SWIRL, 0, leftOpp.getBattlerIndex());
    await game.phaseInterceptor.to(CommandPhase);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    expect(leftPlayer.resetStatus).toHaveBeenCalledOnce();
    expect(rightPlayer.resetStatus).toHaveBeenCalledOnce();
    expect(partyPokemon.resetStatus).toHaveBeenCalledOnce();

    expect(leftPlayer.getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(rightPlayer.getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(partyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });

  it("should not cure status effect of the target/target's allies", async () => {
    game.override.battleType("double").enemyStatusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([SpeciesId.RATTATA, SpeciesId.RATTATA]);
    const [leftOpp, rightOpp] = game.scene.getEnemyField();

    vi.spyOn(leftOpp, "resetStatus");
    vi.spyOn(rightOpp, "resetStatus");

    game.move.select(MoveId.SPARKLY_SWIRL, 0, leftOpp.getBattlerIndex());
    await game.phaseInterceptor.to(CommandPhase);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    expect(leftOpp.resetStatus).toHaveBeenCalledTimes(0);
    expect(rightOpp.resetStatus).toHaveBeenCalledTimes(0);

    expect(leftOpp.getStatusEffect(true)).toBeTruthy();
    expect(rightOpp.getStatusEffect(true)).toBeTruthy();

    expect(leftOpp.getStatusEffect(true)).toBe(StatusEffect.BURN);
    expect(rightOpp.getStatusEffect(true)).toBe(StatusEffect.BURN);
  });
});
