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

  it(`should NOT boost SPD when Pokemon does NOT flinch`, async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.SPLASH);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);

    expect(playerPkm).not.toHaveFlinched();

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it(`should NOT boost SPD if flinching occured after owner acted`, async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MoveEndPhase", true);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);

    expect(playerPkm).toHaveFlinched();

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it(`should NOT boost SPD if flinching is prevented by "Inner Focus"`, async () => {
    const { classicMode, field, move, phaseInterceptor } = game;
    game.override.passiveAbility(AbilityId.INNER_FOCUS);
    await classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPkm = field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.FAKE_OUT);
    await phaseInterceptor.to("MessagePhase", false);

    expect(playerPkm).not.toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);

    expect(playerPkm).not.toHaveFlinched(); // inner focus prevents flinching

    await game.toEndOfTurn();

    expect(playerPkm).toHaveStatStage(Stat.SPD, 0);
  });

  it.each([
    {
      abilityName: "Mold Breaker",
      abilityId: AbilityId.MOLD_BREAKER,
    },
    {
      abilityName: "Teravolt",
      abilityId: AbilityId.TERAVOLT,
    },
    {
      abilityName: "Turboblaze",
      abilityId: AbilityId.TURBOBLAZE,
    },
  ])(`should boost SPD +1 if Inner Focus is overridden by enemy $abilityName ability`, async ({ abilityId }) => {
    const { classicMode, field, move, phaseInterceptor } = game;
    game.override.enemyAbility(abilityId).passiveAbility(AbilityId.INNER_FOCUS);
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
});
