import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";

describe.each([
  { abilityName: "Huge Power", ability: AbilityId.HUGE_POWER },
  { abilityName: "Pure Power", ability: AbilityId.PURE_POWER },
])("Abilities - $abilityName", ({ ability }) => {
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
      .ability(ability)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyLevel(20)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should double the attack stat of the ability-holder", async () => {
    game.override.moveset(MoveId.TACKLE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(MoveId.TACKLE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.ATK) * 2);
  });

  it("should double the attack stat when using Body Press", async () => {
    game.override.ability(ability).moveset(MoveId.BODY_PRESS);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(MoveId.BODY_PRESS);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.DEF) * 2);
  });
  // Note: Huge Power/Pure Power's interaction with Foul Play is tested in moves/foul_play.test.ts

  it("should not double the attack stat when calculating confusion damage", async () => {
    game.override.ability(ability).moveset(MoveId.SPLASH).enemyMoveset(MoveId.SUPERSONIC).statusActivation(true);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(MoveId.SPLASH);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.ATK));
  });
});
