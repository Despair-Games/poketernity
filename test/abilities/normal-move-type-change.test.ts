import { TYPE_BOOST_ITEM_BOOST_PERCENT } from "#constants/game-constants";
import { allAbilities, allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { toDmgValue } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Tests for abilities that change the type of normal moves to
 * a different type and boost their power
 *
 * Includes
 * - Aerialate
 * - Galvanize
 * - Pixilate
 * - Refrigerate
 */

describe.each([
  { ab: AbilityId.GALVANIZE, ab_name: "Galvanize", ty: ElementalType.ELECTRIC, tyName: "electric" },
  { ab: AbilityId.PIXILATE, ab_name: "Pixilate", ty: ElementalType.FAIRY, tyName: "fairy" },
  { ab: AbilityId.REFRIGERATE, ab_name: "Refrigerate", ty: ElementalType.ICE, tyName: "ice" },
  { ab: AbilityId.AERILATE, ab_name: "Aerilate", ty: ElementalType.FLYING, tyName: "flying" },
])("Abilities - $ab_name", ({ ab, ty, tyName }) => {
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
      .startingLevel(100)
      .ability(ab)
      .enemySpecies(SpeciesId.DUSCLOPS)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .enemyLevel(100);
  });

  it(`should change Normal-type attacks to ${tyName} type and boost their power`, async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const typeSpy = vi.spyOn(playerPokemon, "getMoveType");

    const enemyPokemon = game.field.getEnemyPokemon();
    const enemySpy = vi.spyOn(enemyPokemon, "getMoveEffectiveness");
    const powerSpy = vi.spyOn(allMoves.get(MoveId.TACKLE), "calculateBattlePower");

    game.move.use(MoveId.TACKLE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(typeSpy).toHaveLastReturnedWith(ty);
    expect(enemySpy).toHaveReturnedWith(1);
    expect(powerSpy).toHaveReturnedWith(48);
    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
  });

  it("should not affect moves that are not Normal type", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const feebas = game.field.getPlayerPokemon();
    const typeSpy = vi.spyOn(feebas, "getMoveType");

    const enemy = game.field.getEnemyPokemon();
    const enemySpy = vi.spyOn(enemy, "getMoveEffectiveness");
    const powerSpy = vi.spyOn(allMoves.get(MoveId.SHADOW_BALL), "calculateBattlePower");

    game.move.use(MoveId.SHADOW_BALL);
    await game.toEndOfTurn();

    expect(typeSpy).toHaveLastReturnedWith(ElementalType.GHOST);
    expect(enemySpy).toHaveReturnedWith(2);
    expect(powerSpy).toHaveReturnedWith(80);
  });

  it("should still boost variable-power moves", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const typeSpy = vi.spyOn(playerPokemon, "getMoveType");

    const enemyPokemon = game.field.getEnemyPokemon();
    const enemySpy = vi.spyOn(enemyPokemon, "getMoveEffectiveness");
    const powerSpy = vi.spyOn(allMoves.get(MoveId.CRUSH_GRIP), "calculateBattlePower");

    game.move.use(MoveId.CRUSH_GRIP);

    await game.toEndOfTurn();

    expect(typeSpy).toHaveLastReturnedWith(ty);
    expect(enemySpy).toHaveReturnedWith(1);
    expect(powerSpy).toHaveReturnedWith(144); // 120 * 1.2
    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
  });

  // Galvanize specifically would like to check for volt absorb's activation
  if (ab === AbilityId.GALVANIZE) {
    it("should cause Normal-type attacks to activate Volt Absorb", async () => {
      game.override.enemyAbility(AbilityId.VOLT_ABSORB);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const playerPokemon = game.field.getPlayerPokemon();
      const tySpy = vi.spyOn(playerPokemon, "getMoveType");

      const enemyPokemon = game.field.getEnemyPokemon();
      const enemyEffectivenessSpy = vi.spyOn(enemyPokemon, "getMoveEffectiveness");

      enemyPokemon.hp = Math.floor(enemyPokemon.getMaxHp() * 0.8);

      game.move.use(MoveId.TACKLE);

      await game.phaseInterceptor.to("BerryPhase", false);

      expect(tySpy).toHaveLastReturnedWith(ElementalType.ELECTRIC);
      expect(enemyEffectivenessSpy).toHaveReturnedWith(0);
      expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    });
  }

  it.each([
    { moveName: "Revelation Dance", move: MoveId.REVELATION_DANCE, expected_ty: ElementalType.WATER },
    { moveName: "Judgement", move: MoveId.JUDGMENT, expected_ty: ElementalType.NORMAL },
    { moveName: "Terrain Pulse", move: MoveId.TERRAIN_PULSE, expected_ty: ElementalType.NORMAL },
    { moveName: "Weather Ball", move: MoveId.WEATHER_BALL, expected_ty: ElementalType.NORMAL },
    { moveName: "Multi Attack", move: MoveId.MULTI_ATTACK, expected_ty: ElementalType.NORMAL },
    { moveName: "Techno Blast", move: MoveId.TECHNO_BLAST, expected_ty: ElementalType.NORMAL },
  ])("should not change the type of $moveName", async ({ move, expected_ty: expectedTy }) => {
    game.override.enemySpecies(SpeciesId.MAGIKARP);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const tySpy = vi.spyOn(playerPokemon, "getMoveType");

    game.move.use(move);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(tySpy).toHaveLastReturnedWith(expectedTy);
  });

  it("should affect all hits of a Normal-type multi-hit move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const playerPokemon = game.field.getPlayerPokemon();
    const tySpy = vi.spyOn(playerPokemon, "getMoveType");

    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.use(MoveId.FURY_SWIPES);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();

    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(playerPokemon.turnData.hitCount).toBeGreaterThan(1);
    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());

    while (playerPokemon.turnData.hitsLeft > 0) {
      const enemyStartingHp = enemyPokemon.hp;
      await game.phaseInterceptor.to("MoveEffectPhase");

      expect(tySpy).toHaveLastReturnedWith(ty);
      expect(enemyPokemon.hp).toBeLessThan(enemyStartingHp);
    }
  });

  it("should not be affected by silk scarf after changing the move's type", async () => {
    game.override.startingHeldItems([{ name: "ATTACK_TYPE_BOOSTER", count: 1, type: ElementalType.NORMAL }]);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const tackle = allMoves.get(MoveId.TACKLE);

    // get the power boost from the ability so we can compare it to the item
    const boost = allAbilities[ab].getAttrs("VariableMovePowerAbAttr")[0]["powerMultiplier"];

    const powerSpy = vi.spyOn(tackle, "calculateBattlePower");
    const typeSpy = vi.spyOn(game.field.getPlayerPokemon(), "getMoveType");
    game.move.use(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(typeSpy, "type was not changed").toHaveLastReturnedWith(ty);
    expect(powerSpy).toHaveLastReturnedWith(toDmgValue(tackle.power * boost));
  });

  it("should be affected by the type boosting item after changing the move's type", async () => {
    game.override.startingHeldItems([{ name: "ATTACK_TYPE_BOOSTER", count: 1, type: ty }]);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    // get the power boost from the ability so we can compare it to the item
    const boost = allAbilities[ab].getAttrs("VariableMovePowerAbAttr")[0]["powerMultiplier"];

    const tackle = allMoves.get(MoveId.TACKLE);

    const powerSpy = vi.spyOn(tackle, "calculateBattlePower");
    game.move.use(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(powerSpy).toHaveLastReturnedWith(
      toDmgValue(tackle.power * boost * (1 + TYPE_BOOST_ITEM_BOOST_PERCENT / 100)),
    );
  });
});
