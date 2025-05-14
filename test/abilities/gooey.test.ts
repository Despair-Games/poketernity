import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

const abilityCases = [
  { abilityName: "Gooey", ability: AbilityId.GOOEY },
  { abilityName: "Tangling Hair", ability: AbilityId.TANGLING_HAIR },
];

describe.each(abilityCases)("Abilities - $abilityName", ({ ability }) => {
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
      .moveset([MoveId.TACKLE, MoveId.EMBER, MoveId.DOUBLE_IRON_BASH])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should decrease the attacker's speed by 1 stage if the attacker uses a contact move", async () => {
    game.override.enemyAbility(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.field.getPlayerPokemon();

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const tackleMove = allMoves.get(MoveId.TACKLE);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(tackleMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(tackleMove.checkFlag(MoveFlags.MAKES_CONTACT, pokemon)).toBe(true);
    expect(pokemon.getStatStage(Stat.SPD)).toBe(-1);
  });

  it("should not activate if the attacker has the ability Long Reach and uses a contact move", async () => {
    game.override.ability(AbilityId.LONG_REACH).enemyAbility(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const tackleMove = allMoves.get(MoveId.TACKLE);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(tackleMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(tackleMove.checkFlag(MoveFlags.MAKES_CONTACT, pokemon, enemy)).toBe(false);
    expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
  });

  it("should not affect the attacker's speed if the attacker does not use a contact move", async () => {
    game.override.enemyAbility(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.field.getPlayerPokemon();

    game.move.select(MoveId.EMBER);
    await game.toEndOfTurn();

    const emberMove = allMoves.get(MoveId.EMBER);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(emberMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(false);
    expect(emberMove.checkFlag(MoveFlags.MAKES_CONTACT, pokemon)).toBe(false);
    expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
  });

  it("$abilityName should activate per hit of a contact-making multi-strike move", async () => {
    game.override.enemyAbility(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.field.getPlayerPokemon();

    game.move.select(MoveId.DOUBLE_IRON_BASH);
    await game.toEndOfTurn();

    const doubleIronBashMove = allMoves.get(MoveId.DOUBLE_IRON_BASH);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(doubleIronBashMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(doubleIronBashMove.checkFlag(MoveFlags.MAKES_CONTACT, pokemon)).toBe(true);
    expect(pokemon.getStatStage(Stat.SPD)).toBe(-2);
  });
});
