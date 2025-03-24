import type { RechargingTag } from "#app/data/battler-tags/recharging-tag";
import type { SemiInvulnerableTag } from "#app/data/battler-tags/semi-invulnerable-tag";
import { allMoves } from "#app/data/data-lists";
import { MetronomeAttr } from "#app/data/moves/move-attrs/metronome-attr";
import { SemiInvulnerableBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Metronome", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const randomMoveAttr = allMoves.get(MoveId.METRONOME).getAttrs(MetronomeAttr)[0];

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
      .moveset([MoveId.METRONOME, MoveId.SPLASH])
      .battleType("single")
      .startingLevel(100)
      .starterSpecies(SpeciesId.REGIELEKI)
      .enemyLevel(100)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  it("should have one semi-invulnerable turn and deal damage on the second turn when a semi-invulnerable move is called", async () => {
    await game.classicMode.startBattle();
    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.DIVE);

    game.move.select(MoveId.METRONOME);
    await game.toNextTurn();

    expect(player.getTag<SemiInvulnerableTag>(...SemiInvulnerableBattlerTagTypes)).toBeTruthy();

    await game.toNextTurn();
    expect(player.getTag<SemiInvulnerableTag>(...SemiInvulnerableBattlerTagTypes)).toBeFalsy();
    expect(enemy.isFullHp()).toBeFalsy();
  });

  it("should apply secondary effects of a move", async () => {
    await game.classicMode.startBattle();
    const player = game.scene.getPlayerPokemon()!;
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.WOOD_HAMMER);

    game.move.select(MoveId.METRONOME);
    await game.toNextTurn();

    expect(player.isFullHp()).toBeFalsy();
  });

  it("should recharge after using recharge move", async () => {
    await game.classicMode.startBattle();
    const player = game.scene.getPlayerPokemon()!;
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.HYPER_BEAM);
    vi.spyOn(allMoves.get(MoveId.HYPER_BEAM), "accuracy", "get").mockReturnValue(100);

    game.move.select(MoveId.METRONOME);
    await game.toNextTurn();

    expect(player.getTag<RechargingTag>(BattlerTagType.RECHARGING)).toBeTruthy();
  });

  it("should only target ally for Aromatic Mist", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.REGIELEKI, SpeciesId.RATTATA]);
    const [leftPlayer, rightPlayer] = game.scene.getPlayerField();
    const [leftOpp, rightOpp] = game.scene.getEnemyField();
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.AROMATIC_MIST);

    game.move.select(MoveId.METRONOME, 0);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    expect(rightPlayer.getStatStage(Stat.SPDEF)).toBe(1);
    expect(leftPlayer.getStatStage(Stat.SPDEF)).toBe(0);
    expect(leftOpp.getStatStage(Stat.SPDEF)).toBe(0);
    expect(rightOpp.getStatStage(Stat.SPDEF)).toBe(0);
  });

  it("should cause opponent to flee, and not crash for Roar", async () => {
    await game.classicMode.startBattle();
    vi.spyOn(randomMoveAttr, "getRandomMove").mockReturnValue(MoveId.ROAR);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.METRONOME);
    await game.phaseInterceptor.to("BerryPhase");

    const isVisible = enemyPokemon.visible;
    const hasFled = enemyPokemon.switchOutStatus;
    expect(!isVisible && hasFled).toBe(true);

    await game.phaseInterceptor.to("CommandPhase");
  });

  it("should never call a G-Max move", async () => {
    await game.classicMode.startBattle();

    const user = game.field.getPlayerPokemon();

    let rngSweepProgress = 0; // This will simulate entire range of RNG calls by slowly sweeping from 0 to 1
    vi.spyOn(user, "randSeedInt").mockImplementation((range: number, min: number = 0) => {
      return Math.floor(min + rngSweepProgress * range);
    });

    const trials = 1000;
    for (let i = 0; i < trials; i++) {
      rngSweepProgress = (2 * i + 1) / (2 * trials);

      const moveId = randomMoveAttr.getRandomMove(user);
      expect(allMoves.get(moveId).hasFlag(MoveFlags.G_MAX_MOVE)).toBe(false);
    }
  });
});
