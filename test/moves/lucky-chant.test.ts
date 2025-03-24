import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GameManager } from "#test/test-utils/gameManager";

describe("Moves - Lucky Chant", () => {
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
      .moveset([MoveId.LUCKY_CHANT, MoveId.SPLASH, MoveId.FOLLOW_ME])
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyAbility(AbilityId.INSOMNIA)
      .enemyMoveset([MoveId.FLOWER_TRICK])
      .startingLevel(100)
      .enemyLevel(5);
  });

  it("should prevent critical hits from moves", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.LUCKY_CHANT);
    await game.move.forceHit();
    await game.toEndOfTurn();

    const lastAttackReceived = playerPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });

  it("should prevent critical hits against the user's ally", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.CHARIZARD, SpeciesId.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();

    game.move.select(MoveId.FOLLOW_ME);
    game.move.select(MoveId.LUCKY_CHANT, 1);
    await game.move.forceHit();
    await game.move.forceHit();
    await game.toEndOfTurn();

    const attacksReceivedA = playerPokemon[0].turnData.attacksReceived[0];
    const attacksReceivedB = playerPokemon[0].turnData.attacksReceived[1];
    expect(attacksReceivedA.isCritical).toBe(false);
    expect(attacksReceivedB.isCritical).toBe(false);
  });

  it("should prevent critical hits from field effects", async () => {
    game.override.enemyMoveset([MoveId.TACKLE]);

    await game.classicMode.startBattle([SpeciesId.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    enemyPokemon.addTag(BattlerTagType.ALWAYS_CRIT, 3, MoveId.NONE, 0);

    game.move.select(MoveId.LUCKY_CHANT);
    await game.move.forceHit();
    await game.toEndOfTurn();

    const lastAttackReceived = playerPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });
});
