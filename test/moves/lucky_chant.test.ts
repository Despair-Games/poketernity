import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GameManager } from "#test/testUtils/gameManager";

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

    game.overridesHelper
      .battleType("single")
      .moveset([Moves.LUCKY_CHANT, Moves.SPLASH, Moves.FOLLOW_ME])
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.INSOMNIA)
      .enemyMoveset([Moves.FLOWER_TRICK])
      .startingLevel(100)
      .enemyLevel(5);
  });

  it("should prevent critical hits from moves", async () => {
    await game.classicMode.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.LUCKY_CHANT);
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const lastAttackReceived = playerPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });

  it("should prevent critical hits against the user's ally", async () => {
    game.overridesHelper.battleType("double");

    await game.classicMode.startBattle([Species.CHARIZARD, Species.BLASTOISE]);

    const playerPokemon = game.scene.getPlayerField();

    game.moveHelper.select(Moves.FOLLOW_ME);
    game.moveHelper.select(Moves.LUCKY_CHANT, 1);
    await game.moveHelper.forceHit();
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const attacksReceivedA = playerPokemon[0].turnData.attacksReceived[0];
    const attacksReceivedB = playerPokemon[0].turnData.attacksReceived[1];
    expect(attacksReceivedA.isCritical).toBe(false);
    expect(attacksReceivedB.isCritical).toBe(false);
  });

  it("should prevent critical hits from field effects", async () => {
    game.overridesHelper.enemyMoveset([Moves.TACKLE]);

    await game.classicMode.startBattle([Species.CHARIZARD]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    enemyPokemon.addTag(BattlerTagType.ALWAYS_CRIT, 3, Moves.NONE, 0);

    game.moveHelper.select(Moves.LUCKY_CHANT);
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const lastAttackReceived = playerPokemon.turnData.attacksReceived[0];
    expect(lastAttackReceived.isCritical).toBe(false);
  });
});
