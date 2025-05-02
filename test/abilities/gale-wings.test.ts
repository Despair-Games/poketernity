import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ElementalType } from "#enums/elemental-type";

describe("Abilities - Gale Wings", () => {
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
      .moveset([MoveId.WING_ATTACK])
      .ability(AbilityId.GALE_WINGS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the priority of flying type moves by 1 at full HP", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();

    const flyingMove = allMoves.get(MoveId.WING_ATTACK);
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(MoveId.WING_ATTACK);
    await game.toEndOfTurn();

    expect(playerPokemon?.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority + 1);
  });

  it("should not boost the priority of flying type moves if not at full HP", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = 1;

    const flyingMove = allMoves.get(MoveId.WING_ATTACK);
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(MoveId.WING_ATTACK);
    await game.toEndOfTurn();

    expect(playerPokemon.isFullHp()).toBe(false);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
  });

  it("should not boost the priority of variable-type moves", async () => {
    game.override.moveset(MoveId.HIDDEN_POWER);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    //IVs for Flying-Type Hidden Power
    playerPokemon.ivs = [31, 31, 31, 30, 30, 30];

    const flyingMove = allMoves.get(MoveId.HIDDEN_POWER);
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(MoveId.HIDDEN_POWER);
    await game.toEndOfTurn();

    expect(playerPokemon.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
    expect(playerPokemon.getMoveType(flyingMove)).toBe(ElementalType.FLYING);
  });

  it("should not boost the priority of originally Normal-type moves transformed by Aerilate", async () => {
    game.override.moveset(MoveId.TACKLE).passiveAbility(AbilityId.AERILATE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    const flyingMove = allMoves.get(MoveId.TACKLE);
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(playerPokemon.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
    expect(playerPokemon.getMoveType(flyingMove)).toBe(ElementalType.FLYING);
  });
});
