import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ReceivedMoveDamageMultiplierAbAttr } from "#app/data/ab-attrs/received-move-damage-multiplier-ab-attr";
import type { NumberHolder } from "#app/utils";

describe("Abilities - Punk Rock", () => {
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
      .moveset([MoveId.UPROAR])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.PUNK_ROCK)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should receive 50% less damage from sound-based moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(ReceivedMoveDamageMultiplierAbAttr)[0], "apply");

    game.move.select(MoveId.UPROAR);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(damageMultiplier).toBe(0.5);
  });
});
