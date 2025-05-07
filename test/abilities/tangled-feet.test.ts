import { IGNORING_ABILITIES } from "#app/constants/ability-constants";
import { capitalizeString } from "#app/utils/string-utils";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
      await classicMode.startBattle([SpeciesId.FEEBAS]);
      const playerPkm = field.getPlayerPokemon();
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).not.toHaveBattlerTagType(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(1);
    });
  });

  describe("When Confused", () => {
    it("should half enemy accuracy", async () => {
      const { classicMode, move, field } = game;
      await classicMode.startBattle([SpeciesId.FEEBAS]);
      const playerPkm = field.getPlayerPokemon();
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.CONFUSE_RAY);
      await game.toEndOfTurn();
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).toHaveBattlerTagType(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(0.5);
    });

    /**
     * Turboblaze, Mold Breaker, and Teravolt do not bypass the effects of Tangled Feet,
     * because Tangled Feet is not an Ability that affects other Pokémon — it is a self-targeting Ability.
     */
    it.each(
      IGNORING_ABILITIES.map((abilityId) => ({
        abilityName: capitalizeString(AbilityId[abilityId], "_", false, true),
        abilityId,
      })),
    )("should NOT be bypassed by $abilityName Ability", async () => {
      const { classicMode, move, field } = game;
      await classicMode.startBattle([SpeciesId.FEEBAS]);
      const playerPkm = field.getPlayerPokemon();
      const enemyPkm = field.getEnemyPokemon();
      vi.spyOn(enemyPkm, "getAccuracyMultiplier");

      game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.CONFUSE_RAY);
      await game.toEndOfTurn();
      move.use(MoveId.SPLASH);
      await move.selectEnemyMove(MoveId.TACKLE);
      await game.toEndOfTurn();

      expect(playerPkm).toHaveBattlerTagType(BattlerTagType.CONFUSED);
      expect(enemyPkm.getAccuracyMultiplier).toHaveLastReturnedWith(0.5);
    });
  });
});
