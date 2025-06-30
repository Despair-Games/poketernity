import { IGNORING_ABILITIES } from "#constants/ability-constants";
import { MAX_STAT_STAGE, MIN_STAT_STAGE } from "#constants/game-constants";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { arrayOfRange } from "#test/test-utils/test-utils";
import { calcAccuracyMultiplier } from "#utils/common-utils";
import { capitalizeString } from "#utils/string-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

//#region Constants

const statStages = arrayOfRange(MIN_STAT_STAGE, MAX_STAT_STAGE).map((stage) => ({
  stageStr: `${stage > 0 ? "+" : ""}${stage}`,
  stage,
}));

const ignoringAbilities = IGNORING_ABILITIES.map((abilityId) => ({
  abilityName: capitalizeString(AbilityId[abilityId], "_", false, true),
  abilityId,
}));

const tangledFeetMultiplier = 2;

//#endregion

describe("Ability - Tangled Feet", () => {
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
      .ability(AbilityId.TANGLED_FEET)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.CONFUSE_RAY, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(10)
      .enemyLevel(10);
  });

  describe("When NOT Confused", () => {
    it("Should NOT affect enemy accuracy", async () => {
      const { classicMode, move, field } = game;
      await classicMode.startBattle(SpeciesId.FEEBAS);
      const playerPkm = field.getPlayerPokemon();
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).not.toHaveBattlerTag(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(1);
    });
  });

  describe("When Confused", () => {
    it.each(statStages)("should half enemy accuracy (EVA = $stageStr)", async ({ stage }) => {
      const { classicMode, move, field } = game;
      await classicMode.startBattle(SpeciesId.FEEBAS);
      const playerPkm = field.getPlayerPokemon();
      playerPkm.setStatStage(Stat.EVA, stage);
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.CONFUSE_RAY);
      await move.forceHit();
      await game.toEndOfTurn();
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).toHaveBattlerTag(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(
        calcAccuracyMultiplier(0, stage) / tangledFeetMultiplier,
      );
    });

    // Mold Breaker, Teravolt and Turboblaze bypass the effects of Tangled Feet
    // https://bulbapedia.bulbagarden.net/wiki/Ignoring_Abilities#Ignorable_Abilities
    // https://www.smogon.com/dex/sv/abilities/mold-breaker/
    // https://www.smogon.com/dex/sv/abilities/teravolt/
    // https://www.smogon.com/dex/sv/abilities/turboblaze/
    it.each(ignoringAbilities)("should be bypassed by $abilityName Ability", async ({ abilityId }) => {
      const { override, classicMode, move, field } = game;
      override.enemyAbility(abilityId);
      await classicMode.startBattle(SpeciesId.FEEBAS);
      const playerPkm = field.getPlayerPokemon();
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.CONFUSE_RAY);
      await move.forceHit();
      await game.toEndOfTurn();
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).toHaveBattlerTag(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(1);
    });

    it.each([
      {
        passiveAbilityName: "Sand Veil",
        passiveAbilityId: AbilityId.SAND_VEIL,
        weatherType: WeatherType.SANDSTORM,
        passiveAbilityMultiplier: 1.2,
      },
      {
        passiveAbilityName: "Snow Cloak",
        passiveAbilityId: AbilityId.SNOW_CLOAK,
        weatherType: WeatherType.HAIL,
        passiveAbilityMultiplier: 1.2,
      },
    ])(
      "should stack with $passiveAbilityName Ability",
      async ({ passiveAbilityId, weatherType, passiveAbilityMultiplier }) => {
        const { override, classicMode, move, field } = game;
        override.passiveAbility(passiveAbilityId).weather(weatherType);
        await classicMode.startBattle(SpeciesId.FEEBAS);
        const playerPkm = field.getPlayerPokemon();
        const enemyPkm = field.getEnemyPokemon();
        vi.spyOn(enemyPkm, "getAccuracyMultiplier");

        game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
        move.use(MoveId.SPLASH);
        await move.selectEnemyMove(MoveId.CONFUSE_RAY);
        await move.forceHit();
        await game.toEndOfTurn();
        move.use(MoveId.SPLASH);
        await move.selectEnemyMove(MoveId.TACKLE);
        await game.toEndOfTurn();

        expect(playerPkm).toHaveBattlerTag(BattlerTagType.CONFUSED);
        expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(
          1 / passiveAbilityMultiplier / tangledFeetMultiplier,
        );
      },
    );
  });
});
