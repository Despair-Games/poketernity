import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Steadfast", () => {
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
      .ability(AbilityId.STEADFAST)
      .startingLevel(100)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset([MoveId.SPLASH, MoveId.FAKE_OUT])
      .enemyLevel(100);
  });

  it(`should boost SPD +1 after flinching`, async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);

    expect(playerPkm).toHaveFlinched();

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, +1);
  });

  it(`should NOT boost SPD after NOT flinching`, async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.SPLASH);
    await phaseInterceptor.to("MoveEndPhase", true);

    expect(playerPkm).not.toHaveFlinched();
    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it(`should NOT boost SPD if flinchinging occured after owner acted`, async () => {
    const { classicMode, field, move } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await game.toEndOfTurn();

    expect(playerPkm).not.toHaveFlinched();
    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });
});
