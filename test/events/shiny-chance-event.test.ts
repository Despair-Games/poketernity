import { GameManager } from "#test/testUtils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";
import { timedEventManager } from "#app/timed-event-manager";
import type { TimedEvent } from "#app/@types/TimedEvent";
import { EventModifierType } from "#enums/event-modifier-type";
import { Egg } from "#app/data/egg";

describe("Shiny Chance Modifier Event", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const duringEventDate = new Date(Date.UTC(2025, 5, 6, 12)); // 6th of June 2025, 12pm

  const testEvents: TimedEvent[] = [
    {
      name: "Shiny Event",
      startDate: new Date(Date.UTC(2025, 5, 4, 0)), // June 4th
      endDate: new Date(Date.UTC(2025, 5, 10, 0)), // June 10th
      modifiers: {
        wildShinyMultiplier: 9000,
      },
    },
  ];

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    game.override.disableShinies = false; // Keep random shinies
    game.override.timedEvents(testEvents, duringEventDate);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("should apply the active event's shiny chance modifier to wild encounters", async () => {
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)).toBeTruthy();
    expect(timedEventManager.getWildShinyChanceMultiplier()).toBe(9000);

    await game.classicMode.startBattle();
    expect(game.field.getEnemyPokemon().isShiny()).toBeTruthy();
  });

  it("should not apply the active event's shiny chance modifier to eggs", async () => {
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)).toBeTruthy();
    expect(timedEventManager.getWildShinyChanceMultiplier()).toBe(9000);

    let nonShinies = 0;
    for (let i = 0; i < 10; i++) {
      const egg = new Egg();
      if (!egg.isShiny) {
        nonShinies += 1;
      }
    }
    expect(nonShinies).toBeGreaterThan(0);
  });
});
