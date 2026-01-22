import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import { GameManager } from "#test/test-utils/game-manager";
import { ValueHolder } from "#utils/common-utils";
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
    game.override
      .battleType("single")
      .ability(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.SHIELD_DUST)
      .startingLevel(100)
      .moveset(MoveId.AIR_SLASH)
      .enemyMoveset(MoveId.TACKLE);
  });

  it("should set secondary move effect chances to 0", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.field.getEnemyPokemon().stats[Stat.SPDEF] = 10000;
    expect(game.field.getPlayerPokemon().formIndex).toBe(0);

    game.move.select(MoveId.AIR_SLASH);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("MoveEffectPhase", false);

    const phase = game.scene.phaseManager.getCurrentPhase<MoveEffectPhase>();
    const move = phase.move.getMove();
    expect(move.id).toBe(MoveId.AIR_SLASH);

    const moveChance = new ValueHolder(move.chance);
    applyAbAttrs("MoveEffectChanceMultiplierAbAttr", {
      pokemon: phase.getUserPokemon()!,
      simulated: false,
      moveChance,
      move,
    });

    applyAbAttrs("IgnoreMoveEffectsAbAttr", {
      pokemon: phase.getFirstTarget()!,
      simulated: false,
      attacker: phase.getUserPokemon()!,
      move,
      effectChance: moveChance,
    });
    expect(moveChance.value).toBe(0);
  });

  // TODO: King's Rock Interaction Unit Test
});
