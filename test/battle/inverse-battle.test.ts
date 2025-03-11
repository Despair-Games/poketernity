import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Challenges } from "#enums/challenges";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Inverse Battle", () => {
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

    game.challengeMode.addChallenge(Challenges.INVERSE_BATTLE, 1, 1);

    game.override
      .battleType("single")
      .starterSpecies(Species.FEEBAS)
      .ability(Abilities.BALL_FETCH)
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("Immune types are 2x effective - Thunderbolt against Ground Type", async () => {
    game.override.moveset([MoveId.THUNDERBOLT]).enemySpecies(Species.SANDSHREW);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.THUNDERBOLT);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("2x effective types are 0.5x effective - Thunderbolt against Flying Type", async () => {
    game.override.moveset([MoveId.THUNDERBOLT]).enemySpecies(Species.PIDGEY);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.THUNDERBOLT);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(0.5);
  });

  it("0.5x effective types are 2x effective - Thunderbolt against Electric Type", async () => {
    game.override.moveset([MoveId.THUNDERBOLT]).enemySpecies(Species.CHIKORITA);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.THUNDERBOLT);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("Stealth Rock follows the inverse matchups - Stealth Rock against Charizard deals 1/32 of max HP", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 0, 1, MoveId.STEALTH_ROCK);
    game.override.enemySpecies(Species.CHARIZARD).enemyLevel(100);

    await game.challengeMode.startBattle();

    const charizard = game.scene.getEnemyPokemon()!;

    const maxHp = charizard.getMaxHp();
    const damage_prediction = Math.max(Math.round(charizard.getMaxHp() / 32), 1);
    console.log("Damage calcuation before round: " + charizard.getMaxHp() / 32);
    const currentHp = charizard.hp;
    const expectedHP = maxHp - damage_prediction;

    console.log(
      "Charizard's max HP: " + maxHp,
      "Damage: " + damage_prediction,
      "Current HP: " + currentHp,
      "Expected HP: " + expectedHP,
    );
    expect(currentHp).toBeGreaterThan((maxHp * 31) / 32 - 1);
  });

  it("Freeze Dry is 2x effective against Water Type like other Ice type Move - Freeze Dry against Squirtle", async () => {
    game.override.moveset([MoveId.FREEZE_DRY]).enemySpecies(Species.SQUIRTLE);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.FREEZE_DRY);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("Water Absorb should heal against water moves - Water Absorb against Water gun", async () => {
    game.override.moveset([MoveId.WATER_GUN]).enemyAbility(Abilities.WATER_ABSORB);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = enemy.getMaxHp() - 1;
    game.move.select(MoveId.WATER_GUN);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("Fire type does not get burned - Will-O-Wisp against Charmander", async () => {
    game.override.moveset([MoveId.WILL_O_WISP]).enemySpecies(Species.CHARMANDER);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.WILL_O_WISP);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.getStatusEffect(true)).not.toBe(StatusEffect.BURN);
  });

  it("Electric type does not get paralyzed - Nuzzle against Pikachu", async () => {
    game.override.moveset([MoveId.NUZZLE]).enemySpecies(Species.PIKACHU).enemyLevel(50);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.NUZZLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.getStatusEffect(true)).not.toBe(StatusEffect.PARALYSIS);
  });

  it("Ground type is not immune to Thunder Wave - Thunder Wave against Sandshrew", async () => {
    game.override.moveset([MoveId.THUNDER_WAVE]).enemySpecies(Species.SANDSHREW);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
  });

  it("Anticipation should trigger on 2x effective moves - Anticipation against Thunderbolt", async () => {
    game.override.moveset([MoveId.THUNDERBOLT]).enemySpecies(Species.SANDSHREW).enemyAbility(Abilities.ANTICIPATION);

    await game.challengeMode.startBattle();

    expect(game.scene.getEnemyPokemon()?.summonData.abilitiesApplied[0]).toBe(Abilities.ANTICIPATION);
  });

  it("Conversion 2 should change the type to the resistive type - Conversion 2 against Dragonite", async () => {
    game.override
      .moveset([MoveId.CONVERSION_2])
      .enemyMoveset([MoveId.DRAGON_CLAW, MoveId.DRAGON_CLAW, MoveId.DRAGON_CLAW, MoveId.DRAGON_CLAW]);

    await game.challengeMode.startBattle();

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.CONVERSION_2);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.toEndOfTurn();

    expect(player.getTypes()[0]).toBe(ElementalType.DRAGON);
  });

  it("Flying Press should be 0.25x effective against Grass + Dark Type - Flying Press against Meowscarada", async () => {
    game.override.moveset([MoveId.FLYING_PRESS]).enemySpecies(Species.MEOWSCARADA);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.FLYING_PRESS);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(0.25);
  });

  it("Scrappy ability has no effect - Tackle against Ghost Type still 2x effective with Scrappy", async () => {
    game.override.moveset([MoveId.TACKLE]).ability(Abilities.SCRAPPY).enemySpecies(Species.GASTLY);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("FORESIGHT has no effect - Tackle against Ghost Type still 2x effective with Foresight", async () => {
    game.override.moveset([MoveId.FORESIGHT, MoveId.TACKLE]).enemySpecies(Species.GASTLY);

    await game.challengeMode.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.move.select(MoveId.FORESIGHT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    game.move.select(MoveId.TACKLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });
});
