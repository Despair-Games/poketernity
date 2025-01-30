import { ArenaTagSide } from "#enums/arena-tag-side";
import { allMoves } from "#app/data/all-moves";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AbilityApplyMode } from "#enums/ability-apply-mode";

describe("Abilities - Infiltrator", () => {
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
      .moveset([MoveId.TACKLE, MoveId.WATER_GUN, MoveId.SPORE, MoveId.BABY_DOLL_EYES])
      .ability(Abilities.INFILTRATOR)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each([
    { effectName: "Light Screen", tagType: ArenaTagType.LIGHT_SCREEN, moveId: MoveId.WATER_GUN },
    { effectName: "Reflect", tagType: ArenaTagType.REFLECT, moveId: MoveId.TACKLE },
    { effectName: "Aurora Veil", tagType: ArenaTagType.AURORA_VEIL, moveId: MoveId.TACKLE },
  ])("should bypass the target's $effectName", async ({ tagType, moveId }) => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    const preScreenDmg = enemy.getAttackDamage(player, allMoves[moveId], AbilityApplyMode.DEFAULT, false, false).damage;

    game.scene.arena.addTag(tagType, enemy.id, 1, MoveId.NONE, ArenaTagSide.ENEMY, true);

    const postScreenDmg = enemy.getAttackDamage(
      player,
      allMoves[moveId],
      AbilityApplyMode.DEFAULT,
      false,
      false,
    ).damage;

    expect(postScreenDmg).toBe(preScreenDmg);
    expect(player.battleData.abilitiesApplied[0]).toBe(Abilities.INFILTRATOR);
  });

  it("should bypass the target's Safeguard", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.scene.arena.addTag(ArenaTagType.SAFEGUARD, enemy.id, 1, MoveId.NONE, ArenaTagSide.ENEMY, true);

    game.move.select(MoveId.SPORE);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemy.status?.effect).toBe(StatusEffect.SLEEP);
    expect(player.battleData.abilitiesApplied[0]).toBe(Abilities.INFILTRATOR);
  });

  // TODO: fix this interaction to pass this test
  it.todo("should bypass the target's Mist", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    game.scene.arena.addTag(ArenaTagType.MIST, enemy.id, 1, MoveId.NONE, ArenaTagSide.ENEMY, true);

    game.move.select(MoveId.BABY_DOLL_EYES);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
    expect(player.battleData.abilitiesApplied[0]).toBe(Abilities.INFILTRATOR);
  });

  it("should bypass the target's Substitute", async () => {
    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.scene.getPlayerPokemon()!;
    const enemy = game.scene.getEnemyPokemon()!;

    enemy.addTag(BattlerTagType.SUBSTITUTE, 1, MoveId.NONE, enemy.id);

    game.move.select(MoveId.BABY_DOLL_EYES);

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemy.getStatStage(Stat.ATK)).toBe(-1);
    expect(player.battleData.abilitiesApplied[0]).toBe(Abilities.INFILTRATOR);
  });
});
