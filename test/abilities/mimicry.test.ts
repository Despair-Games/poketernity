import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Mimicry", () => {
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
      .ability(AbilityId.MIMICRY)
      .battleType("single")
      .disableCrits()
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it("Mimicry activates after the Pokémon with Mimicry is switched in while terrain is present, or whenever there is a change in terrain", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.ABRA);

    const [feebas, abra] = game.scene.getPlayerParty();
    game.move.use(MoveId.MISTY_TERRAIN);
    await game.toNextTurn();
    expect(feebas.getTypes()).toEqual([ElementalType.FAIRY]);

    game.switchPokemon(1);
    await game.toNextTurn();

    expect(abra.getTypes()).toEqual([ElementalType.FAIRY]);
  });

  it("Pokemon should revert back to its original, root type once terrain ends", async () => {
    await game.classicMode.startBattle(SpeciesId.REGIELEKI);

    const regieleki = game.field.getPlayerPokemon();
    game.move.use(MoveId.PSYCHIC_TERRAIN);
    await game.toNextTurn();
    expect(regieleki.getTypes()).toEqual([ElementalType.PSYCHIC]);

    game.scene.arena.terrain!.turnsLeft = 1;

    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    expect(regieleki.getTypes()).toEqual([ElementalType.ELECTRIC]);
  });

  it("If the Pokemon is under the effect of a type-adding move and an equivalent terrain activates, the move's effect disappears", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const feebas = game.field.getPlayerPokemon();
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.FORESTS_CURSE);
    await game.toNextTurn();

    expect(feebas.summonData.addedType).toBe(ElementalType.GRASS);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.GRASSY_TERRAIN);
    await game.toEndOfTurn();

    expect(feebas.summonData.addedType).toBeNull();
    expect(feebas.getTypes()).toEqual([ElementalType.GRASS]);
  });
});
