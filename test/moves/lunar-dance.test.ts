import { StatusEffect } from "#enums/status-effect";
import { CommandPhase } from "#app/phases/command-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import { ArenaTagType } from "#enums/arena-tag-type";

describe("Moves - Lunar Dance", () => {
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

  it("should full restore HP, PP and status of switched in pokemon, then fail second use because no remaining backup pokemon in party", async () => {
    game.override.statusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.ODDISH, SpeciesId.RATTATA]);

    const [bulbasaur, oddish, rattata] = game.scene.getPlayerParty();
    game.move.changeMoveset(bulbasaur, [MoveId.LUNAR_DANCE, MoveId.SPLASH]);
    game.move.changeMoveset(oddish, [MoveId.LUNAR_DANCE, MoveId.SPLASH]);
    game.move.changeMoveset(rattata, [MoveId.LUNAR_DANCE, MoveId.SPLASH]);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.SPLASH, 1);
    await game.phaseInterceptor.to(CommandPhase);
    await game.toNextTurn();

    // Bulbasaur should still be burned and have used a PP for splash and not at max hp
    expect(bulbasaur.getStatusEffect(true)).toBe(StatusEffect.BURN);
    expect(bulbasaur.moveset[1]?.ppUsed).toBe(1);
    expect(bulbasaur.hp).toBeLessThan(bulbasaur.getMaxHp());

    // Switch out Bulbasaur for Rattata so we can swtich bulbasaur back in with lunar dance
    game.switchPokemon(2);
    game.move.select(MoveId.SPLASH, 1);
    await game.phaseInterceptor.to(CommandPhase);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(2);
    await game.phaseInterceptor.to("SwitchPhase", false);
    await game.toNextTurn();

    // Bulbasaur should NOT have any status and have full PP for splash and be at max hp
    expect(bulbasaur.getStatusEffect(true)).toBe(StatusEffect.NONE);
    expect(bulbasaur.moveset[1]?.ppUsed).toBe(0);
    expect(bulbasaur.isFullHp()).toBe(true);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.LUNAR_DANCE);
    await game.phaseInterceptor.to(CommandPhase);
    await game.toNextTurn();

    // Using Lunar dance again should fail because nothing in party and rattata should be alive
    expect(rattata.getStatusEffect(true)).toBe(StatusEffect.BURN);
    expect(rattata.hp).toBeLessThan(rattata.getMaxHp());
  });

  it("should fail if no allowed allies", async () => {
    game.override.battleType("single");
    // Mono normal challenge
    game.challengeMode.addChallenge(Challenges.SINGLE_TYPE, ElementalType.NORMAL + 1, 0);
    await game.challengeMode.startBattle([SpeciesId.RATICATE, SpeciesId.ODDISH]);

    const [raticate, oddish] = game.scene.getPlayerParty();
    game.move.changeMoveset(raticate, [MoveId.LUNAR_DANCE, MoveId.SPLASH]);
    game.move.changeMoveset(oddish, [MoveId.LUNAR_DANCE, MoveId.SPLASH]);

    game.move.select(MoveId.LUNAR_DANCE);
    await game.toNextTurn();

    expect(raticate.isFullHp()).toBe(true);
  });

  it("should store its effect if the switched-in Pokemon is perfectly healthy", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.CHARMANDER, SpeciesId.SQUIRTLE]);

    const [bulbasaur, charmander, squirtle] = game.scene.getPlayerParty();
    squirtle.hp = 1;

    game.move.use(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(1);

    await game.toEndOfTurn();

    expect(bulbasaur.isFainted()).toBeTruthy();
    expect(charmander.isFullHp()).toBeTruthy();
    expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeDefined();

    await game.toNextTurn();

    // Switch to damaged Squirtle. Lunar Dance's effect should activate
    game.switchPokemon(2);

    await game.toEndOfTurn();

    expect(squirtle.isFullHp()).toBeTruthy();
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeUndefined();

    // Set Charmander's HP to 1, then switch back to Charmander.
    // Lunar Dance shouldn't activate again
    charmander.hp = 1;
    game.switchPokemon(2);

    await game.toEndOfTurn();
    expect(charmander.hp).toBe(1);
  });

  it("should only store one charge of the effect at a time", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle([
      SpeciesId.BULBASAUR,
      SpeciesId.CHARMANDER,
      SpeciesId.SQUIRTLE,
      SpeciesId.PIKACHU,
    ]);

    const [bulbasaur, charmander, squirtle, pikachu] = game.scene.getPlayerParty();
    [squirtle, pikachu].forEach((p) => (p.hp = 1));

    // Use Lunar Dance and send in Charmander. Lunar Dance's effect should be stored
    game.move.use(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(1);

    await game.toNextTurn();
    expect(bulbasaur.isFainted()).toBeTruthy();
    expect(charmander.isFullHp()).toBeTruthy();
    expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeDefined();

    // Switch to Squirtle. Lunar Dance should activate
    game.switchPokemon(2);

    await game.toEndOfTurn();
    expect(squirtle.isFullHp()).toBeTruthy();
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeUndefined();

    // Switch again to Pikachu. Lunar Dance's effect shouldn't be present
    game.switchPokemon(3);

    await game.toEndOfTurn();
    expect(pikachu.isFullHp()).toBeFalsy();
  });

  it("should stack with Healing Wish", async () => {
    game.override.battleType("single");

    await game.classicMode.startBattle([
      SpeciesId.BULBASAUR,
      SpeciesId.CHARMANDER,
      SpeciesId.SQUIRTLE,
      SpeciesId.PIKACHU,
    ]);

    const [bulbasaur, charmander, squirtle, pikachu] = game.scene.getPlayerParty();
    [squirtle, pikachu].forEach((p) => {
      p.hp = 1;
      p.getMoveset().forEach((mv) => (mv.ppUsed = 1));
    });

    game.move.use(MoveId.LUNAR_DANCE);
    game.selectPartyPokemon(1);

    await game.toNextTurn();
    expect(bulbasaur.isFainted()).toBeTruthy();
    expect(charmander.isFullHp()).toBeTruthy();
    expect(game.phaseInterceptor.log).not.toContain("PokemonHealPhase");
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeDefined();

    game.move.use(MoveId.HEALING_WISH);
    game.selectPartyPokemon(2);

    // Lunar Dance should apply first since it was used first, restoring Squirtle's HP and PP
    await game.toNextTurn();
    expect(squirtle.isFullHp()).toBeTruthy();
    squirtle.getMoveset().forEach((mv) => expect(mv.ppUsed).toBe(0));
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeDefined();

    game.switchPokemon(3);

    // Healing Wish should apply on the next switch, restoring Pikachu's HP
    await game.toEndOfTurn();
    expect(pikachu.isFullHp()).toBeTruthy();
    pikachu.getMoveset().forEach((mv) => expect(mv.ppUsed).toBe(1));
    expect(game.scene.arena.getTag(ArenaTagType.PENDING_HEAL)).toBeUndefined();
  });
});
