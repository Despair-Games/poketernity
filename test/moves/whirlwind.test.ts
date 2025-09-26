import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import * as RandomUtils from "#utils/random-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Whirlwind", () => {
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
    game.override.battleType("single").enemyAbility(AbilityId.BALL_FETCH).enemySpecies(SpeciesId.PIDGEY);
  });

  it.each([
    { moveId: MoveId.FLY, name: "Fly" },
    { moveId: MoveId.BOUNCE, name: "Bounce" },
  ])("should not hit a flying target: $name", async ({ moveId }) => {
    await game.classicMode.startBattle(SpeciesId.STARAPTOR, SpeciesId.SWELLOW);

    const staraptor = game.field.getPlayerPokemon();

    game.move.use(moveId);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);

    await game.toEndOfTurn();

    expect(staraptor).toHaveBattlerTag(BattlerTagType.MID_AIR);
    expect(game.field.getEnemyPokemon()).toHaveMoveResult(MoveResult.MISS);
  });

  it("should not hit a target carried by Sky Drop", async () => {
    game.override.battleType("double").moveset([MoveId.SKY_DROP, MoveId.WHIRLWIND]).enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle(SpeciesId.STARAPTOR, SpeciesId.PIDGEOT);

    const [staraptor, pidgeot] = game.scene.getPlayerField()!;
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.WHIRLWIND, 1, BattlerIndex.ENEMY);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.toEndOfTurn();

    [staraptor, enemyPokemon[0]].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(pidgeot).toHaveMoveResult(MoveResult.MISS);
  });

  it("should force switches randomly", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE);

    const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();

    // Turn 1: Mock an RNG call that calls for switching to 1st backup Pokemon (Charmander)
    vi.spyOn(RandomUtils, "randSeedItem").mockImplementation((items) => {
      return items.at(0);
    });
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    await game.toNextTurn();

    expect(bulbasaur.isOnField()).toBe(false);
    expect(charmander.isOnField()).toBe(true);
    expect(squirtle.isOnField()).toBe(false);

    // Turn 2: Mock an RNG call that calls for switching to 2nd backup Pokemon (Squirtle)
    vi.spyOn(RandomUtils, "randSeedItem").mockImplementation((items) => {
      return items.at(-1);
    });
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    await game.toNextTurn();

    expect(bulbasaur.isOnField()).toBe(false);
    expect(charmander.isOnField()).toBe(false);
    expect(squirtle.isOnField()).toBe(true);
  });

  it("should not force a switch to a challenge-ineligible Pokemon", async () => {
    // Mono-Water challenge, Eevee is ineligible
    game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.WATER, 0);
    await game.challengeMode.startBattle(SpeciesId.LAPRAS, SpeciesId.EEVEE, SpeciesId.TOXAPEX, SpeciesId.PRIMARINA);

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    vi.spyOn(RandomUtils, "randSeedItem");

    await game.toNextTurn();

    // Eevee's index should not have been included in the switch-in pool
    expect(RandomUtils.randSeedItem).not.toHaveBeenCalledWith(expect.arrayContaining([1]));
  });

  it("should not force a switch to a fainted Pokemon", async () => {
    await game.classicMode.startBattle(SpeciesId.LAPRAS, SpeciesId.EEVEE, SpeciesId.TOXAPEX, SpeciesId.PRIMARINA);

    const eevee = game.scene.getPlayerParty()[1];

    // Turn 1: Eevee faints
    eevee.faint();
    expect(eevee.isFainted()).toBe(true);
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    // Turn 2: Mock an RNG call that would normally call for switching to Eevee, but it is fainted
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    vi.spyOn(RandomUtils, "randSeedItem");

    await game.toNextTurn();

    // Eevee's index should not have been included in the switch-in pool
    expect(RandomUtils.randSeedItem).not.toHaveBeenCalledWith(expect.arrayContaining([1]));
  });

  it("should not force a switch if there are no available Pokemon to switch into", async () => {
    await game.classicMode.startBattle(SpeciesId.LAPRAS, SpeciesId.EEVEE);

    const [lapras, eevee] = game.scene.getPlayerParty();

    // Turn 1: Eevee faints
    eevee.faint();
    expect(eevee.isFainted()).toBe(true);
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    // Turn 2: Mock an RNG call that would normally call for switching to Eevee, but it is fainted
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((_range, min: number = 0) => {
      return min;
    });
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    await game.toNextTurn();

    expect(lapras.isOnField()).toBe(true);
    expect(eevee.isOnField()).toBe(false);
  });
});
