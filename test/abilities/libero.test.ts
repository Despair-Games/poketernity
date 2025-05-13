import { allMoves } from "#data/data-lists";
import { Weather } from "#data/weather";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BiomeId } from "#enums/biome-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import type { PlayerPokemon } from "#field/player-pokemon";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe.each([
  { ability: AbilityId.LIBERO, abilityName: "Libero" },
  { ability: AbilityId.PROTEAN, abilityName: "Protean" },
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
      .battleType("single")
      .ability(ability)
      .startingLevel(100)
      .enemySpecies(SpeciesId.RATTATA)
      .enemyMoveset(MoveId.ENDURE)
      .disableCrits();
  });

  it("applies and changes a pokemon's type", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);
  });

  // Test for Gen9+ functionality, disabled because we are using previous funcionality
  it.skip("applies only once per switch in", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.BULBASAUR]);

    let leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);

    game.move.use(MoveId.AGILITY);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied.filter((a) => a === ability)).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]];
    const moveType = ElementalType[allMoves.get(MoveId.AGILITY).type];
    expect(leadPokemonType).not.toBe(moveType);

    await game.toNextTurn();
    game.switchPokemon(1);
    await game.toNextTurn();
    game.switchPokemon(1);
    await game.toNextTurn();

    leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.SPLASH);
  });

  it("applies correctly even if the pokemon's move has a variable type", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.scene.arena.weather = new Weather(WeatherType.SUNNY);
    game.move.use(MoveId.WEATHER_BALL);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).toContain(ability);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]],
      moveType = ElementalType[ElementalType.FIRE];
    expect(leadPokemonType).toBe(moveType);
  });

  it("applies correctly even if the type has changed by another ability", async () => {
    game.override.passiveAbility(AbilityId.REFRIGERATE);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).toContain(ability);
    expect(leadPokemon.getTypes()).toHaveLength(1);
    const leadPokemonType = ElementalType[leadPokemon.getTypes()[0]],
      moveType = ElementalType[ElementalType.ICE];
    expect(leadPokemonType).toBe(moveType);
  });

  it("applies correctly even if the pokemon's move calls another move", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.scene.arena.biomeId = BiomeId.MOUNTAIN;
    game.move.use(MoveId.NATURE_POWER);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.AIR_SLASH);
  });

  it("applies correctly even if the pokemon's move is delayed / charging", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.DIG);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.DIG);
  });

  it("applies correctly even if the pokemon's move misses", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TACKLE);
    await game.move.forceMiss();
    await game.toEndOfTurn();

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.isFullHp()).toBe(true);
    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  it("applies correctly even if the pokemon's move is protected against", async () => {
    game.override.enemyMoveset(MoveId.PROTECT);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  it("applies correctly even if the pokemon's move fails because of type immunity", async () => {
    game.override.enemySpecies(SpeciesId.GASTLY);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TACKLE);
  });

  it("is not applied if pokemon's type is the same as the move's type", async () => {
    await game.classicMode.startBattle([SpeciesId.SNORLAX]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(ability);
  });

  it("is not applied if pokemon's modified type is the same as the move's type", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    leadPokemon.summonData.types = [allMoves.get(MoveId.SPLASH).type];
    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(ability);
  });

  it("is not applied if pokemon is terastallized", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();
    game.field.forceTera(leadPokemon);

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(ability);
  });

  it("is not applied if pokemon uses struggle", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.STRUGGLE);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(ability);
  });

  it("is not applied if the pokemon's move fails", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.BURN_UP);
    await game.toEndOfTurn();

    expect(leadPokemon.summonData.abilitiesApplied).not.toContain(ability);
  });

  it("applies correctly even if the pokemon's Trick-or-Treat fails", async () => {
    game.override.enemySpecies(SpeciesId.GASTLY);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TRICK_OR_TREAT);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.TRICK_OR_TREAT);
  });

  it("applies correctly and the pokemon curses itself", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const leadPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.CURSE);
    await game.toEndOfTurn();

    testPokemonTypeMatchesDefaultMoveType(leadPokemon, MoveId.CURSE);
    expect(leadPokemon.getTag(BattlerTagType.CURSED)).not.toBe(undefined);
  });

  function testPokemonTypeMatchesDefaultMoveType(pokemon: PlayerPokemon, moveId: MoveId) {
    expect(pokemon.summonData.abilitiesApplied).toContain(ability);
    expect(pokemon.getTypes()).toHaveLength(1);
    const pokemonType = ElementalType[pokemon.getTypes()[0]],
      moveType = ElementalType[allMoves.get(moveId).type];
    expect(pokemonType).toBe(moveType);
  }
});
