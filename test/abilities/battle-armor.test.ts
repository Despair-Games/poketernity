import { BattlerIndex } from "#enums/battler-index";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Battle Armor/Shell Armor", () => {
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
      .moveset([MoveId.SPLASH])
      .startingLevel(50)
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.WICKED_BLOW);
  });

  it.each([
    { abilityName: "Battle Armor", ability: AbilityId.BATTLE_ARMOR },
    { abilityName: "Shell Armor", ability: AbilityId.SHELL_ARMOR },
  ])("$abilityName prevents all critical hits", async ({ ability }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();

    game.move.select(MoveId.SPLASH);
    await game.move.forceHit();
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    const lastAttackReceived = playerPokemon?.turnData.attacksReceived[0];
    expect(lastAttackReceived?.isCritical).toBe(false);
  });
});
