import type { PerishSongTag } from "#app/data/battler-tags";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Perish Body", () => {
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
      .moveset([MoveId.PECK, MoveId.SPLASH])
      .ability(Abilities.PERISH_BODY)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.PERISH_BODY)
      .enemyMoveset(MoveId.PECK)
      .enemyLevel(8);
  });

  it("should not trigger if the attacker is afflicted with Perish", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [, milotic] = game.scene.getPlayerParty();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    expect(milotic.getTag(BattlerTagType.PERISH_SONG)).toBeUndefined();
    expect((enemy.getTag(BattlerTagType.PERISH_SONG) as PerishSongTag).turnCount).toBe(2);
  });

  it("should trigger if only the defender is afflicted with Perish", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [, milotic] = game.scene.getPlayerParty();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.PECK);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.move.select(MoveId.PECK);
    await game.toNextTurn();

    expect((milotic.getTag(BattlerTagType.PERISH_SONG) as PerishSongTag).turnCount).toBe(3);
    expect((enemy.getTag(BattlerTagType.PERISH_SONG) as PerishSongTag).turnCount).toBe(1);
  });
});
