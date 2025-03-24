import { BattlerTagType } from "#enums/battler-tag-type";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveResult } from "#enums/move-result";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

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
  ])("should not hit a flying target: $name (=$move)", async ({ moveId }) => {
    await game.classicMode.startBattle([SpeciesId.STARAPTOR]);

    const staraptor = game.field.getPlayerPokemon();

    game.move.use(moveId);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);

    await game.toEndOfTurn();

    expect(staraptor.findTag((t) => t.tagType === BattlerTagType.FLYING)).toBeDefined();
    expect(game.scene.getEnemyPokemon()!.getLastXMoves(1)[0].result).toBe(MoveResult.MISS);
  });

  it("should not hit a target carried by Sky Drop", async () => {
    game.override.battleType("double").moveset([MoveId.SKY_DROP, MoveId.WHIRLWIND]).enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle([SpeciesId.STARAPTOR, SpeciesId.PIDGEOT]);

    const [staraptor, pidgeot] = game.scene.getPlayerField()!;
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.WHIRLWIND, 1, BattlerIndex.ENEMY);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.toEndOfTurn();

    [staraptor, enemyPokemon[0]].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());
    expect(pidgeot.getLastXMoves()[0]?.result).toBe(MoveResult.MISS);
  });

  it("should force switches randomly", async () => {
    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE]);

    const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();

    // Turn 1: Mock an RNG call that calls for switching to 1st backup Pokemon (Charmander)
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((_range, min: number = 0) => {
      return min;
    });
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    await game.toNextTurn();

    expect(bulbasaur.isOnField()).toBe(false);
    expect(charmander.isOnField()).toBe(true);
    expect(squirtle.isOnField()).toBe(false);

    // Turn 2: Mock an RNG call that calls for switching to 2nd backup Pokemon (Squirtle)
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((_range, min: number = 0) => {
      return min + 1;
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
    game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.WATER + 1, 0);
    await game.challengeMode.startBattle([SpeciesId.LAPRAS, SpeciesId.EEVEE, SpeciesId.TOXAPEX, SpeciesId.PRIMARINA]);

    const [lapras, eevee, toxapex, primarina] = game.scene.getPlayerParty();

    // Turn 1: Mock an RNG call that would normally call for switching to Eevee, but it is ineligible
    vi.spyOn(game.scene, "randBattleSeedInt").mockImplementation((_range, min: number = 0) => {
      return min;
    });
    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.WHIRLWIND);
    await game.toNextTurn();

    expect(lapras.isOnField()).toBe(false);
    expect(eevee.isOnField()).toBe(false);
    expect(toxapex.isOnField()).toBe(true);
    expect(primarina.isOnField()).toBe(false);
  });

  it("should not force a switch to a fainted Pokemon", async () => {
    await game.classicMode.startBattle([SpeciesId.LAPRAS, SpeciesId.EEVEE, SpeciesId.TOXAPEX, SpeciesId.PRIMARINA]);

    const [lapras, eevee, toxapex, primarina] = game.scene.getPlayerParty();

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

    expect(lapras.isOnField()).toBe(false);
    expect(eevee.isOnField()).toBe(false);
    expect(toxapex.isOnField()).toBe(true);
    expect(primarina.isOnField()).toBe(false);
  });

  it("should not force a switch if there are no available Pokemon to switch into", async () => {
    await game.classicMode.startBattle([SpeciesId.LAPRAS, SpeciesId.EEVEE]);

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
