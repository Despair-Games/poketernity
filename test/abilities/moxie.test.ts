import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#app/battle";
import { EnemyCommandPhase } from "#app/phases/enemy-command-phase";
import { VictoryPhase } from "#app/phases/victory-phase";
import { TurnEndPhase } from "#app/phases/turn-end-phase";

describe("Abilities - Moxie", () => {
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
    const moveToUse = Moves.AERIAL_ACE;
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.RATTATA);
    game.overridesHelper.enemyAbility(Abilities.MOXIE);
    game.overridesHelper.ability(Abilities.MOXIE);
    game.overridesHelper.startingLevel(2000);
    game.overridesHelper.moveset([moveToUse]);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
  });

  it("should raise ATK stat stage by 1 when winning a battle", async () => {
    const moveToUse = Moves.AERIAL_ACE;
    await game.startBattle([Species.MIGHTYENA, Species.MIGHTYENA]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(0);

    game.move.select(moveToUse);
    await game.phaseInterceptor.runFrom(EnemyCommandPhase).to(VictoryPhase);

    expect(playerPokemon.getStatStage(Stat.ATK)).toBe(1);
  }, 20000);

  // TODO: Activate this test when MOXIE is corrected to work on faint and not on battle victory
  it.todo(
    "should raise ATK stat stage by 1 when defeating an ally Pokemon",
    async () => {
      game.overridesHelper.battleType("double");
      const moveToUse = Moves.AERIAL_ACE;
      await game.startBattle([Species.MIGHTYENA, Species.MIGHTYENA]);

      const [firstPokemon, secondPokemon] = game.scene.getPlayerField();

      expect(firstPokemon.getStatStage(Stat.ATK)).toBe(0);

      secondPokemon.hp = 1;

      game.move.select(moveToUse);
      game.selectTarget(BattlerIndex.PLAYER_2);

      await game.phaseInterceptor.to(TurnEndPhase);

      expect(firstPokemon.getStatStage(Stat.ATK)).toBe(1);
    },
    20000,
  );
});
