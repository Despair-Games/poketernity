import { TYPE_BOOST_ITEM_BOOST_PERCENT } from "#constants/game-constants";
import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { toDmgValue } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Normalize", () => {
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
      .moveset([MoveId.TACKLE])
      .ability(AbilityId.NORMALIZE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the power of normal type moves by 20%", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    const powerSpy = vi.spyOn(allMoves.get(MoveId.TACKLE), "calculateBattlePower");

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");
    expect(powerSpy).toHaveLastReturnedWith(toDmgValue(allMoves.get(MoveId.TACKLE).power * 1.2));
  });

  it("should boost variable power moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    const magikarp = game.field.getPlayerPokemon();
    magikarp.friendship = 255;

    const powerSpy = vi.spyOn(allMoves.get(MoveId.RETURN), "calculateBattlePower");

    game.move.use(MoveId.RETURN);
    await game.toEndOfTurn();
    expect(powerSpy).toHaveLastReturnedWith(102 * 1.2);
  });

  it("should not apply the old type boost item after changing a move's type", async () => {
    game.override
      .startingHeldItems([{ name: "ATTACK_TYPE_BOOSTER", count: 1, type: ElementalType.GRASS }])
      .moveset([MoveId.LEAFAGE]);

    const powerSpy = vi.spyOn(allMoves.get(MoveId.LEAFAGE), "calculateBattlePower");
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    game.move.select(MoveId.LEAFAGE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(powerSpy).toHaveLastReturnedWith(toDmgValue(allMoves.get(MoveId.LEAFAGE).power * 1.2));
  });

  it("should apply silk scarf's power boost after changing a move's type", async () => {
    game.override
      .startingHeldItems([{ name: "ATTACK_TYPE_BOOSTER", count: 1, type: ElementalType.NORMAL }])
      .moveset([MoveId.LEAFAGE]);

    const powerSpy = vi.spyOn(allMoves.get(MoveId.LEAFAGE), "calculateBattlePower");
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    game.move.select(MoveId.LEAFAGE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(powerSpy).toHaveLastReturnedWith(
      toDmgValue(allMoves.get(MoveId.LEAFAGE).power * 1.2 * (1 + TYPE_BOOST_ITEM_BOOST_PERCENT / 100)),
    );
  });

  it.each([
    { moveName: "Revelation Dance", move: MoveId.REVELATION_DANCE },
    { moveName: "Judgement", move: MoveId.JUDGMENT, expected_ty: ElementalType.NORMAL },
    { moveName: "Terrain Pulse", move: MoveId.TERRAIN_PULSE },
    { moveName: "Weather Ball", move: MoveId.WEATHER_BALL },
    { moveName: "Multi Attack", move: MoveId.MULTI_ATTACK },
    { moveName: "Techno Blast", move: MoveId.TECHNO_BLAST },
    { moveName: "Hidden Power", move: MoveId.HIDDEN_POWER },
  ])("should not boost the power of $moveName", async ({ move }) => {
    game.override.moveset([move]);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);
    const powerSpy = vi.spyOn(allMoves.get(move), "calculateBattlePower");

    game.move.select(move);
    await game.phaseInterceptor.to("BerryPhase");
    expect(powerSpy).toHaveLastReturnedWith(allMoves.get(move).power);
  });
});
