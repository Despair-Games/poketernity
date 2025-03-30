import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Me First", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should copy the target's selected attack and use it with 50% more power", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const tackle = allMoves.get(MoveId.TACKLE);
    vi.spyOn(tackle, "calculateBattlePower");

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.ME_FIRST);
    await game.move.forceEnemyMove(MoveId.TACKLE);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(tackle.calculateBattlePower).toHaveReturnedWith(60);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(tackle.calculateBattlePower).toHaveReturnedWith(40);
  });

  it("should put the user in a frenzy if a frenzy move is copied", async () => {
    game.override.enemySpecies(SpeciesId.BASTIODON);
    await game.classicMode.startBattle([SpeciesId.BASTIODON]);

    const outrage = allMoves.get(MoveId.OUTRAGE);
    vi.spyOn(outrage, "calculateBattlePower");

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.ME_FIRST);
    await game.move.forceEnemyMove(MoveId.OUTRAGE);

    // Player uses Me First - should call Outrage with increased power
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(outrage.calculateBattlePower).toHaveLastReturnedWith(180);
    expect(game.field.getPlayerPokemon().getTag(BattlerTagType.FRENZY)).toBeDefined();

    // Enemy uses Outrage - should have base power
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(outrage.calculateBattlePower).toHaveLastReturnedWith(120);
    expect(game.field.getEnemyPokemon().getTag(BattlerTagType.FRENZY)).toBeDefined();

    game.scene.getField(true).forEach((p) => expect(p.getMoveQueue()).toHaveLength(1));

    await game.toNextTurn();

    // Me First should not boost subsequent uses of Outrage
    await game.phaseInterceptor.to("MoveEndPhase");
    expect(outrage.calculateBattlePower).toHaveLastReturnedWith(120);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(outrage.calculateBattlePower).toHaveLastReturnedWith(120);
  });

  it("should fail if the target selected a non-damaging move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.ME_FIRST);
    await game.move.forceEnemyMove(MoveId.SWORDS_DANCE);

    await game.toEndOfTurn();

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    expect(player.getStatStage(Stat.ATK)).toBe(0);
    expect(enemy.getStatStage(Stat.ATK)).toBe(2);
  });

  it("should fail if the target has already used their selected move for the turn", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.use(MoveId.ME_FIRST);
    await game.move.forceEnemyMove(MoveId.TACKLE);

    await game.toEndOfTurn();

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    expect(player.isFullHp()).toBeFalsy();
    expect(enemy.isFullHp()).toBeTruthy();
  });

  it.each([
    { moveId: MoveId.BEAK_BLAST, moveName: "Beak Blast" },
    { moveId: MoveId.BELCH, moveName: "Belch" },
    { moveId: MoveId.CHATTER, moveName: "Chatter" },
    { moveId: MoveId.COMEUPPANCE, moveName: "Comeuppance" },
    { moveId: MoveId.COUNTER, moveName: "Counter" },
    { moveId: MoveId.COVET, moveName: "Covet" },
    { moveId: MoveId.FOCUS_PUNCH, moveName: "Focus Punch" },
    { moveId: MoveId.METAL_BURST, moveName: "Metal Burst" },
    { moveId: MoveId.MIRROR_COAT, moveName: "Mirror Coat" },
    { moveId: MoveId.SHELL_TRAP, moveName: "Shell Trap" },
    { moveId: MoveId.STRUGGLE, moveName: "Struggle" },
    { moveId: MoveId.THIEF, moveName: "Thief" },

    /**
     * {@linkcode https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_call_other_moves | Moves that call other moves}
     * also cause Me First to fail if the target selects them
     */
    { moveId: MoveId.ASSIST, moveName: "Assist" },
    { moveId: MoveId.COPYCAT, moveName: "Copycat" },
    { moveId: MoveId.ME_FIRST, moveName: "Me First" },
    { moveId: MoveId.METRONOME, moveName: "Metronome" },
    { moveId: MoveId.MIRROR_MOVE, moveName: "Mirror Move" },
    { moveId: MoveId.NATURE_POWER, moveName: "Nature Power" },
    { moveId: MoveId.SLEEP_TALK, moveName: "Sleep Talk" },
    { moveId: MoveId.SNATCH, moveName: "Snatch" },
  ])("should fail if the target selected $moveName for the turn", async ({ moveId }) => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.use(MoveId.ME_FIRST);
    await game.move.forceEnemyMove(moveId);

    await game.phaseInterceptor.to("MoveEndPhase");

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
  });
});
