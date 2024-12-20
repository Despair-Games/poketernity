import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Battle Armor", () => {
  // This test also provides coverage for Shell Armor, which functions identically to Battle Armor
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.BATTLE_ARMOR)
      .startingLevel(50)
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.WICKED_BLOW);
  });

  it("Battle Armor prevents critical hits, even gauranteed ones", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.SPLASH);
    await game.move.forceHit();
    await game.setTurnOrder[(BattlerIndex.ENEMY, BattlerIndex.PLAYER)];
    await game.phaseInterceptor.to("BerryPhase");

    const lastAttackReceived = playerPokemon?.turnData.attacksReceived[0];
    expect(lastAttackReceived?.isCritical).toBe(false);
  });
});
