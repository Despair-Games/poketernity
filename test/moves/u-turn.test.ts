import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - U-turn", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .ability(AbilityId.BALL_FETCH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset(MoveId.SPLASH)
      .disableCrits();
  });

  it("should force the user to switch out", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerParty();

    game.move.use(MoveId.U_TURN);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    // TODO: Should this use a new matcher instead?
    expect(magikarp.isOnField()).toBeFalsy();
    expect(feebas.isOnField()).toBeTruthy();
  });

  it("should force the user to switch out even when the target faints", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerParty();
    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;

    game.move.use(MoveId.U_TURN);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeFalsy();
    expect(feebas.isOnField()).toBeTruthy();
  });

  it("should not force a switch when party Pokemon are fainted", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerParty();
    feebas.hp = 0;

    game.move.use(MoveId.U_TURN);
    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeTruthy();
    expect(feebas.isOnField()).toBeFalsy();
  });

  it("should not force a switch when party Pokemon are challenge-restricted", async () => {
    game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.WATER, 0);

    await game.challengeMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.WHISMUR);

    const [magikarp, whismur] = game.scene.getPlayerParty();

    game.move.use(MoveId.U_TURN);
    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeTruthy();
    expect(whismur.isOnField()).toBeFalsy();
  });

  it("should trigger the user's Regenerator exactly once when the user is forced out", async () => {
    game.override.ability(AbilityId.REGENERATOR);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerParty();
    magikarp.hp = 1;

    game.move.use(MoveId.U_TURN);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeFalsy();
    expect(magikarp).toHaveHp(Math.floor(magikarp.getMaxHp() * 0.33) + 1);
    expect(feebas.isOnField()).toBeTruthy();
  });

  it("should apply the opponent's Rough Skin on the user before the user is forced out", async () => {
    game.override.enemyAbility(AbilityId.ROUGH_SKIN);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [magikarp, feebas] = game.scene.getPlayerParty();

    game.move.use(MoveId.U_TURN);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeFalsy();
    expect(magikarp).not.toHaveFullHp();
    expect(feebas.isOnField()).toBeTruthy();
    expect(feebas).toHaveFullHp();
  });

  it("should not force Wild Pokemon to flee", async () => {
    game.override.enemyMoveset(MoveId.U_TURN);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    vi.spyOn(game.scene, "tryForceFleePokemon");

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.use(MoveId.SPLASH);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(game.scene.tryForceFleePokemon).not.toHaveBeenCalled();
  });
});
