import { allMoves } from "#app/data/all-moves";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ElementType } from "#enums/element-type";

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
      .moveset([Moves.WING_ATTACK])
      .ability(Abilities.GALE_WINGS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should boost the priority of flying type moves by 1 at full HP", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon();

    const flyingMove = allMoves[Moves.WING_ATTACK];
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(Moves.WING_ATTACK);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon?.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority + 1);
  });

  it("should not boost the priority of flying type moves if not at full HP", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = 1;

    const flyingMove = allMoves[Moves.WING_ATTACK];
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(Moves.WING_ATTACK);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.isFullHp()).toBe(false);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
  });

  it("should not boost the priority of variable-type moves", async () => {
    game.override.moveset(Moves.HIDDEN_POWER);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    //IVs for Flying-Type Hidden Power
    playerPokemon.ivs = [31, 31, 31, 30, 30, 30];

    const flyingMove = allMoves[Moves.HIDDEN_POWER];
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(Moves.HIDDEN_POWER);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
    expect(playerPokemon.getMoveType(flyingMove)).toBe(ElementType.FLYING);
  });

  it("should not boost the priority of originally Normal-type moves transformed by Aerilate", async () => {
    game.override.moveset(Moves.TACKLE).passiveAbility(Abilities.AERILATE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    const flyingMove = allMoves[Moves.TACKLE];
    vi.spyOn(flyingMove, "getPriority");

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.isFullHp()).toBe(true);
    expect(flyingMove.getPriority).toHaveLastReturnedWith(flyingMove.priority);
    expect(playerPokemon.getMoveType(flyingMove)).toBe(ElementType.FLYING);
  });
});
