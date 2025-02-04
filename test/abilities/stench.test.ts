import { BattlerIndex } from "#enums/battler-index";
import { PostAttackApplyBattlerTagAbAttr } from "#app/data/ab-attrs/post-attack-apply-battler-tag-ab-attr";
import { FlinchAttr } from "#app/data/move-attrs/flinch-attr";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Stench", () => {
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
      .ability(Abilities.STENCH)
      .moveset([MoveId.TACKLE, MoveId.SPLASH, MoveId.HEADBUTT])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("Stench should have a base 10% chance of applying flinch to the target Pokemon", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(MoveId.TACKLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(abilityAttr.getChance).toHaveLastReturnedWith(10);
  });

  it("Stench should not stack with moves that already have a chance to flinch", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;
    const headbuttMove = playerPokemon
      ?.getMoveset()
      .find((m) => m?.moveId === MoveId.HEADBUTT)
      ?.getMove();
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(MoveId.HEADBUTT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(headbuttMove?.hasAttr(FlinchAttr)).toBe(true);
    expect(abilityAttr.getChance).toHaveLastReturnedWith(0);
  });

  it("Stench should not bypass the enemy Pokemon's substitute under normal conditions", async () => {
    game.override.enemyMoveset([MoveId.SPLASH, MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    const abilityAttr = playerPokemon
      ?.getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;

    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.SUBSTITUTE);
    await game.toNextTurn();
    vi.spyOn(abilityAttr, "getChance");
    game.move.select(MoveId.TACKLE);
    await game.forceEnemyMove(MoveId.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("BerryPhase");
    expect(abilityAttr.getChance).not.toHaveBeenCalled();
  });

  it("Stench should not apply against a target with Shield Dust, unless the attack ignores abilities", async () => {
    game.override.enemyAbility(Abilities.SHIELD_DUST).moveset([MoveId.TACKLE, MoveId.MOONGEIST_BEAM]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    const abilityAttr = playerPokemon
      .getAbility()
      .getAttrs(PostAttackApplyBattlerTagAbAttr)[0] as PostAttackApplyBattlerTagAbAttr;

    vi.spyOn(abilityAttr, "getChance");

    game.move.select(MoveId.TACKLE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");
    expect(abilityAttr.getChance).not.toHaveBeenCalled();

    await game.toNextTurn();
    game.move.select(MoveId.MOONGEIST_BEAM);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");
    expect(abilityAttr.getChance).toHaveLastReturnedWith(10);
  });
});
