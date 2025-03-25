import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MoveFlags } from "#enums/move-flags";
import { MoveResult } from "#enums/move-result";
import { allMoves } from "#app/data/data-lists";

describe("Ability Attribute - Move Flag Immunity", () => {
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
      .moveset([MoveId.SPLASH])
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  // Flagged moves verified by the all_moves test in the `moves` directory
  it.each([
    {
      abilityName: "Soundproof",
      ability: AbilityId.SOUNDPROOF,
      moveFlag: MoveFlags.SOUND_MOVE,
      enemyMoveId: MoveId.UPROAR,
    },
    {
      abilityName: "Overcoat",
      ability: AbilityId.OVERCOAT,
      moveFlag: MoveFlags.POWDER_MOVE,
      enemyMoveId: MoveId.STUN_SPORE,
    },
    {
      abilityName: "Bulletproof",
      ability: AbilityId.BULLETPROOF,
      moveFlag: MoveFlags.BULLET_MOVE,
      enemyMoveId: MoveId.AURA_SPHERE,
    },
  ])(
    "$abilityName should provide immunity against the flagged moves",
    async ({ ability, moveFlag, enemyMoveId: enemyMove }) => {
      game.override.ability(ability).enemyMoveset(enemyMove);

      await game.classicMode.startBattle([SpeciesId.FEEBAS]);
      const enemyPokemon = game.scene.getEnemyPokemon()!;

      game.move.select(MoveId.SPLASH);
      await game.move.forceHit();
      await game.toEndOfTurn();

      const lastEnemyMove = enemyPokemon.getLastXMoves()[0];
      expect(lastEnemyMove.result).toBe(MoveResult.FAIL);
      expect(allMoves.get(enemyMove).checkFlag(moveFlag, enemyPokemon, null)).toBe(true);
    },
  );
});
