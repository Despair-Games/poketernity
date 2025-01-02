import { Stat } from "#enums/stat";
import { TurnEndPhase } from "#app/phases/turn-end-phase";
import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#app/battle";

// See also: TypeImmunityAbAttr
describe("Abilities - Volt Absorb", () => {
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
    game.overridesHelper.disableCrits();
  });

  it("does not activate when CHARGE is used", async () => {
    const moveToUse = Moves.CHARGE;
    const ability = Abilities.VOLT_ABSORB;

    game.overridesHelper.moveset([moveToUse]);
    game.overridesHelper.ability(ability);
    game.overridesHelper.enemyMoveset([Moves.SPLASH, Moves.NONE, Moves.NONE, Moves.NONE]);
    game.overridesHelper.enemySpecies(Species.DUSKULL);
    game.overridesHelper.enemyAbility(Abilities.BALL_FETCH);

    await game.classicMode.startBattle();

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(moveToUse);

    await game.phaseInterceptor.to(TurnEndPhase);

    expect(playerPokemon.getStatStage(Stat.SPDEF)).toBe(1);
    expect(playerPokemon.getTag(BattlerTagType.CHARGED)).toBeDefined();
    expect(game.phaseInterceptor.log).not.toContain("ShowAbilityPhase");
  });

  it("should activate regardless of accuracy checks", async () => {
    game.overridesHelper.moveset(Moves.THUNDERBOLT);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.enemyAbility(Abilities.VOLT_ABSORB);

    await game.classicMode.startBattle();

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDERBOLT);
    enemyPokemon.hp = enemyPokemon.hp - 1;
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    await game.moveHelper.forceMiss();
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });

  it("regardless of accuracy should not trigger on pokemon in semi invulnerable state", async () => {
    game.overridesHelper.moveset(Moves.THUNDERBOLT);
    game.overridesHelper.enemyMoveset(Moves.DIVE);
    game.overridesHelper.enemySpecies(Species.MAGIKARP);
    game.overridesHelper.enemyAbility(Abilities.VOLT_ABSORB);

    await game.classicMode.startBattle();

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.THUNDERBOLT);
    enemyPokemon.hp = enemyPokemon.hp - 1;
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);

    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.hp).toBeLessThan(enemyPokemon.getMaxHp());
  });
});
