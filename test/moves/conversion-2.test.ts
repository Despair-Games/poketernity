import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Conversion 2", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should change the user's type to a type that resists the target's most recent move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    const playerTypes = player.getTypes();
    expect(playerTypes).toHaveLength(1);
    // player's type should resist Normal
    expect(playerTypes[0]).toBeOneOf([ElementalType.ROCK, ElementalType.STEEL, ElementalType.GHOST]);
  });

  it("should change the user's type based on the called move if the target last used Nature Power", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.scene.arena.trySetTerrain(TerrainType.MISTY, false, true);

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.NATURE_POWER);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    const playerTypes = player.getTypes();
    expect(playerTypes).toHaveLength(1);
    // player's type should resist Fairy (Nature Power in Misty Terrain => Moonblast)
    expect(playerTypes[0]).toBeOneOf([ElementalType.STEEL, ElementalType.POISON, ElementalType.FIRE]);
  });

  it.each([
    {
      moveType: "Fairy",
      ability: AbilityId.PIXILATE,
      abilityName: "Pixilate",
      resistingTypes: [ElementalType.STEEL, ElementalType.POISON, ElementalType.FIRE],
    },
    {
      moveType: "Electric",
      ability: AbilityId.GALVANIZE,
      abilityName: "Galvanize",
      resistingTypes: [ElementalType.GRASS, ElementalType.ELECTRIC, ElementalType.DRAGON, ElementalType.GROUND],
    },
    {
      moveType: "Flying",
      ability: AbilityId.AERILATE,
      abilityName: "Aerilate",
      resistingTypes: [ElementalType.ROCK, ElementalType.STEEL, ElementalType.ELECTRIC],
    },
    {
      moveType: "Ice",
      ability: AbilityId.REFRIGERATE,
      abilityName: "Refrigerate",
      resistingTypes: [ElementalType.STEEL, ElementalType.FIRE, ElementalType.ICE],
    },
  ])(
    "should change the user's type to resist $moveType if the target's last move was affected by $abilityName",
    async ({ ability, resistingTypes }) => {
      game.override.enemyAbility(ability);

      await game.classicMode.startBattle([SpeciesId.FEEBAS]);

      const player = game.field.getPlayerPokemon();

      game.move.use(MoveId.CONVERSION_2);
      await game.move.forceEnemyMove(MoveId.TACKLE);
      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

      await game.toEndOfTurn();

      const playerTypes = player.getTypes();
      expect(playerTypes).toHaveLength(1);
      expect(playerTypes[0]).toBeOneOf(resistingTypes);
    },
  );

  it("should change the user's type according to the target move's changed type, if applicable", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.REVELATION_DANCE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    const playerTypes = player.getTypes();
    expect(playerTypes).toHaveLength(1);
    // player's type should resist Water (not including Water type)
    expect(playerTypes[0]).toBeOneOf([ElementalType.GRASS, ElementalType.DRAGON]);
  });

  it("should fail if the target's last move was typeless", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(enemy, "getMoveType").mockReturnValue(ElementalType.UNKNOWN);

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(player.isOfType(ElementalType.WATER)).toBeTruthy();
  });

  it("should fail if the target's last move was Stellar-type", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    vi.spyOn(enemy, "getMoveType").mockReturnValue(ElementalType.STELLAR);

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(player.isOfType(ElementalType.WATER)).toBeTruthy();
  });

  it("should fail if the user is already of all types that resist the target's last move", async () => {
    await game.classicMode.startBattle([SpeciesId.OBSTAGOON]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.SHADOW_SNEAK);

    await game.toEndOfTurn();

    // Ghost is resisted only by Dark and Normal. Obstagoon is of both types.
    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(player.getTypes()).toEqual([ElementalType.DARK, ElementalType.NORMAL]);
  });

  it("should account for Inverse Challenge when determining a resisting type", async () => {
    game.challengeMode.addChallenge(Challenges.INVERSE_BATTLE, 1, 1);

    await game.challengeMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.CONVERSION_2);
    await game.move.forceEnemyMove(MoveId.DRAGON_CLAW);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(player.getTypes()).toHaveLength(1);
    expect(player.isOfType(ElementalType.DRAGON)).toBeTruthy();
  });
});
