import type { SubstituteTag } from "#app/data/battler-tags/substitute-tag";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Shed Tail", () => {
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
      .moveset([MoveId.SHED_TAIL])
      .battleType("single")
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("transfers a Substitute doll to the switched in Pokemon", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const magikarp = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SHED_TAIL);
    game.doSelectPartyPokemon(1);

    await game.toEndOfTurn();

    const feebas = game.scene.getPlayerPokemon()!;
    const substituteTag = feebas.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);

    expect(feebas).not.toBe(magikarp);
    expect(feebas.hp).toBe(feebas.getMaxHp());
    // Note: Shed Tail's HP cost is currently not accurate to mainline, as it
    // should cost ceil(maxHP / 2) instead of max(floor(maxHp / 2), 1). The current
    // implementation is consistent with Substitute's HP cost logic, but that's not
    // the case in mainline for some reason :regiDespair:.
    expect(magikarp.hp).toBe(Math.ceil(magikarp.getMaxHp() / 2));
    expect(substituteTag).toBeDefined();
    expect(substituteTag?.hp).toBe(Math.floor(magikarp.getMaxHp() / 4));
  });

  it("should fail if no ally is available to switch in", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const magikarp = game.scene.getPlayerPokemon()!;
    expect(game.scene.getPlayerParty().length).toBe(1);

    game.move.select(MoveId.SHED_TAIL);

    await game.toEndOfTurn();

    expect(magikarp.isOnField()).toBeTruthy();
    expect(magikarp.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });
});
