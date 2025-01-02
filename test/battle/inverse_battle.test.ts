import { BattlerIndex } from "#app/battle";
import { Type } from "#enums/type";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Challenges } from "#enums/challenges";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
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

    game.challengeModeHelper.addChallenge(Challenges.INVERSE_BATTLE, 1, 1);

    game.overridesHelper
      .battleType("single")
      .starterSpecies(Species.FEEBAS)
      .ability(Abilities.BALL_FETCH)
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("Immune types are 2x effective - Thunderbolt against Ground Type", async () => {
    game.overridesHelper.moveset([Moves.THUNDERBOLT]).enemySpecies(Species.SANDSHREW);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.THUNDERBOLT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("2x effective types are 0.5x effective - Thunderbolt against Flying Type", async () => {
    game.overridesHelper.moveset([Moves.THUNDERBOLT]).enemySpecies(Species.PIDGEY);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.THUNDERBOLT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(0.5);
  });

  it("0.5x effective types are 2x effective - Thunderbolt against Electric Type", async () => {
    game.overridesHelper.moveset([Moves.THUNDERBOLT]).enemySpecies(Species.CHIKORITA);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.THUNDERBOLT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("Stealth Rock follows the inverse matchups - Stealth Rock against Charizard deals 1/32 of max HP", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 1, Moves.STEALTH_ROCK, 0);
    game.overridesHelper.enemySpecies(Species.CHARIZARD).enemyLevel(100);

    await game.challengeModeHelper.startBattle();

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
    game.overridesHelper.moveset([Moves.FREEZE_DRY]).enemySpecies(Species.SQUIRTLE);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.FREEZE_DRY);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("Water Absorb should heal against water moves - Water Absorb against Water gun", async () => {
    game.overridesHelper.moveset([Moves.WATER_GUN]).enemyAbility(Abilities.WATER_ABSORB);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    enemy.hp = enemy.getMaxHp() - 1;
    game.moveHelper.select(Moves.WATER_GUN);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.hp).toBe(enemy.getMaxHp());
  });

  it("Fire type does not get burned - Will-O-Wisp against Charmander", async () => {
    game.overridesHelper.moveset([Moves.WILL_O_WISP]).enemySpecies(Species.CHARMANDER);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.WILL_O_WISP);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.status?.effect).not.toBe(StatusEffect.BURN);
  });

  it("Electric type does not get paralyzed - Nuzzle against Pikachu", async () => {
    game.overridesHelper.moveset([Moves.NUZZLE]).enemySpecies(Species.PIKACHU).enemyLevel(50);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.NUZZLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.status?.effect).not.toBe(StatusEffect.PARALYSIS);
  });

  it("Ground type is not immune to Thunder Wave - Thunder Wave against Sandshrew", async () => {
    game.overridesHelper.moveset([Moves.THUNDER_WAVE]).enemySpecies(Species.SANDSHREW);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDER_WAVE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.moveHelper.forceHit();
    await game.phaseInterceptor.to("MoveEndPhase");

    expect(enemy.status?.effect).toBe(StatusEffect.PARALYSIS);
  });

  it("Anticipation should trigger on 2x effective moves - Anticipation against Thunderbolt", async () => {
    game.overridesHelper
      .moveset([Moves.THUNDERBOLT])
      .enemySpecies(Species.SANDSHREW)
      .enemyAbility(Abilities.ANTICIPATION);

    await game.challengeModeHelper.startBattle();

    expect(game.scene.getEnemyPokemon()?.summonData.abilitiesApplied[0]).toBe(Abilities.ANTICIPATION);
  });

  it("Conversion 2 should change the type to the resistive type - Conversion 2 against Dragonite", async () => {
    game.overridesHelper
      .moveset([Moves.CONVERSION_2])
      .enemyMoveset([Moves.DRAGON_CLAW, Moves.DRAGON_CLAW, Moves.DRAGON_CLAW, Moves.DRAGON_CLAW]);

    await game.challengeModeHelper.startBattle();

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.CONVERSION_2);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(player.getTypes()[0]).toBe(Type.DRAGON);
  });

  it("Flying Press should be 0.25x effective against Grass + Dark Type - Flying Press against Meowscarada", async () => {
    game.overridesHelper.moveset([Moves.FLYING_PRESS]).enemySpecies(Species.MEOWSCARADA);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.FLYING_PRESS);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(0.25);
  });

  it("Scrappy ability has no effect - Tackle against Ghost Type still 2x effective with Scrappy", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]).ability(Abilities.SCRAPPY).enemySpecies(Species.GASTLY);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.TACKLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });

  it("FORESIGHT has no effect - Tackle against Ghost Type still 2x effective with Foresight", async () => {
    game.overridesHelper.moveset([Moves.FORESIGHT, Moves.TACKLE]).enemySpecies(Species.GASTLY);

    await game.challengeModeHelper.startBattle();

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMoveEffectiveness");

    game.moveHelper.select(Moves.FORESIGHT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase");

    game.moveHelper.select(Moves.TACKLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(enemy.getMoveEffectiveness).toHaveLastReturnedWith(2);
  });
});
