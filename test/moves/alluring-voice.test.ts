import { BattlerIndex } from "#enums/battler-index";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.ICE_SCALES)
      .enemyMoveset([MoveId.HOWL])
      .startingLevel(10)
      .enemyLevel(10)
      .starterSpecies(SpeciesId.FEEBAS)
      .ability(AbilityId.BALL_FETCH)
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
