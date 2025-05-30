import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Ability - Bad Dreams", () => {
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
      .ability(AbilityId.BAD_DREAMS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should do 1/8 max-hp damage to sleeping enemies", async () => {
    const { override, classicMode, field, move } = game;
    override.enemyStatusEffect(StatusEffect.SLEEP);

    await classicMode.startBattle(SpeciesId.DARKRAI);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8);
  });

  it("should not damage awake enemies", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.DARKRAI);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveFullHp();
  });

  it("should do 1/8 max-hp damage to drowsy enemies falling asleep in the same turn", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.DARKRAI);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.YAWN);
    await game.toEndOfTurn();

    expect(enemy).toHaveBattlerTag(BattlerTagType.DROWSY);
    expect(enemy).toHaveFullHp();

    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    // expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP); TODO: Currently drowsy sets the sleep status effect after applying bad dreams due to "asPhase=true"
    expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8);
  });

  it("should NOT do 1/8 max-hp damage to drowsy enemies who can't fall asleep in the same turn", async () => {
    const { classicMode, field, move } = game;

    await classicMode.startBattle(SpeciesId.DARKRAI);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.YAWN);
    await game.toEndOfTurn();

    expect(enemy).toHaveBattlerTag(BattlerTagType.DROWSY);
    expect(enemy).toHaveFullHp();

    move.use(MoveId.SPLASH);
    await move.forceEnemyMove(MoveId.UPROAR);
    await game.toEndOfTurn();

    expect(enemy).toHaveStatusEffect(StatusEffect.NONE); // TODO: Currently drowsy sets the sleep status effect after applying bad dreams due to "asPhase=true"
    expect(enemy).toHaveFullHp();
  });

  it("should do 1/8 max-hp damage to enemy with 'Comatose' ability", async () => {
    const { override, classicMode, field, move } = game;
    override.enemyPassiveAbility(AbilityId.COMATOSE);

    await classicMode.startBattle(SpeciesId.DARKRAI);
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8);
  });

  it.each([
    ["Hydration", AbilityId.HYDRATION, WeatherType.RAIN],
    ["Shed Skin", AbilityId.SHED_SKIN, WeatherType.NONE],
    ["Healer", AbilityId.HEALER, WeatherType.NONE],
  ])(
    "should not damage if enemy is woken up by '%s' ability in the same turn",
    async (_abilityName, abilityId, weatherType) => {
      const { override, classicMode, field, move } = game;
      override.weather(weatherType).battleType("double").enemyAbility(abilityId);

      await classicMode.runToSummon(SpeciesId.DARKRAI);
      for (const enemyPkm of game.scene.getEnemyParty()) {
        vi.spyOn(enemyPkm, "randSeedInt").mockReturnValueOnce(0); // Make sure that Shed Skin/Healer always triggers.
      }
      const enemy = field.getEnemyPokemon();
      enemy.trySetStatus(StatusEffect.SLEEP);

      expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP);

      move.use(MoveId.SPLASH);
      await game.toEndOfTurn();

      expect(enemy).not.toHaveStatusEffect(StatusEffect.SLEEP);
      expect(enemy).toHaveFullHp();
    },
  );

  it("should damage if enemy is not woken up by 'Hydration' ability due to rain ending in the same turn", async () => {
    const { override, classicMode, field, move } = game;
    override.enemyAbility(AbilityId.HYDRATION).newWeatherDuration(1);

    await classicMode.runToSummon(SpeciesId.DARKRAI);
    game.scene.arena.trySetWeather(WeatherType.RAIN, false);
    const enemy = field.getEnemyPokemon();
    enemy.trySetStatus(StatusEffect.SLEEP, false, null, Number.MAX_SAFE_INTEGER);

    expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP);

    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP);
    expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8); // didn't wake up due to rain ending in the same turn
  });

  it.each([
    ["Shed Skin", AbilityId.SHED_SKIN, WeatherType.NONE],
    ["Healer", AbilityId.HEALER, WeatherType.NONE],
  ])(
    "should damage if enemy is not woken up by '%s' ability in the same turn",
    async (_abilityName, abilityId, weatherType) => {
      const { override, classicMode, field, move } = game;
      override.weather(weatherType).battleType("double").enemyAbility(abilityId);

      await classicMode.runToSummon(SpeciesId.DARKRAI);
      for (const pokemon of game.scene.getEnemyParty()) {
        vi.spyOn(pokemon, "randSeedInt").mockReturnValueOnce(3); // Make sure that Shed Skin/Healer never triggers.
      }
      const enemy = field.getEnemyPokemon();
      enemy.trySetStatus(StatusEffect.SLEEP, false, null, Number.MAX_SAFE_INTEGER);

      expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP);

      move.use(MoveId.SPLASH);
      await game.toEndOfTurn();

      expect(enemy).toHaveStatusEffect(StatusEffect.SLEEP);
      expect(enemy).toHaveTakenDamage(enemy.getMaxHp() / 8);
    },
  );
});
