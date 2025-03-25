import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/data-lists";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Move Flag Power Boost Ability Attr", () => {
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // Note: All affected moves have been verified to have the flag required by all_moves
  it.each([
    {
      ability: AbilityId.MEGA_LAUNCHER,
      abilityName: "Mega Launcher",
      moveId: MoveId.DARK_PULSE,
      moveFlag: MoveFlags.PULSE_MOVE,
      factor: 1.5,
    },
    {
      ability: AbilityId.IRON_FIST,
      abilityName: "Iron Fist",
      moveId: MoveId.FIRE_PUNCH,
      moveFlag: MoveFlags.PUNCHING_MOVE,
      factor: 1.2,
    },
    {
      ability: AbilityId.TOUGH_CLAWS,
      abilityName: "Tough Claws",
      moveId: MoveId.TACKLE,
      moveFlag: MoveFlags.MAKES_CONTACT,
      factor: 1.3,
    },
    {
      ability: AbilityId.PUNK_ROCK,
      abilityName: "Punk Rock",
      moveId: MoveId.UPROAR,
      moveFlag: MoveFlags.SOUND_MOVE,
      factor: 1.3,
    },
    {
      ability: AbilityId.STRONG_JAW,
      abilityName: "Strong Jaw",
      moveId: MoveId.FIRE_FANG,
      moveFlag: MoveFlags.BITING_MOVE,
      factor: 1.5,
    },
    {
      ability: AbilityId.RECKLESS,
      abilityName: "Reckless",
      moveId: MoveId.TAKE_DOWN,
      moveFlag: MoveFlags.RECKLESS_MOVE,
      factor: 1.2,
    },
    {
      ability: AbilityId.SHARPNESS,
      abilityName: "Sharpness",
      moveId: MoveId.CUT,
      moveFlag: MoveFlags.SLICING_MOVE,
      factor: 1.5,
    },
  ])(
    "$abilityName should boost the damage of specific moves by a factor of $factor",
    async ({ ability, moveId: move, moveFlag, factor }) => {
      game.override.moveset(move).ability(ability);
      await game.classicMode.startBattle([SpeciesId.FEEBAS]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      const moveUsed = allMoves.get(move);
      vi.spyOn(moveUsed, "calculateBattlePower");

      game.move.select(move);
      await game.move.forceHit();
      await game.toEndOfTurn();

      expect(moveUsed.checkFlag(moveFlag, playerPokemon, null)).toBe(true);
      expect(moveUsed.calculateBattlePower).toHaveLastReturnedWith(moveUsed.power * factor);
    },
  );
});
