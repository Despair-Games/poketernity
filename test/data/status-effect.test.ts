import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/game-manager";
import { mockI18next } from "#test/test-utils/test-utils";
import {
  getStatusEffectActivationText,
  getStatusEffectDescriptor,
  getStatusEffectHealText,
  getStatusEffectObtainText,
  getStatusEffectOverlapText,
} from "#utils/status-effect-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Status Effect Messages", () => {
  beforeEach(() => {
    mockI18next();
  });

  describe.each<{ readonly statusEffect: StatusEffect; readonly effectName: string }>([
    { statusEffect: StatusEffect.NONE, effectName: "None" },
    { statusEffect: StatusEffect.POISON, effectName: "Poison" },
    { statusEffect: StatusEffect.TOXIC, effectName: "Toxic" },
    { statusEffect: StatusEffect.PARALYSIS, effectName: "Paralysis" },
    { statusEffect: StatusEffect.SLEEP, effectName: "Sleep" },
    { statusEffect: StatusEffect.FREEZE, effectName: "Freeze" },
    { statusEffect: StatusEffect.BURN, effectName: "Burn" },
  ])("$effectName", ({ statusEffect, effectName }) => {
    function getEffectKey(effect: StatusEffect, keyType: string) {
      if (effect === StatusEffect.NONE) {
        return "";
      }
      return `statusEffect:${effectName.toLowerCase()}.${keyType}`;
    }

    it("should return the obtain text", () => {
      const text = getStatusEffectObtainText(statusEffect, "pokemon_name");
      expect(text).toBe(getEffectKey(statusEffect, "obtain"));

      const emptySourceText = getStatusEffectObtainText(statusEffect, "pokemon_name", "");
      expect(emptySourceText).toBe(getEffectKey(statusEffect, "obtain"));

      const withSource = getStatusEffectObtainText(statusEffect, "pokemon_name", "source_text");
      expect(withSource).toBe(getEffectKey(statusEffect, "obtainSource"));
    });

    it("should return the activation text", () => {
      const text = getStatusEffectActivationText(statusEffect, "pokemon_name");
      expect(text).toBe(getEffectKey(statusEffect, "activation"));
    });

    it("should return the descriptor", () => {
      const text = getStatusEffectDescriptor(statusEffect);
      expect(text).toBe(getEffectKey(statusEffect, "description"));
    });

    it("should return the heal text", () => {
      const text = getStatusEffectHealText(statusEffect, "pokemon_name");
      expect(text).toBe(getEffectKey(statusEffect, "heal"));
    });

    it("should return the overlap text", () => {
      const text = getStatusEffectOverlapText(statusEffect, "pokemon_name");
      expect(text).toBe(getEffectKey(statusEffect, "overlap"));
    });
  });
});

describe("Status Effects", () => {
  describe("Paralysis", () => {
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
        .enemySpecies(SpeciesId.MAGIKARP)
        .enemyMoveset(MoveId.SPLASH)
        .enemyAbility(AbilityId.BALL_FETCH)
        .moveset([MoveId.QUICK_ATTACK])
        .ability(AbilityId.BALL_FETCH)
        .statusEffect(StatusEffect.PARALYSIS);
    });

    it("causes the pokemon's move to fail when activated", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      game.move.select(MoveId.QUICK_ATTACK);
      await game.move.forceStatusActivation(true);
      await game.toNextTurn();

      expect(game.field.getEnemyPokemon().isFullHp()).toBe(true);
      expect(game.field.getPlayerPokemon()).toHaveMoveResult(MoveResult.FAIL);
    });
  });

  describe("Sleep", () => {
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
        .moveset([MoveId.SPLASH])
        .ability(AbilityId.BALL_FETCH)
        .battleType("single")
        .disableCrits()
        .enemySpecies(SpeciesId.MAGIKARP)
        .enemyAbility(AbilityId.BALL_FETCH)
        .enemyMoveset(MoveId.SPLASH);
    });

    it("should last the appropriate number of turns", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.scene.getPlayerPokemon()!;
      player.trySetStatus(StatusEffect.SLEEP, false, undefined, 4);
      expect(player).toHaveStatusEffect(StatusEffect.SLEEP, { ignoreMockAbility: true });

      game.move.select(MoveId.SPLASH);
      await game.toNextTurn();

      expect(player).toHaveStatusEffect(StatusEffect.SLEEP, { ignoreMockAbility: true });

      game.move.select(MoveId.SPLASH);
      await game.toNextTurn();

      expect(player).toHaveStatusEffect(StatusEffect.SLEEP, { ignoreMockAbility: true });

      game.move.select(MoveId.SPLASH);
      await game.toNextTurn();

      expect(player).toHaveStatusEffect(StatusEffect.SLEEP, { ignoreMockAbility: true });
      expect(player).toHaveMoveResult(MoveResult.FAIL);

      game.move.select(MoveId.SPLASH);
      await game.toNextTurn();

      expect(player).toHaveStatusEffect(StatusEffect.NONE, { ignoreMockAbility: true });
      expect(player).toHaveMoveResult(MoveResult.SUCCESS);
    });
  });

  describe("Behavior", () => {
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
        .moveset([MoveId.SPLASH])
        .ability(AbilityId.BALL_FETCH)
        .battleType("single")
        .disableCrits()
        .enemySpecies(SpeciesId.MAGIKARP)
        .enemyAbility(AbilityId.BALL_FETCH)
        .enemyMoveset(MoveId.NUZZLE)
        .enemyLevel(2000);
    });

    it("should not inflict a 0 HP mon with a status", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS, SpeciesId.MILOTIC);

      const player = game.field.getPlayerPokemon();
      player.hp = 0;

      expect(player.trySetStatus(StatusEffect.BURN)).toBe(false);
      expect(player.getStatusEffect(true)).not.toBe(StatusEffect.BURN);
    });
  });
});
