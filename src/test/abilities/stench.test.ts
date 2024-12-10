import { BattlerIndex } from "#app/battle";
import { PostAttackApplyBattlerTagAbAttr } from "#app/data/ability";
import { FlinchAttr } from "#app/data/move";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import GameManager from "#test/utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Stench", () => {
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
      .ability(Abilities.STENCH)
      .moveset([Moves.TACKLE, Moves.SPLASH, Moves.HEADBUTT])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("Stench should have a base 10% chance of applying flinch to the target Pokemon", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(Moves.TACKLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.getChance).toHaveLastReturnedWith(10);
  });

  it("Stench should not stack with moves that already have a chance to flinch", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;
    const headbuttMove = playerPokemon
      ?.getMoveset()
      .find((m) => m?.moveId === Moves.HEADBUTT)
      ?.getMove();
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(Moves.HEADBUTT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(headbuttMove?.hasAttr(FlinchAttr)).toBe(true);
    expect(abilityAttr.getChance).toHaveLastReturnedWith(0);
  });

  it("Stench should not bypass the enemy Pokemon's substitute under normal conditions", async () => {
    game.override.enemyMoveset([Moves.SPLASH, Moves.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;

    game.move.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.SUBSTITUTE);
    await game.toNextTurn();
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(Moves.TACKLE);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("BerryPhase");
    expect(abilityAttr.getChance).not.toHaveBeenCalled();
  });
});
