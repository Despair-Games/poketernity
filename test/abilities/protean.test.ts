import { allMoves } from "#app/data/all-moves";
import { Type } from "#enums/type";
import { Weather } from "#app/data/weather";
import type { PlayerPokemon } from "#app/field/pokemon";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Abilities - Protean", () => {
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.ability(Abilities.PROTEAN);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemySpecies(Species.RATTATA);
    game.overridesHelper.enemyMoveset([Moves.ENDURE, Moves.ENDURE, Moves.ENDURE, Moves.ENDURE]);
  });

  test("ability applies and changes a pokemon's type", async () => {
    game.overridesHelper.moveset([Moves.SPLASH]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.SPLASH);
  });

  // Test for Gen9+ functionality, we are using previous funcionality
  test.skip("ability applies only once per switch in", async () => {
    game.overridesHelper.moveset([Moves.SPLASH, Moves.AGILITY]);

    await game.startBattle([Species.MAGIKARP, Species.BULBASAUR]);

    let leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.SPLASH);

    game.moveHelper.select(Moves.AGILITY);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied.filter((a) => a === Abilities.PROTEAN)).toHaveLength(1);
    const leadPokemonType = Type[leadPokemon.getTypes()[0]];
    const moveType = Type[allMoves[Moves.AGILITY].type];
    expect(leadPokemonType).not.toBe(moveType);

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();

    leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.SPLASH);
  });

  test("ability applies correctly even if the pokemon's move has a variable type", async () => {
    game.overridesHelper.moveset([Moves.WEATHER_BALL]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.scene.arena.weather = new Weather(WeatherType.SUNNY);
    game.moveHelper.select(Moves.WEATHER_BALL);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).toContain(Abilities.PROTEAN);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = Type[leadPokemon.getTypes()[0]],
      moveType = Type[Type.FIRE];
    expect(leadPokemonType).toBe(moveType);
  });

  test("ability applies correctly even if the type has changed by another ability", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.passiveAbility(Abilities.REFRIGERATE);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).toContain(Abilities.PROTEAN);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = Type[leadPokemon.getTypes()[0]],
      moveType = Type[Type.ICE];
    expect(leadPokemonType).toBe(moveType);
  });

  test("ability applies correctly even if the pokemon's move calls another move", async () => {
    game.overridesHelper.moveset([Moves.NATURE_POWER]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.scene.arena.biomeType = Biome.MOUNTAIN;
    game.moveHelper.select(Moves.NATURE_POWER);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.AIR_SLASH);
  });

  test("ability applies correctly even if the pokemon's move is delayed / charging", async () => {
    game.overridesHelper.moveset([Moves.DIG]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.DIG);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.DIG);
  });

  test("ability applies correctly even if the pokemon's move misses", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.TACKLE);
    await game.moveHelper.forceMiss();
    await game.phaseInterceptor.to(TurnEndPhase);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.isFullHp()).toBe(true);
    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.TACKLE);
  });

  test("ability applies correctly even if the pokemon's move is protected against", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.enemyMoveset([Moves.PROTECT, Moves.PROTECT, Moves.PROTECT, Moves.PROTECT]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.TACKLE);
  });

  test("ability applies correctly even if the pokemon's move fails because of type immunity", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.enemySpecies(Species.GASTLY);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.TACKLE);
  });

  test("ability is not applied if pokemon's type is the same as the move's type", async () => {
    game.overridesHelper.moveset([Moves.SPLASH]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    leadPokemon.summonData.types = [allMoves[Moves.SPLASH].type];
    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(Abilities.PROTEAN);
  });

  test("ability is not applied if pokemon is terastallized", async () => {
    game.overridesHelper.moveset([Moves.SPLASH]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    vi.spyOn(leadPokemon, "isTerastallized").mockReturnValue(true);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(Abilities.PROTEAN);
  });

  test("ability is not applied if pokemon uses struggle", async () => {
    game.overridesHelper.moveset([Moves.STRUGGLE]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.STRUGGLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(Abilities.PROTEAN);
  });

  test("ability is not applied if the pokemon's move fails", async () => {
    game.overridesHelper.moveset([Moves.BURN_UP]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.BURN_UP);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(Abilities.PROTEAN);
  });

  test("ability applies correctly even if the pokemon's Trick-or-Treat fails", async () => {
    game.overridesHelper.moveset([Moves.TRICK_OR_TREAT]);
    game.overridesHelper.enemySpecies(Species.GASTLY);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.TRICK_OR_TREAT);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.TRICK_OR_TREAT);
  });

  test("ability applies correctly and the pokemon curses itself", async () => {
    game.overridesHelper.moveset([Moves.CURSE]);

    await game.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.moveHelper.select(Moves.CURSE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, Moves.CURSE);
    expect(leadPokemon.getTag(BattlerTagType.CURSED)).not.toBe(undefined);
  });
});

function testPokemonTypeMatchesDefaultMoveType(pokemon: PlayerPokemon, move: Moves) {
  expect(pokemon.summonData.abilitiesApplied).toContain(Abilities.PROTEAN);
  expect(pokemon.getTypes()).toHaveLength(1);
  const pokemonType = Type[pokemon.getTypes()[0]],
    moveType = Type[allMoves[move].type];
  expect(pokemonType).toBe(moveType);
}
