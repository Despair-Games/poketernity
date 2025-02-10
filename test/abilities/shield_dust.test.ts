import { BattlerIndex } from "#enums/battler-index";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { NumberHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
    game.override.battleType("single");
    game.override.enemySpecies(Species.ONIX);
    game.override.enemyAbility(Abilities.SHIELD_DUST);
    game.override.startingLevel(100);
    game.override.moveset(MoveId.AIR_SLASH);
    game.override.enemyMoveset(MoveId.TACKLE);
  });

  it("Shield Dust", async () => {
    await game.classicMode.startBattle([Species.PIDGEOT]);

    game.scene.getEnemyPokemon()!.stats[Stat.SPDEF] = 10000;
    expect(game.scene.getPlayerPokemon()!.formIndex).toBe(0);

    game.move.select(MoveId.AIR_SLASH);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to(MoveEffectPhase, false);

    // Shield Dust negates secondary effect
    const phase = game.scene.getCurrentPhase() as MoveEffectPhase;
    const move = phase.move.getMove();
    expect(move.id).toBe(MoveId.AIR_SLASH);

    const chance = new NumberHolder(move.chance);
    applyAbAttrs(AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER, phase.getUserPokemon()!, false, chance, move, false);
    applyAbAttrs(AbAttrFlag.IGNORE_MOVE_EFFECTS, phase.getFirstTarget()!, false, phase.getUserPokemon()!, move, chance);
    expect(chance.value).toBe(0);
  }, 20000);

  //TODO King's Rock Interaction Unit Test
});
