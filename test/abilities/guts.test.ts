import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BypassBurnDamageReductionAbAttr } from "#abilities/bypass-burn-damage-reduction-ab-attr";
import { NON_VOLATILE_STATUS_EFFECTS } from "#app/constants/game-constants";
import { BattlerIndex } from "#app/enums/battler-index";
import { Stat } from "#app/enums/stat";
import { StatusEffect } from "#app/enums/status-effect";
import { capitalizeString } from "#app/utils/string-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { BooleanHolder } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const nonVolatileStatusEffects = NON_VOLATILE_STATUS_EFFECTS.map<[string, StatusEffect]>((statusEffect) => [
  capitalizeString(StatusEffect[statusEffect], "_", false, true) ?? "",
  statusEffect,
]);

//#endregion

describe("Ability - Guts", () => {
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
      .ability(AbilityId.GUTS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(9)
      .enemyLevel(10);
  });

  it("should not apply an attack boost with no status effect", async () => {
    const { field, classicMode, move } = game;

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    const playerAtk = player.getStat(Stat.ATK);

    expect(player).toHaveStatusEffect(StatusEffect.NONE);
    expect(player).toHaveEffectiveStat(Stat.ATK, playerAtk);
  });

  it("should not apply an attack boost with confusion status effect", async () => {
    const { field, classicMode, move } = game;

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    move.use(MoveId.SPLASH);
    await move.selectEnemyMove(MoveId.CONFUSE_RAY);
    await move.forceHit();
    await game.toEndOfTurn();
    const playerAtk = player.getStat(Stat.ATK);

    expect(player).toHaveStatusEffect(StatusEffect.NONE);
    expect(player).toHaveEffectiveStat(Stat.ATK, playerAtk);
    expect(player).toHaveBattlerTagType(BattlerTagType.CONFUSED);
  });

  it.each(nonVolatileStatusEffects)(
    "should apply a 1.5x attack boost with '%s' status effect",
    async (_name, statusEffect) => {
      const { override, classicMode, field, move } = game;
      override.statusEffect(statusEffect);

      await classicMode.startBattle(SpeciesId.FEEBAS);
      const player = field.getPlayerPokemon();
      move.use(MoveId.SPLASH);
      await game.toEndOfTurn();
      const playerAtk = player.getStat(Stat.ATK);

      expect(player).toHaveStatusEffect(statusEffect);
      expect(player).toHaveEffectiveStat(Stat.ATK, Math.floor(playerAtk * 1.5));
    },
  );

  it.each([
    { id: AbilityId.HUSTLE, name: "Hustle", multiplier: 1.5 },
    { id: AbilityId.PURE_POWER, name: "Pure Power", multiplier: 2.0 },
    { id: AbilityId.HUGE_POWER, name: "Huge Power", multiplier: 2.0 },
  ])("should stack with $name ability", async ({ id, multiplier }) => {
    const { override, field, classicMode, move } = game;
    override.statusEffect(StatusEffect.PARALYSIS).passiveAbility(id);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    const playerAtk = player.getStat(Stat.ATK);

    expect(player).toHaveStatusEffect(StatusEffect.PARALYSIS);
    expect(player).toHaveEffectiveStat(Stat.ATK, Math.floor(playerAtk * 1.5 * multiplier));
  });

  it("should prevent damage reduction from 'Burn' status effect", async () => {
    const { override, classicMode, field, move } = game;
    override.statusEffect(StatusEffect.BURN);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    const enemy = field.getEnemyPokemon();
    move.use(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(player).toHaveStatusEffect(StatusEffect.BURN);
    expect(enemy).toHaveTakenDamage(5);

    const burnDamageReductionCancelled = new BooleanHolder(false);
    applyAbAttrs<BypassBurnDamageReductionAbAttr>(
      AbAttrFlag.BYPASS_BURN_DAMAGE_REDUCTION,
      player,
      true,
      burnDamageReductionCancelled,
    );

    expect(burnDamageReductionCancelled.value).toBe(true);
  });

  it("should not boost atk when thawing itself", async () => {
    const { override, classicMode, field, move } = game;
    override.statusEffect(StatusEffect.FREEZE);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    const enemy = field.getEnemyPokemon();

    expect(player).toHaveStatusEffect(StatusEffect.FREEZE);

    move.use(MoveId.FLAME_WHEEL);
    await game.toEndOfTurn();
    const playerAtk = player.getStat(Stat.ATK);

    expect(player).toHaveStatusEffect(StatusEffect.NONE);
    expect(player).toHaveEffectiveStat(Stat.ATK, playerAtk);
    expect(enemy).toHaveTakenDamage(2);
  });

  it("should boost atk with 'Comatose' ability", async () => {
    const { override, classicMode, field, move } = game;
    override.passiveAbility(AbilityId.COMATOSE);

    await classicMode.startBattle(SpeciesId.FEEBAS);
    const player = field.getPlayerPokemon();
    move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    const playerAtk = player.getStat(Stat.ATK);

    expect(player).toHaveStatusEffect(StatusEffect.SLEEP);
    expect(player).toHaveEffectiveStat(Stat.ATK, Math.floor(playerAtk * 1.5));
  });
});
