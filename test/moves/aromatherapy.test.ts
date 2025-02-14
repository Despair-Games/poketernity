import { StatusEffect } from "#enums/status-effect";
import { CommandPhase } from "#app/phases/command-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";

describe("Moves - Aromatherapy", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

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
    game.override
      .moveset([MoveId.AROMATHERAPY, MoveId.SPLASH])
      .statusEffect(StatusEffect.BURN)
      .battleType("double")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should cure status effect of the user, its ally, and all party pokemon", async () => {
    await game.classicMode.startBattle([Species.RATTATA, Species.RATTATA, Species.RATTATA]);
    const [leftPlayer, rightPlayer, partyPokemon] = game.scene.getPlayerParty();

    vi.spyOn(leftPlayer, "resetStatus");
    vi.spyOn(rightPlayer, "resetStatus");
    vi.spyOn(partyPokemon, "resetStatus");

    game.move.select(MoveId.AROMATHERAPY, 0);
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
    game.override.enemyStatusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([Species.RATTATA, Species.RATTATA]);
    const [leftOpp, rightOpp] = game.scene.getEnemyField();

    vi.spyOn(leftOpp, "resetStatus");
    vi.spyOn(rightOpp, "resetStatus");

    game.move.select(MoveId.AROMATHERAPY, 0);
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

  it("should not cure status effect of allies ON FIELD with Sap Sipper, should still cure allies in party", async () => {
    game.override.ability(Abilities.SAP_SIPPER);
    await game.classicMode.startBattle([Species.RATTATA, Species.RATTATA, Species.RATTATA]);
    const [leftPlayer, rightPlayer, partyPokemon] = game.scene.getPlayerParty();

    vi.spyOn(leftPlayer, "resetStatus");
    vi.spyOn(rightPlayer, "resetStatus");
    vi.spyOn(partyPokemon, "resetStatus");

    game.move.select(MoveId.AROMATHERAPY, 0);
    await game.phaseInterceptor.to(CommandPhase);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    expect(leftPlayer.resetStatus).toHaveBeenCalledOnce();
    expect(rightPlayer.resetStatus).toHaveBeenCalledTimes(0);
    expect(partyPokemon.resetStatus).toHaveBeenCalledOnce();

    expect(leftPlayer.getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(rightPlayer.getStatusEffect(true)).toBe(StatusEffect.BURN);
    expect(partyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });
});
