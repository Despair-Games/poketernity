import { AbilityId } from "#enums/ability-id";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Lunar Dance and Healing Wish", () => {
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
    game.override.battleType("double").enemyAbility(AbilityId.BALL_FETCH).enemyMoveset(MoveId.SPLASH);
  });

  describe.each([
    { moveName: "Healing Wish", moveId: MoveId.HEALING_WISH },
    { moveName: "Lunar Dance", moveId: MoveId.LUNAR_DANCE },
  ])("$moveName", ({ moveId }) => {
    it("should sacrifice the user to restore the switched in Pokemon's HP", async () => {
      await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE);

      const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();
      squirtle.hp = 1;

      game.move.use(MoveId.SPLASH, 0);
      game.move.use(moveId, 1);
      game.selectPartyPokemon(2);

      await game.toNextTurn();

      expect(bulbasaur).toHaveFullHp();
      expect(charmander.isFainted()).toBeTruthy();
      expect(squirtle).toHaveFullHp();
    });

    it("should sacrifice the user to cure the switched in Pokemon's status", async () => {
      game.override.statusEffect(StatusEffect.BURN);

      await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE);
      const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();

      game.move.use(MoveId.SPLASH, 0);
      game.move.use(moveId, 1);
      game.selectPartyPokemon(2);

      await game.toNextTurn();

      expect(bulbasaur).toHaveStatusEffect(StatusEffect.BURN);
      expect(charmander.isFainted()).toBeTruthy();
      expect(squirtle).toHaveStatusEffect(StatusEffect.NONE);
    });

    it("should fail if the user has no non-fainted allies in their party", async () => {
      game.override.battleType("single");

      await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER);
      const [bulbasaur, charmander] = game.scene.getPlayerParty();

      game.move.use(MoveId.MEMENTO);
      game.selectPartyPokemon(1);

      await game.toNextTurn();

      expect(bulbasaur.isFainted()).toBeTruthy();
      expect(charmander.isActive(true)).toBeTruthy();

      game.move.use(moveId);

      await game.toEndOfTurn();

      expect(charmander).toHaveFullHp();
      expect(charmander).toHaveMoveResult(MoveResult.FAIL);
    });

    it("should fail if the user has no challenge-eligible allies", async () => {
      game.override.battleType("single");
      // Mono normal challenge
      game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.NORMAL + 1, 0);
      await game.challengeMode.startBattle(SpeciesId.RATICATE, SpeciesId.ODDISH);

      const [raticate] = game.scene.getPlayerParty();

      game.move.use(moveId);
      await game.toNextTurn();

      expect(raticate).toHaveFullHp();
      expect(raticate).toHaveMoveResult(MoveResult.FAIL);
    });

    it("should store its effect if the switched-in Pokemon is perfectly healthy", async () => {
      game.override.battleType("single");

      await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE);

      const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();
      squirtle.hp = 1;

      game.move.use(moveId);
      game.selectPartyPokemon(1);

      await game.toEndOfTurn();

      expect(bulbasaur.isFainted()).toBeTruthy();
      expect(charmander).toHaveFullHp();
      expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
      expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeTruthy();

      await game.toNextTurn();

      // Switch to damaged Squirtle. HW/LD's effect should activate
      game.switchPokemon(2);

      await game.toEndOfTurn();

      expect(squirtle).toHaveFullHp();
      expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeFalsy();

      // Set Charmander's HP to 1, then switch back to Charmander.
      // HW/LD shouldn't activate again
      charmander.hp = 1;
      game.switchPokemon(2);

      await game.toEndOfTurn();
      expect(charmander.hp).toBe(1);
    });

    it("should only store one charge of the effect at a time", async () => {
      game.override.battleType("single");

      await game.classicMode.startBattle(
        SpeciesId.BULBASAUR,
        SpeciesId.CHARMANDER,
        SpeciesId.SQUIRTLE,
        SpeciesId.PIKACHU,
      );

      const [bulbasaur, charmander, squirtle, pikachu] = game.scene.getPlayerParty();
      [squirtle, pikachu].forEach((p) => (p.hp = 1));

      // Use HW/LD and send in Charmander. HW/LD's effect should be stored
      game.move.use(moveId);
      game.selectPartyPokemon(1);

      await game.toNextTurn();
      expect(bulbasaur.isFainted()).toBeTruthy();
      expect(charmander).toHaveFullHp();
      expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
      expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeTruthy();

      // Use HW/LD again, sending in Squirtle. HW/LD should activate and heal Squirtle
      game.move.use(moveId);
      game.selectPartyPokemon(2);

      await game.toNextTurn();
      expect(charmander.isFainted()).toBeTruthy();
      expect(squirtle).toHaveFullHp();

      // Switch again to Pikachu. HW/LD's effect shouldn't be present
      game.switchPokemon(3);

      await game.toEndOfTurn();
      expect(pikachu).not.toHaveFullHp();
    });
  });

  it("Lunar Dance should sacrifice the user to restore the switched in Pokemon's PP", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle(SpeciesId.BULBASAUR, SpeciesId.CHARMANDER);
    const [bulbasaur, charmander] = game.scene.getPlayerParty();
    [bulbasaur, charmander].forEach((p) => game.move.changeMoveset(p, [MoveId.LUNAR_DANCE, MoveId.SPLASH]));

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.switchPokemon(1);
    await game.toNextTurn();

    game.move.select(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(1);

    await game.toNextTurn();
    expect(charmander.isFainted()).toBeTruthy();
    bulbasaur.getMoveset().forEach((mv) => expect(mv.ppUsed).toBe(0));
  });

  it("should stack with each other", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle(
      SpeciesId.BULBASAUR,
      SpeciesId.CHARMANDER,
      SpeciesId.SQUIRTLE,
      SpeciesId.PIKACHU,
    );

    const [bulbasaur, charmander, squirtle, pikachu] = game.scene.getPlayerParty();
    [squirtle, pikachu].forEach((p) => {
      p.hp = 1;
      p.getMoveset().forEach((mv) => (mv.ppUsed = 1));
    });

    game.move.use(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(1);

    await game.toNextTurn();
    expect(bulbasaur.isFainted()).toBeTruthy();
    expect(charmander).toHaveFullHp();
    expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
    expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeTruthy();

    game.move.use(MoveId.HEALING_WISH);
    game.selectPartyPokemon(2);

    // Lunar Dance should apply first since it was used first, restoring Squirtle's HP and PP
    await game.toNextTurn();
    expect(squirtle).toHaveFullHp();
    squirtle.getMoveset().forEach((mv) => expect(mv.ppUsed).toBe(0));
    expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeTruthy();

    game.switchPokemon(3);

    // Healing Wish should apply on the next switch, restoring Pikachu's HP
    await game.toEndOfTurn();
    expect(pikachu).toHaveFullHp();
    pikachu.getMoveset().forEach((mv) => expect(mv.ppUsed).toBe(1));
    expect(game.scene.arena.hasTag(ArenaTagType.PENDING_HEAL)).toBeFalsy();
  });
});
