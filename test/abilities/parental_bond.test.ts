import { Type } from "#enums/type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Parental Bond", () => {
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
    game.overridesHelper.ability(Abilities.PARENTAL_BOND);
    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyAbility(Abilities.FUR_COAT);
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);
  });

  it("should add second strike to attack move", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    let enemyStartingHp = enemyPokemon.hp;

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to("DamageAnimPhase");
    const firstStrikeDamage = enemyStartingHp - enemyPokemon.hp;
    enemyStartingHp = enemyPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    const secondStrikeDamage = enemyStartingHp - enemyPokemon.hp;

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(secondStrikeDamage).toBe(toDmgValue(0.25 * firstStrikeDamage));
  });

  it("should apply secondary effects to both strikes", async () => {
    game.overridesHelper.moveset([Moves.POWER_UP_PUNCH]);
    game.overridesHelper.enemySpecies(Species.AMOONGUSS);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.POWER_UP_PUNCH);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(2);
  });

  it("should not apply to Status moves", async () => {
    game.overridesHelper.moveset([Moves.BABY_DOLL_EYES]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.BABY_DOLL_EYES);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not apply to multi-hit moves", async () => {
    game.overridesHelper.moveset([Moves.DOUBLE_HIT]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.DOUBLE_HIT);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(2);
  });

  it("should not apply to self-sacrifice moves", async () => {
    game.overridesHelper.moveset([Moves.SELF_DESTRUCT]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SELF_DESTRUCT);

    await game.phaseInterceptor.to("DamageAnimPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(1);
  });

  it("should not apply to Rollout", async () => {
    game.overridesHelper.moveset([Moves.ROLLOUT]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.ROLLOUT);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(1);
  });

  it("should not apply multiplier to fixed-damage moves", async () => {
    game.overridesHelper.moveset([Moves.DRAGON_RAGE]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.DRAGON_RAGE);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp() - 80);
  });

  it("should not apply multiplier to counter moves", async () => {
    game.overridesHelper.moveset([Moves.COUNTER]);
    game.overridesHelper.enemyMoveset([Moves.TACKLE]);

    await game.classicModeHelper.startBattle([Species.SHUCKLE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.COUNTER);
    await game.phaseInterceptor.to("DamageAnimPhase");

    const playerDamage = leadPokemon.getMaxHp() - leadPokemon.hp;

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp() - 4 * playerDamage);
  });

  it("should not apply to multi-target moves", async () => {
    game.overridesHelper.battleType("double");
    game.overridesHelper.moveset([Moves.EARTHQUAKE]);
    game.overridesHelper.passiveAbility(Abilities.LEVITATE);

    await game.classicModeHelper.startBattle([Species.MAGIKARP, Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();

    game.moveHelper.select(Moves.EARTHQUAKE);
    game.moveHelper.select(Moves.EARTHQUAKE, 1);

    await game.phaseInterceptor.to("BerryPhase", false);

    playerPokemon.forEach((p) => expect(p.turnData.hitCount).toBe(1));
  });

  it("should apply to multi-target moves when hitting only one target", async () => {
    game.overridesHelper.moveset([Moves.EARTHQUAKE]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.EARTHQUAKE);
    await game.phaseInterceptor.to("DamageAnimPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(2);
  });

  it("should only trigger post-target move effects once", async () => {
    game.overridesHelper.moveset([Moves.MIND_BLOWN]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.MIND_BLOWN);

    await game.phaseInterceptor.to("DamageAnimPhase", false);

    expect(leadPokemon.turnData.hitCount).toBe(2);

    // This test will time out if the user faints
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.hp).toBe(Math.ceil(leadPokemon.getMaxHp() / 2));
  });

  it("Burn Up only removes type after the second strike", async () => {
    game.overridesHelper.moveset([Moves.BURN_UP]);

    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.BURN_UP);

    await game.phaseInterceptor.to("MoveEffectPhase");

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(enemyPokemon.hp).toBeGreaterThan(0);
    expect(leadPokemon.isOfType(Type.FIRE)).toBe(true);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.isOfType(Type.FIRE)).toBe(false);
  });

  it("Moves boosted by this ability and Multi-Lens should strike 3 times", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.startingHeldItems([{ name: "MULTI_LENS", count: 1 }]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(3);
  });

  it("Seismic Toss boosted by this ability and Multi-Lens should strike 3 times", async () => {
    game.overridesHelper.moveset([Moves.SEISMIC_TOSS]);
    game.overridesHelper.startingHeldItems([{ name: "MULTI_LENS", count: 1 }]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    const enemyStartingHp = enemyPokemon.hp;

    game.moveHelper.select(Moves.SEISMIC_TOSS);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(3);

    await game.phaseInterceptor.to("MoveEndPhase", false);

    expect(enemyPokemon.hp).toBe(enemyStartingHp - 200);
  });

  it("Hyper Beam boosted by this ability should strike twice, then recharge", async () => {
    game.overridesHelper.moveset([Moves.HYPER_BEAM]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.HYPER_BEAM);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(leadPokemon.getTag(BattlerTagType.RECHARGING)).toBeUndefined();

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(leadPokemon.getTag(BattlerTagType.RECHARGING)).toBeDefined();
  });

  it("Anchor Shot boosted by this ability should only trap the target after the second hit", async () => {
    game.overridesHelper.moveset([Moves.ANCHOR_SHOT]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.ANCHOR_SHOT);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(enemyPokemon.getTag(BattlerTagType.TRAPPED)).toBeUndefined();

    await game.phaseInterceptor.to("MoveEndPhase");
    expect(enemyPokemon.getTag(BattlerTagType.TRAPPED)).toBeDefined();

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getTag(BattlerTagType.TRAPPED)).toBeDefined();
  });

  it("Smack Down boosted by this ability should only ground the target after the second hit", async () => {
    game.overridesHelper.moveset([Moves.SMACK_DOWN]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SMACK_DOWN);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(enemyPokemon.getTag(BattlerTagType.IGNORE_FLYING)).toBeUndefined();

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(enemyPokemon.getTag(BattlerTagType.IGNORE_FLYING)).toBeDefined();
  });

  it("U-turn boosted by this ability should strike twice before forcing a switch", async () => {
    game.overridesHelper.moveset([Moves.U_TURN]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP, Species.BLASTOISE]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.U_TURN);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("MoveEffectPhase");
    expect(leadPokemon.turnData.hitCount).toBe(2);

    // This will cause this test to time out if the switch was forced on the first hit.
    await game.phaseInterceptor.to("MoveEffectPhase", false);
  });

  it("Wake-Up Slap boosted by this ability should only wake up the target after the second hit", async () => {
    game.overridesHelper.moveset([Moves.WAKE_UP_SLAP]).enemyStatusEffect(StatusEffect.SLEEP);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.WAKE_UP_SLAP);
    await game.moveHelper.forceHit();

    await game.phaseInterceptor.to("DamageAnimPhase");

    expect(leadPokemon.turnData.hitCount).toBe(2);
    expect(enemyPokemon.status?.effect).toBe(StatusEffect.SLEEP);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status?.effect).toBeUndefined();
  });

  it("should not cause user to hit into King's Shield more than once", async () => {
    game.overridesHelper.moveset([Moves.TACKLE]);
    game.overridesHelper.enemyMoveset([Moves.KINGS_SHIELD]);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const leadPokemon = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.TACKLE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(leadPokemon.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not cause user to hit into Storm Drain more than once", async () => {
    game.overridesHelper.moveset([Moves.WATER_GUN]);
    game.overridesHelper.enemyAbility(Abilities.STORM_DRAIN);

    await game.classicModeHelper.startBattle([Species.MAGIKARP]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.WATER_GUN);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.getStatStage(Stat.SPATK)).toBe(1);
  });

  it("should not allow Future Sight to hit infinitely many times if the user switches out", async () => {
    game.overridesHelper.enemyLevel(1000).moveset(Moves.FUTURE_SIGHT);
    await game.classicModeHelper.startBattle([Species.BULBASAUR, Species.CHARMANDER, Species.SQUIRTLE]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "damageAndUpdate");

    game.moveHelper.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.toNextTurn();

    game.doSwitchPokemon(2);
    await game.toNextTurn();

    // TODO: Update hit count to 1 once Future Sight is fixed to not activate abilities if user is off the field
    expect(enemyPokemon.damageAndUpdate).toHaveBeenCalledTimes(2);
  });
});
