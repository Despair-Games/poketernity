import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import Phaser from "phaser";
import { GameManager } from "#test/test-utils/gameManager";
import { Species } from "#enums/species";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";

describe("Moves - Speed Swap", () => {
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
      .enemyAbility(Abilities.NONE)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(Species.MEW)
      .enemyLevel(200)
      .moveset([MoveId.SPEED_SWAP])
      .ability(Abilities.NONE);
  });

  it("should swap the user's SPD and the target's SPD stats", async () => {
    await game.startBattle([Species.INDEEDEE]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    const playerSpd = player.getStat(Stat.SPD, false);
    const enemySpd = enemy.getStat(Stat.SPD, false);

    game.move.select(MoveId.SPEED_SWAP);
    await game.phaseInterceptor.to(TurnEndPhase);

    expect(player.getStat(Stat.SPD, false)).toBe(enemySpd);
    expect(enemy.getStat(Stat.SPD, false)).toBe(playerSpd);
  }, 20000);
});
