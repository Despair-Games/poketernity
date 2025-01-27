import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";

describe("Abilities - Huge Power/Pure Power", () => {
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
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(20)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { abilityName: "Huge Power", ability: Abilities.HUGE_POWER },
    { abilityName: "Pure Power", ability: Abilities.PURE_POWER },
  ])("$abilityName should double the attack stat of the ability-holder", async ({ ability }) => {
    game.override.ability(ability).moveset(Moves.TACKLE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(Moves.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.ATK) * 2);
  });

  it.each([
    { abilityName: "Huge Power", ability: Abilities.HUGE_POWER, moveName: "Body Press", move: Moves.BODY_PRESS },
    { abilityName: "Pure Power", ability: Abilities.PURE_POWER, moveName: "Body Press", move: Moves.BODY_PRESS },
    { abilityName: "Huge Power", ability: Abilities.HUGE_POWER, moveName: "Foul Play", move: Moves.FOUL_PLAY },
    { abilityName: "Pure Power", ability: Abilities.PURE_POWER, moveName: "Foul Play", move: Moves.FOUL_PLAY },
  ])("$abilityName should double the attack stat when using $moveName", async ({ ability, move }) => {
    game.override.ability(ability).moveset(move);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(move);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.ATK) * 2);
  });

  it.each([
    { abilityName: "Huge Power", ability: Abilities.HUGE_POWER },
    { abilityName: "Pure Power", ability: Abilities.PURE_POWER },
  ])("$abilityName should not double the attack stat when calculating confusion damage", async ({ ability }) => {
    game.override.ability(ability).moveset(Moves.SPLASH).enemyMoveset(Moves.SUPERSONIC).statusActivation(true);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getEffectiveStat");

    game.move.select(Moves.SPLASH);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.getEffectiveStat).toHaveReturnedWith(playerPokemon.getStat(Stat.ATK));
  });
});
