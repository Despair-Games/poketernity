import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { toDmgValue } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Wimp Out", () => {
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
      .ability(AbilityId.WIMP_OUT)
      .enemySpecies(SpeciesId.NINJASK)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyPassiveAbility(AbilityId.NO_GUARD)
      .startingLevel(100)
      .enemyLevel(100)
      .moveset([MoveId.SPLASH, MoveId.FALSE_SWIPE, MoveId.ENDURE])
      .enemyMoveset(MoveId.FALSE_SWIPE)
      .disableCrits();
  });

  function confirmSwitch(): void {
    const [pokemon1, pokemon2] = game.scene.getPlayerParty();

    expect(pokemon1.species.speciesId).not.toBe(SpeciesId.WIMPOD);

    expect(pokemon2.species.speciesId).toBe(SpeciesId.WIMPOD);
    expect(pokemon2).not.toHaveFainted();
  }

  function confirmNoSwitch(): void {
    const [pokemon1, pokemon2] = game.scene.getPlayerParty();

    expect(pokemon2.species.speciesId).not.toBe(SpeciesId.WIMPOD);

    expect(pokemon1.species.speciesId).toBe(SpeciesId.WIMPOD);
    expect(pokemon1).not.toHaveFainted();
  }

  it("should force the source to switch out when damaged below half HP", async () => {
    game.override.startingLevel(1);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.move.use(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    confirmSwitch();
  });

  it("should not force switch if the source is already below half HP when damaged", async () => {
    game.override.startingLevel(1);

    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const wimpod = game.field.getPlayerPokemon();
    wimpod.hp = 2;
    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    confirmNoSwitch();
  });

  it("should force wild Pokemon to flee when triggered", async () => {
    game.override //
      .enemyAbility(AbilityId.WIMP_OUT)
      .enemyLevel(1);

    await game.classicMode.startBattle(SpeciesId.WIMPOD);

    const enemy = game.field.getEnemyPokemon();
    game.move.use(MoveId.FALSE_SWIPE);
    await game.toEndOfTurn();

    expect(enemy.isOnField()).toBeFalsy();
    expect(enemy.switchOutStatus).toBeTruthy();
  });

  it("should not force Boss Pokemon to flee", async () => {
    game.override //
      .enemyAbility(AbilityId.WIMP_OUT)
      .enemyPassiveAbility(AbilityId.STURDY)
      .enemyLevel(1)
      .enemyHealthSegments(2);

    await game.classicMode.startBattle(SpeciesId.WIMPOD);

    const enemy = game.field.getEnemyPokemon();
    game.move.use(MoveId.QUICK_ATTACK);
    await game.toEndOfTurn();

    expect(enemy).not.toHaveFainted();
    expect(enemy.isOnField()).toBeTruthy();
  });

  it("should force a switch even if the source is trapped", async () => {
    game.override.startingLevel(1);

    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.addTag(BattlerTagType.TRAPPED, 0, MoveId.NONE, enemy.id);

    game.move.use(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should trigger Regenerator exactly once when activated", async () => {
    game.override //
      .passiveAbility(AbilityId.REGENERATOR)
      .startingLevel(5);

    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const wimpod = game.field.getPlayerPokemon();

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(wimpod.hp).toEqual(Math.floor(wimpod.getMaxHp() * 0.33 + 1));
    confirmSwitch();
  });

  it("If this Ability activates due to being hit by U-turn or Volt Switch, the user of that move will not be switched out.", async () => {
    game.override.startingLevel(1).enemyMoveset([MoveId.U_TURN]).passiveAbility(AbilityId.STURDY);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    const hasFled = enemyPokemon.switchOutStatus;
    expect(hasFled).toBe(false);
    confirmSwitch();
  });

  it("If this Ability does not activate due to being hit by U-turn or Volt Switch, the user of that move will be switched out.", async () => {
    game.override.startingLevel(190).startingWave(8).enemyMoveset([MoveId.U_TURN]);
    await game.classicMode.startBattle(SpeciesId.GOLISOPOD, SpeciesId.TYRUNT);
    const RIVAL_NINJASK1 = game.field.getEnemyPokemon().id;
    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(game.field.getEnemyPokemon().id !== RIVAL_NINJASK1);
  });

  it("Dragon Tail and Circle Throw switch out Pokémon before the Ability activates.", async () => {
    game.override.startingLevel(500).enemyMoveset([MoveId.DRAGON_TAIL]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const wimpod = game.field.getPlayerPokemon();
    wimpod.hp *= 0.51;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.phaseInterceptor.to("SwitchPhase", false);

    expect(wimpod).not.toHaveAbilityApplied(AbilityId.WIMP_OUT);

    await game.toEndOfTurn();

    expect(game.field.getPlayerPokemon().species.speciesId).not.toBe(SpeciesId.WIMPOD);
  });

  it("triggers when recoil damage is taken", async () => {
    game.override.moveset([MoveId.HEAD_SMASH]).enemyMoveset([MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.move.select(MoveId.HEAD_SMASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    confirmSwitch();
  });

  it("should not activate when the Pokémon cuts its own HP", async () => {
    game.override.moveset([MoveId.SUBSTITUTE]).enemyMoveset([MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const wimpod = game.field.getPlayerPokemon();
    wimpod.hp *= 0.52;

    game.move.select(MoveId.SUBSTITUTE);
    await game.toEndOfTurn();

    confirmNoSwitch();
  });

  it("should not trigger when neutralized", async () => {
    game.override.enemyAbility(AbilityId.NEUTRALIZING_GAS).startingLevel(5);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    confirmNoSwitch();
  });

  it("should activate even if Shell Bell restores the source to above half HP", async () => {
    game.override
      .moveset([MoveId.DOUBLE_EDGE])
      .enemyMoveset([MoveId.SPLASH])
      .startingHeldItems([{ name: "SHELL_BELL", count: 4 }]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    const wimpod = game.field.getPlayerPokemon();

    wimpod.damageAndUpdate(toDmgValue(wimpod.getMaxHp() * 0.4));

    game.move.select(MoveId.DOUBLE_EDGE);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerParty()[1].hp).toBeGreaterThan(
      toDmgValue(game.scene.getPlayerParty()[1].getMaxHp() / 2),
    );
    expect(game.phaseInterceptor.log).toContain("SwitchPhase");
    expect(game.field.getPlayerPokemon().species.speciesId).toBe(SpeciesId.TYRUNT);
  });

  it("should activate due to weather damage", async () => {
    game.override.weather(WeatherType.HAIL).enemyMoveset([MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    confirmSwitch();
  });

  it("Does not trigger when enemy has sheer force", async () => {
    game.override.enemyAbility(AbilityId.SHEER_FORCE).enemyMoveset(MoveId.SLUDGE_BOMB).startingLevel(95);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.ENDURE);
    await game.toEndOfTurn();

    confirmNoSwitch();
  });

  it("should activate due to post turn status damage", async () => {
    game.override.statusEffect(StatusEffect.POISON).enemyMoveset([MoveId.SPLASH]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate due to bad dreams", async () => {
    game.override.statusEffect(StatusEffect.SLEEP).enemyAbility(AbilityId.BAD_DREAMS);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.52;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate due to leech seed", async () => {
    game.override.enemyMoveset([MoveId.LEECH_SEED]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.52;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate due to curse damage", async () => {
    game.override.enemySpecies(SpeciesId.DUSKNOIR).enemyMoveset([MoveId.CURSE]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.52;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate due to salt cure damage", async () => {
    game.override.enemySpecies(SpeciesId.NACLI).enemyMoveset([MoveId.SALT_CURE]).enemyLevel(1);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.7;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate due to damaging trap damage", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP).enemyMoveset([MoveId.WHIRLPOOL]).enemyLevel(1);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.55;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Magic Guard passive should not allow indirect damage to trigger Wimp Out", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 0, 1, MoveId.STEALTH_ROCK, ArenaTagSide.ENEMY);
    game.scene.arena.addTag(ArenaTagType.SPIKES, 0, 1, MoveId.SPIKES, ArenaTagSide.ENEMY);
    game.override
      .passiveAbility(AbilityId.MAGIC_GUARD)
      .enemyMoveset([MoveId.LEECH_SEED])
      .weather(WeatherType.HAIL)
      .statusEffect(StatusEffect.POISON);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerParty()[0].getHpRatio()).toEqual(0.51);
    expect(game.phaseInterceptor.log).not.toContain("SwitchPhase");
    expect(game.field.getPlayerPokemon().species.speciesId).toBe(SpeciesId.WIMPOD);
  });

  it("Wimp Out activating should not cancel a double battle", async () => {
    game.override.battleType("double").enemyAbility(AbilityId.WIMP_OUT).enemyMoveset([MoveId.SPLASH]).enemyLevel(1);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    const enemyLeadPokemon = game.scene.getEnemyParty()[0];
    const enemySecPokemon = game.scene.getEnemyParty()[1];

    game.move.select(MoveId.FALSE_SWIPE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    const isVisibleLead = enemyLeadPokemon.visible;
    const hasFledLead = enemyLeadPokemon.switchOutStatus;
    const isVisibleSec = enemySecPokemon.visible;
    const hasFledSec = enemySecPokemon.switchOutStatus;
    expect(!isVisibleLead && hasFledLead && isVisibleSec && !hasFledSec).toBe(true);
    expect(enemyLeadPokemon.hp).toBeLessThan(enemyLeadPokemon.getMaxHp());
    expect(enemySecPokemon.hp).toEqual(enemySecPokemon.getMaxHp());
  });

  it("should activate due to aftermath", async () => {
    game.override
      .moveset([MoveId.THUNDER_PUNCH])
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.AFTERMATH)
      .enemyMoveset([MoveId.SPLASH])
      .enemyLevel(1);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.THUNDER_PUNCH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    confirmSwitch();
  });

  it("Activates due to entry hazards", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 0, 1, MoveId.STEALTH_ROCK, ArenaTagSide.ENEMY);
    game.scene.arena.addTag(ArenaTagType.SPIKES, 0, 1, MoveId.SPIKES, ArenaTagSide.ENEMY);
    game.override.enemySpecies(SpeciesId.CENTISKORCH).enemyAbility(AbilityId.WIMP_OUT).startingWave(4);
    await game.classicMode.startBattle(SpeciesId.TYRUNT);

    expect(game.phaseInterceptor.log).not.toContain("MovePhase");
    expect(game.phaseInterceptor.log).toContain("BattleEndPhase");
  });

  it("should activate due to Nightmare", async () => {
    game.override.enemyMoveset([MoveId.NIGHTMARE]).statusEffect(StatusEffect.SLEEP);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    game.field.getPlayerPokemon().hp *= 0.65;

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("should activate after POST_APPLY move effects apply", async () => {
    game.override.enemyMoveset(MoveId.SLUDGE_BOMB).startingLevel(80);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    vi.spyOn(allMoves.get(MoveId.SLUDGE_BOMB), "chance", "get").mockReturnValue(100);

    game.move.select(MoveId.SPLASH);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerParty()[1].getStatusEffect(true)).toEqual(StatusEffect.POISON);
    confirmSwitch();
  });

  it("should activate after the last hit of multi hit moves", async () => {
    game.override.enemyMoveset(MoveId.BULLET_SEED).enemyAbility(AbilityId.SKILL_LINK);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.ENDURE);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(5);
    confirmSwitch();
  });

  it.todo("should activate after the last hit of Multi-Lens-boosted moves", async () => {
    game.override.enemyMoveset(MoveId.TACKLE);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.ENDURE);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(2);
    confirmSwitch();
  });

  it("should activate after the last hit of Parental-Bond-boosted moves", async () => {
    game.override.enemyMoveset(MoveId.TACKLE).enemyAbility(AbilityId.PARENTAL_BOND);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);

    game.field.getPlayerPokemon().hp *= 0.51;

    game.move.select(MoveId.ENDURE);
    game.selectPartyPokemon(1);
    await game.toEndOfTurn();

    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(2);
    confirmSwitch();
  });

  // TODO: This interaction is not implemented yet
  it.todo("should not activate when the Pokémon's HP falls below half due to hurting itself in confusion", async () => {
    game.override.moveset([MoveId.SWORDS_DANCE]).enemyMoveset([MoveId.SWAGGER]);
    await game.classicMode.startBattle(SpeciesId.WIMPOD, SpeciesId.TYRUNT);
    const playerPokemon = game.field.getPlayerPokemon();
    playerPokemon.hp *= 0.51;
    playerPokemon.setStatStage(Stat.ATK, 6);
    playerPokemon.addTag(BattlerTagType.CONFUSED);

    // TODO: add helper function to force confusion self-hits

    while (playerPokemon.getHpRatio() > 0.49) {
      game.move.select(MoveId.SWORDS_DANCE);
      await game.toEndOfTurn();
    }

    confirmNoSwitch();
  });

  it("should not skip battles when triggered in a double battle", async () => {
    const wave = 2;
    game.override
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.WIMPOD)
      .enemyAbility(AbilityId.WIMP_OUT)
      .moveset([MoveId.MATCHA_GOTCHA, MoveId.FALSE_SWIPE])
      .startingLevel(50)
      .enemyLevel(1)
      .battleType("double")
      .startingWave(wave);
    await game.classicMode.startBattle(SpeciesId.RAICHU, SpeciesId.PIKACHU);
    const [wimpod0, wimpod1] = game.scene.getEnemyField();

    game.move.select(MoveId.FALSE_SWIPE, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.MATCHA_GOTCHA, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(wimpod0.hp).toBeGreaterThan(0);
    expect(wimpod0.switchOutStatus).toBe(true);
    expect(wimpod0.isFainted()).toBe(false);
    expect(wimpod1.isFainted()).toBe(true);

    await game.toNextWave();
    expect(game.scene.currentBattle.waveIndex).toBe(wave + 1);
  });

  it("should not activate if the source is carried by Sky Drop", async () => {
    game.override
      .battleType("double")
      .enemySpecies(SpeciesId.WIMPOD)
      .enemyAbility(AbilityId.WIMP_OUT)
      .enemyMoveset(MoveId.SPLASH)
      .ability(AbilityId.NO_GUARD)
      .passiveAbility(AbilityId.PURE_POWER)
      .moveset([MoveId.SKY_DROP, MoveId.FALSE_SWIPE])
      .startingLevel(100)
      .enemyLevel(10);

    await game.classicMode.startBattle(SpeciesId.HAPPINY, SpeciesId.KARTANA);

    const player1 = game.scene.getPlayerField()[0];
    const enemy1 = game.scene.getEnemyField()[0];

    game.move.select(MoveId.SKY_DROP, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.FALSE_SWIPE, 1, BattlerIndex.ENEMY);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.phaseInterceptor.to("PostActionPhase");
    [player1, enemy1].forEach((p) => expect(p.getTag(BattlerTagType.SKY_DROP)).toBeDefined());

    await game.phaseInterceptor.to("PostActionPhase");

    expect(enemy1.getHpRatio()).toBeLessThanOrEqual(0.5);
    expect(enemy1).not.toHaveFainted();
    expect(enemy1.isOnField()).toBeTruthy();
    expect(enemy1).not.toHaveAbilityApplied(AbilityId.WIMP_OUT);
  });
});
