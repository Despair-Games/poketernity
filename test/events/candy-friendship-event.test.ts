import { GameManager } from "#test/test-utils/gameManager";
import { describe, beforeAll, afterEach, vi, beforeEach, it, expect } from "vitest";
import { timedEventManager } from "#app/timed-event-manager";
import type { TimedEvent } from "#app/@types/TimedEvent";
import { EventModifierType } from "#enums/event-modifier-type";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import { MoveId } from "#enums/move-id";
import { CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER, FRIENDSHIP_GAIN_FROM_BATTLE } from "#app/data/balance/starters";
import { api } from "#app/plugins/api/api";

describe("Candy Friendship Modifier Event", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const duringEventDate = new Date(Date.UTC(2025, 5, 6, 12)); // 6th of June 2025, 12pm
  const postEventDate = new Date(Date.UTC(2025, 6, 7, 12)); // 7th of July 2025, 12pm

  const testEvents: TimedEvent[] = [
    {
      name: "Candy friendship Event",
      startDate: new Date(Date.UTC(2025, 5, 4, 0)), // June 4th
      endDate: new Date(Date.UTC(2025, 5, 10, 0)), // June 10th
      modifiers: {
        classicCandyFriendshipMultiplier: 3,
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
    game.override
      .battleType("single")
      .starterSpecies(SpeciesId.VENUSAUR)
      .startingLevel(100)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .timedEvents(testEvents, duringEventDate);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("should apply the active event's multiplier in classic mode", async () => {
    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeTruthy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(3);

    await game.classicMode.startBattle();
    const playerPokemon = game.field.getPlayerPokemon();
    const baseFriendship = playerPokemon.friendship;
    const starterData = game.scene.gameData.starterData[playerPokemon.species.getRootSpeciesId()];
    expect(starterData.candyProgress).toBe(0); // candy friendship

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("VictoryPhase", true);

    expect(playerPokemon.friendship).toBe(baseFriendship + FRIENDSHIP_GAIN_FROM_BATTLE);
    expect(starterData.candyProgress).toBe(FRIENDSHIP_GAIN_FROM_BATTLE * CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER * 3);
  });

  it("should not apply the event's multiplier when it is not active", async () => {
    vi.setSystemTime(postEventDate);
    expect(timedEventManager.getActiveEvent()).toBeUndefined();
    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeFalsy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(1);

    await game.classicMode.startBattle();
    const playerPokemon = game.field.getPlayerPokemon();
    const baseFriendship = playerPokemon.friendship;
    const starterData = game.scene.gameData.starterData[playerPokemon.species.getRootSpeciesId()];
    expect(starterData.candyProgress).toBe(0); // candy friendship

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("VictoryPhase", true);

    expect(playerPokemon.friendship).toBe(baseFriendship + FRIENDSHIP_GAIN_FROM_BATTLE);
    expect(starterData.candyProgress).toBe(FRIENDSHIP_GAIN_FROM_BATTLE * CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER);
  });

  it("should not apply the event's multiplier in daily mode", async () => {
    vi.spyOn(api.daily, "getSeed").mockResolvedValue("test-seed");
    await api.ping();

    expect(timedEventManager.getActiveEvent()).toBeDefined();
    expect(timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)).toBeTruthy();
    expect(timedEventManager.getClassicCandyFriendshipMultiplier()).toBe(3);

    await game.dailyMode.startBattle();
    const playerPokemon = game.field.getPlayerPokemon();
    const baseFriendship = playerPokemon.friendship;
    const starterData = game.scene.gameData.starterData[playerPokemon.species.getRootSpeciesId()];
    expect(starterData.candyProgress).toBe(0); // candy friendship

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("VictoryPhase", true);

    expect(playerPokemon.friendship).toBe(baseFriendship + FRIENDSHIP_GAIN_FROM_BATTLE);
    expect(starterData.candyProgress).toBe(FRIENDSHIP_GAIN_FROM_BATTLE);
  });
});
