import { allMoves } from "#app/data/data-lists";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BerryPhase } from "#app/phases/berry-phase";
import { CommandPhase } from "#app/phases/command-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("Moves - Astonish", () => {
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
    game.override.battleType("single");
    game.override.moveset([MoveId.ASTONISH, MoveId.SPLASH]);
    game.override.enemySpecies(Species.BLASTOISE);
    game.override.enemyAbility(Abilities.INSOMNIA);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    game.override.startingLevel(100);
    game.override.enemyLevel(100);

    vi.spyOn(allMoves.get(MoveId.ASTONISH), "chance", "get").mockReturnValue(100);
  });

  test("move effect should cancel the target's move on the turn it applies", async () => {
    await game.startBattle([Species.MEOWSCARADA]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.ASTONISH);

    await game.phaseInterceptor.to(MoveEndPhase, false);

    expect(enemyPokemon.getTag(BattlerTagType.FLINCHED)).toBeDefined();

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(leadPokemon.hp).toBe(leadPokemon.getMaxHp());
    expect(enemyPokemon.getTag(BattlerTagType.FLINCHED)).toBeUndefined();

    await game.phaseInterceptor.to(CommandPhase, false);

    game.move.select(MoveId.SPLASH);

    await game.phaseInterceptor.to(BerryPhase, false);

    expect(leadPokemon.hp).toBeLessThan(leadPokemon.getMaxHp());
  });
});
