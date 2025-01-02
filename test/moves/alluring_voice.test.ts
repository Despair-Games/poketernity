import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryPhase } from "#app/phases/berry-phase";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.ICE_SCALES)
      .enemyMoveset([Moves.HOWL])
      .startingLevel(10)
      .enemyLevel(10)
      .starterSpecies(Species.FEEBAS)
      .ability(Abilities.BALL_FETCH)
      .moveset([Moves.ALLURING_VOICE]);
  });

  it("should confuse the opponent if their stat stages were raised", async () => {
    await game.classicModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.ALLURING_VOICE);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to(BerryPhase);

    expect(enemy.getTag(BattlerTagType.CONFUSED)?.tagType).toBe("CONFUSED");
  });
});
