import { ReceivedTypeDamageMultiplierAbAttr } from "#abilities/received-type-damage-multiplier-ab-attr";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { toDmgValue } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Dry Skin", () => {
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
      .battleType("single")
      .disableCrits()
      .enemyAbility(AbilityId.DRY_SKIN)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.CHARMANDER)
      .ability(AbilityId.BALL_FETCH);
  });

  it.each([
    ["Harsh Sunlight", WeatherType.SUNNY],
    ["Extremely Harsh Sunlight", WeatherType.HARSH_SUN],
  ])("loses 1/8 of max health in '%s' weather, at the end of each turn", async (_name, weather) => {
    const { override, classicMode, field, move } = game;
    override.weather(weather);

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8);
  });

  it.each([
    ["Rain", WeatherType.RAIN],
    ["Heavy Rain", WeatherType.HEAVY_RAIN],
  ])("gains 1/8 of max health in '%s' weather, at the end of each turn", async (_name, weather) => {
    const { override, classicMode, field, move } = game;
    override.weather(weather);

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    enemy.hp = 1;
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveHp(toDmgValue(enemy.getMaxHp() / 8) + 1);
  });

  it("opposing fire attacks do 25% more damage", async () => {
    const initialHP = 1000;
    const { override, classicMode, field, move } = game;
    vi.spyOn(ReceivedTypeDamageMultiplierAbAttr.prototype, "apply");

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();

    // first turn
    enemy.hp = initialHP;
    move.use(MoveId.FLAMETHROWER);
    await game.toEndOfTurn();
    const fireDamageTakenWithDrySkin = initialHP - enemy.hp;

    // second turn
    enemy.hp = initialHP;
    override.enemyAbility(AbilityId.NONE);
    move.use(MoveId.FLAMETHROWER);
    await game.toEndOfTurn();
    const fireDamageTakenWithoutDrySkin = initialHP - enemy.hp;
    const expectedPreToDmgValue = fireDamageTakenWithoutDrySkin * 1.25;
    const expectedDamage = toDmgValue(expectedPreToDmgValue);

    // Allow for ±1 tolerance
    expect(fireDamageTakenWithDrySkin).toBeGreaterThanOrEqual(expectedDamage - 1);
    expect(fireDamageTakenWithDrySkin).toBeLessThanOrEqual(expectedDamage + 1);
    expect(ReceivedTypeDamageMultiplierAbAttr.prototype.apply).toHaveLastReturnedWith(true);
  });

  it("should heal 1/4 of max HP instead of receiving damage if hit by a Water-type move", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    enemy.hp = 1;
    move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemy).toHaveHp(toDmgValue(enemy.getMaxHp() / 4) + 1);
  });

  it("should not absorb incoming Water-type moves if the ability source is protected", async () => {
    const { override, classicMode, field, move } = game;
    override.enemyMoveset([MoveId.PROTECT]);

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    enemy.hp = 1;
    move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemy).toHaveHp(1);
  });

  it("should only heal once from multi-strike Water-type attacks", async () => {
    const { override, classicMode, field, move } = game;
    override.moveset([MoveId.WATER_GUN, MoveId.WATER_SHURIKEN]);

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    // first turn
    enemy.hp = 1;
    move.use(MoveId.WATER_SHURIKEN);
    await game.toEndOfTurn();
    const healthGainedFromWaterShuriken = enemy.hp - 1;

    // second turn
    enemy.hp = 1;
    move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();
    const healthGainedFromWaterGun = enemy.hp - 1;

    expect(healthGainedFromWaterShuriken).toBe(healthGainedFromWaterGun);
  });

  it("should absorb incoming Water-type moves regardless of accuracy check", async () => {
    const { classicMode, field, move, phaseInterceptor } = game;

    await classicMode.startBattle(SpeciesId.CHANDELURE);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.WATER_GUN);
    enemy.hp = enemy.hp - 1;
    await phaseInterceptor.to("MoveEffectPhase");
    await move.forceMiss();
    await game.toEndOfTurn();

    expect(enemy).toHaveFullHp();
  });
});
