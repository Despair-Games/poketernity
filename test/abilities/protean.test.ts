import { allMoves } from "#app/data/data-lists";
import { ElementalType } from "#enums/elemental-type";
import { Weather } from "#app/data/weather";
import type { PlayerPokemon } from "#app/field/pokemon";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BiomeId } from "#enums/biome-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
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
    game.override.battleType("single");
    game.override.ability(AbilityId.PROTEAN);
    game.override.startingLevel(100);
    game.override.enemySpecies(SpeciesId.RATTATA);
    game.override.enemyMoveset([MoveId.ENDURE, MoveId.ENDURE, MoveId.ENDURE, MoveId.ENDURE]);
  });

  test("ability applies and changes a pokemon's type", async () => {
    game.override.moveset([MoveId.SPLASH]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);
  });

  // Test for Gen9+ functionality, we are using previous funcionality
  test.skip("ability applies only once per switch in", async () => {
    game.override.moveset([MoveId.SPLASH, MoveId.AGILITY]);

    await game.startBattle([SpeciesId.MAGIKARP, SpeciesId.BULBASAUR]);

    let leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);

    game.move.select(MoveId.AGILITY);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied.filter((a) => a === AbilityId.PROTEAN)).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]];
    const moveType = ElementalType[allMoves.get(MoveId.AGILITY).type];
    expect(leadPokemonType).not.toBe(moveType);

    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();

    leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);
  });

  test("ability applies correctly even if the pokemon's move has a variable type", async () => {
    game.override.moveset([MoveId.WEATHER_BALL]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.scene.arena.weather = new Weather(WeatherType.SUNNY);
    game.move.select(MoveId.WEATHER_BALL);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).toContain(AbilityId.PROTEAN);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]],
      moveType = ElementalType[ElementalType.FIRE];
    expect(leadPokemonType).toBe(moveType);
  });

  test("ability applies correctly even if the type has changed by another ability", async () => {
    game.override.moveset([MoveId.TACKLE]);
    game.override.passiveAbility(AbilityId.REFRIGERATE);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).toContain(AbilityId.PROTEAN);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]],
      moveType = ElementalType[ElementalType.ICE];
    expect(leadPokemonType).toBe(moveType);
  });

  test("ability applies correctly even if the pokemon's move calls another move", async () => {
    game.override.moveset([MoveId.NATURE_POWER]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.scene.arena.biomeType = BiomeId.MOUNTAIN;
    game.move.select(MoveId.NATURE_POWER);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.AIR_SLASH);
  });

  test("ability applies correctly even if the pokemon's move is delayed / charging", async () => {
    game.override.moveset([MoveId.DIG]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.DIG);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.DIG);
  });

  test("ability applies correctly even if the pokemon's move misses", async () => {
    game.override.moveset([MoveId.TACKLE]);
    game.override.enemyMoveset(MoveId.SPLASH);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.TACKLE);
    await game.move.forceMiss();
    await game.phaseInterceptor.to(TurnEndPhase);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.isFullHp()).toBe(true);
    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  test("ability applies correctly even if the pokemon's move is protected against", async () => {
    game.override.moveset([MoveId.TACKLE]);
    game.override.enemyMoveset([MoveId.PROTECT, MoveId.PROTECT, MoveId.PROTECT, MoveId.PROTECT]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  test("ability applies correctly even if the pokemon's move fails because of type immunity", async () => {
    game.override.moveset([MoveId.TACKLE]);
    game.override.enemySpecies(SpeciesId.GASTLY);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  test("ability is not applied if pokemon's type is the same as the move's type", async () => {
    game.override.moveset([MoveId.SPLASH]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    leadPokemon.summonData.types = [allMoves.get(MoveId.SPLASH).type];
    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(AbilityId.PROTEAN);
  });

  test("ability is not applied if pokemon is terastallized", async () => {
    game.override.moveset([MoveId.SPLASH]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    vi.spyOn(leadPokemon, "isTerastallized").mockReturnValue(true);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(AbilityId.PROTEAN);
  });

  test("ability is not applied if pokemon uses struggle", async () => {
    game.override.moveset([MoveId.STRUGGLE]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.STRUGGLE);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(AbilityId.PROTEAN);
  });

  test("ability is not applied if the pokemon's move fails", async () => {
    game.override.moveset([MoveId.BURN_UP]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.BURN_UP);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(AbilityId.PROTEAN);
  });

  test("ability applies correctly even if the pokemon's Trick-or-Treat fails", async () => {
    game.override.moveset([MoveId.TRICK_OR_TREAT]);
    game.override.enemySpecies(SpeciesId.GASTLY);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.TRICK_OR_TREAT);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TRICK_OR_TREAT);
  });

  test("ability applies correctly and the pokemon curses itself", async () => {
    game.override.moveset([MoveId.CURSE]);

    await game.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    expect(leadPokemon).not.toBe(undefined);

    game.move.select(MoveId.CURSE);
    await game.phaseInterceptor.to(TurnEndPhase);

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.CURSE);
    expect(leadPokemon.getTag(BattlerTagType.CURSED)).not.toBe(undefined);
  });
});

function testPokemonTypeMatchesDefaultMoveType(pokemon: PlayerPokemon, moveId: MoveId) {
  expect(pokemon.summonData.abilitiesApplied).toContain(AbilityId.PROTEAN);
  expect(pokemon.getTypes()).toHaveLength(1);
  const pokemonType = ElementalType[pokemon.getTypes()[0]],
    moveType = ElementalType[allMoves.get(moveId).type];
  expect(pokemonType).toBe(moveType);
}
