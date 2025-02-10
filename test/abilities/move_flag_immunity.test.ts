import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MoveFlags } from "#enums/move-flags";
import { MoveResult } from "#enums/move-result";
import { allMoves } from "#app/data/all-moves";

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
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  // Flagged moves verified by the all_moves test in the `moves` directory
  it.each([
    {
      abilityName: "Soundproof",
      ability: Abilities.SOUNDPROOF,
      moveFlag: MoveFlags.SOUND_MOVE,
      enemyMoveId: MoveId.UPROAR,
    },
    {
      abilityName: "Overcoat",
      ability: Abilities.OVERCOAT,
      moveFlag: MoveFlags.POWDER_MOVE,
      enemyMoveId: MoveId.STUN_SPORE,
    },
    {
      abilityName: "Bulletproof",
      ability: Abilities.BULLETPROOF,
      moveFlag: MoveFlags.BULLET_MOVE,
      enemyMoveId: MoveId.AURA_SPHERE,
    },
  ])(
    "$abilityName should provide immunity against the flagged moves",
    async ({ ability, moveFlag, enemyMoveId: enemyMove }) => {
      game.override.ability(ability).enemyMoveset(enemyMove);

      await game.classicMode.startBattle([Species.FEEBAS]);
      const enemyPokemon = game.scene.getEnemyPokemon()!;

      game.move.select(MoveId.SPLASH);
      await game.move.forceHit();
      await game.phaseInterceptor.to("BerryPhase");

      const lastEnemyMove = enemyPokemon.getLastXMoves()[0];
      expect(lastEnemyMove.result).toBe(MoveResult.FAIL);
      expect(allMoves[enemyMove].checkFlag(moveFlag, enemyPokemon, null)).toBe(true);
    },
  );
});
