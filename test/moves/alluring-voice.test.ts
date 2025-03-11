import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Alluring Voice", () => {
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
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.ICE_SCALES)
      .enemyMoveset([MoveId.HOWL])
      .startingLevel(10)
      .enemyLevel(10)
      .starterSpecies(Species.FEEBAS)
      .ability(Abilities.BALL_FETCH)
      .moveset([MoveId.ALLURING_VOICE]);
  });

  it("should confuse the opponent if their stat stages were raised", async () => {
    await game.classicMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.ALLURING_VOICE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(enemy.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });
});
