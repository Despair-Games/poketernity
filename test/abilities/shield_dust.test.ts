import { BattlerIndex } from "#app/battle";
import { IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effect-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "#app/data/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs, applyPreDefendAbAttrs } from "#app/data/ability";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { NumberHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Shield Dust", () => {
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
    game.overridesHelper.battleType("single");
    game.overridesHelper.enemySpecies(Species.ONIX);
    game.overridesHelper.enemyAbility(Abilities.SHIELD_DUST);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.moveset(Moves.AIR_SLASH);
    game.overridesHelper.enemyMoveset(Moves.TACKLE);
  });

  it("Shield Dust", async () => {
    await game.classicMode.startBattle([Species.PIDGEOT]);

    game.scene.getEnemyPokemon()!.stats[Stat.SPDEF] = 10000;
    expect(game.scene.getPlayerPokemon()!.formIndex).toBe(0);

    game.moveHelper.select(Moves.AIR_SLASH);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to(MoveEffectPhase, false);

    // Shield Dust negates secondary effect
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    const move = phase.move.getMove();
    expect(move.id).toBe(Moves.AIR_SLASH);

    const chance = new NumberHolder(move.chance);
    applyAbAttrs(
      MoveEffectChanceMultiplierAbAttr,
      phase.getUserPokemon()!,
      null,
      false,
      chance,
      move,
      phase.getFirstTarget(),
      false,
    );
    applyPreDefendAbAttrs(
      IgnoreMoveEffectsAbAttr,
      phase.getFirstTarget()!,
      phase.getUserPokemon()!,
      null,
      null,
      false,
      chance,
    );
    expect(chance.value).toBe(0);
  }, 20000);

  //TODO King's Rock Interaction Unit Test
});
