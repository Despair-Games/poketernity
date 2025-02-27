import { GameManager } from "#test/testUtils/gameManager";
import { describe, beforeAll, afterEach, vi, it, expect, beforeEach } from "vitest";
import { timedEventManager } from "#app/timed-event-manager";
import type { TimedEvent } from "#app/@types/TimedEvent";
import { EventModifierType } from "#enums/event-modifier-type";

describe("Timed Event Manager", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const january1st = new Date(Date.UTC(2025, 0, 1, 12)); // 1sr of January 2025, 12pm
  const february2nd = new Date(Date.UTC(2025, 1, 2, 12)); // 2nd of February 2025, 12pm
  const march1st = new Date(Date.UTC(2025, 2, 1, 12)); // 1st of March 2025, 12pm
  const june6th = new Date(Date.UTC(2025, 5, 6, 12)); // 6th of June 2025, 12pm
  const june9th = new Date(Date.UTC(2025, 5, 9, 12)); // 9th of June 2025, 12pm
  const july10th = new Date(Date.UTC(2025, 6, 10, 12)); // 10th of July 2025, 12pm

  const testEvents: TimedEvent[] = [
    {
      name: "June 8-12 Event",
      startDate: new Date(Date.UTC(2025, 5, 8, 0)), // June 8th
      endDate: new Date(Date.UTC(2025, 5, 12, 0)), // June 12th
      modifiers: {
        wildShinyMultiplier: 2,
        classicCandyFriendshipMultiplier: 3,
        specialBattleRewards: true,
      },
      banner: {
        key: "juneBanner",
      },
    },
    {
      name: "February 1-3 Event",
      startDate: new Date(Date.UTC(2025, 1, 1, 0)), // February 1st
      endDate: new Date(Date.UTC(2025, 1, 3, 0)), // February 3rd
      modifiers: {
        classicCandyFriendshipMultiplier: 2,
        specialBattleRewards: true,
      },
      banner: {
        key: "februaryBanner",
      },
    },
    {
      name: "June 4-10 Event",
      startDate: new Date(Date.UTC(2025, 5, 4, 0)), // June 4th
      endDate: new Date(Date.UTC(2025, 5, 10, 0)), // June 10th
      modifiers: {
        wildShinyMultiplier: 9000,
      },
    },
    {
      name: "Invalid July 15th to July 14th Event",
      startDate: new Date(Date.UTC(2025, 6, 15, 0)), // July 15th
      endDate: new Date(Date.UTC(2025, 6, 14, 0)), // July 14th
      banner: {
        key: "invalidEventBanner",
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
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("should filter out past events and events with invalid dates at initialization", () => {
    game.override.timedEvents(testEvents, february2nd);
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.getActiveEvent(true)).toBeDefined(); // active event has a banner
    expect(timedEventManager.getActiveEvent()?.name).toBe("February 1-3 Event");

    // Re init manager with the same list, but a date past the February event
    game.override.timedEvents(testEvents, june6th);
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.getActiveEvent(true)).toBeUndefined(); // active event doesn't have a banner
    expect(timedEventManager.getActiveEvent()?.name).toBe("June 4-10 Event");

    // Go back to the February event date, the event should not be active
    vi.setSystemTime(february2nd);
    expect(timedEventManager.getActiveEvent()).toBeUndefined();

    // Go to a date after all valid events are done, there should be no upcoming event
    vi.setSystemTime(july10th);
    expect(timedEventManager.getActiveOrNextEventBanner()).toBeUndefined();
  });

  it("should retrieve the banner for the current or next event with one", () => {
    game.override.timedEvents(testEvents, january1st);

    expect(timedEventManager.getActiveEvent()).toBeUndefined();
    let eventBanner = timedEventManager.getActiveOrNextEventBanner();
    expect(eventBanner).toBeDefined();
    expect(eventBanner?.key).toBe("februaryBanner");

    vi.setSystemTime(february2nd);
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    eventBanner = timedEventManager.getActiveOrNextEventBanner();
    expect(eventBanner).toBeDefined();
    expect(eventBanner?.key).toBe("februaryBanner");

    vi.setSystemTime(march1st);
    expect(timedEventManager.getActiveEvent()).toBeUndefined();
    eventBanner = timedEventManager.getActiveOrNextEventBanner();
    expect(eventBanner).toBeDefined();
    expect(eventBanner?.key).toBe("juneBanner");

    vi.setSystemTime(june9th);
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    console.log(timedEventManager.getActiveEvent());
    eventBanner = timedEventManager.getActiveOrNextEventBanner();
    expect(eventBanner).toBeDefined();
    expect(eventBanner?.key).toBe("juneBanner");

    vi.setSystemTime(july10th);
    expect(timedEventManager.getActiveEvent()).toBeUndefined();
    expect(timedEventManager.getActiveOrNextEventBanner()).toBeUndefined();
  });

  it("should give the right property for ongoing events", () => {
    game.override.timedEvents(testEvents, february2nd);

    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.getActiveEvent()?.name).toBe("February 1-3 Event");

    expect(timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)).toBeFalsy();
    expect(timedEventManager.getWildShinyChanceMultiplier()).toBe(1);
    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeTruthy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(2);
    expect(timedEventManager.isEventActive(EventModifierType.EXTRA_TRAINER_REWARDS)).toBeTruthy();

    vi.setSystemTime(june6th);
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.getActiveEvent()?.name).toBe("June 4-10 Event");

    expect(timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)).toBeTruthy();
    expect(timedEventManager.getWildShinyChanceMultiplier()).toBe(9000);
    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeFalsy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(1);
    expect(timedEventManager.isEventActive(EventModifierType.EXTRA_TRAINER_REWARDS)).toBeFalsy();
  });

  it("should cumulate event modifiers if there are multiple active events", () => {
    game.override.timedEvents(testEvents, june9th);

    expect(timedEventManager.getActiveEvent()).toBeDefined();

    expect(timedEventManager.isEventActive(EventModifierType.WILD_SHINY_CHANCE)).toBeTruthy();
    expect(timedEventManager.getWildShinyChanceMultiplier()).toBe(18000);

    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeTruthy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(3);

    expect(timedEventManager.isEventActive(EventModifierType.EXTRA_TRAINER_REWARDS)).toBeTruthy();
  });
});
