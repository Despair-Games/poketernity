import { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";
import { ArenaTagSide } from "#app/data/arena-tag";
import { toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper
      .battleType("single")
      .ability(Abilities.WIMP_OUT)
      .enemySpecies(Species.NINJASK)
      .enemyPassiveAbility(Abilities.NO_GUARD)
      .startingLevel(90)
      .enemyLevel(70)
      .moveset([Moves.SPLASH, Moves.FALSE_SWIPE, Moves.ENDURE])
      .enemyMoveset(Moves.FALSE_SWIPE)
      .disableCrits();
  });

  function confirmSwitch(): void {
    const [pokemon1, pokemon2] = game.scene.getPlayerParty();

    expect(game.phaseInterceptor.log).toContain("SwitchSummonPhase");

    expect(pokemon1.species.speciesId).not.toBe(Species.WIMPOD);

    expect(pokemon2.species.speciesId).toBe(Species.WIMPOD);
    expect(pokemon2.isFainted()).toBe(false);
    expect(pokemon2.getHpRatio()).toBeLessThan(0.5);
  }

  function confirmNoSwitch(): void {
    const [pokemon1, pokemon2] = game.scene.getPlayerParty();

    expect(game.phaseInterceptor.log).not.toContain("SwitchSummonPhase");

    expect(pokemon2.species.speciesId).not.toBe(Species.WIMPOD);

    expect(pokemon1.species.speciesId).toBe(Species.WIMPOD);
    expect(pokemon1.isFainted()).toBe(false);
    expect(pokemon1.getHpRatio()).toBeLessThan(0.5);
  }

  it("triggers regenerator passive single time when switching out with wimp out", async () => {
    game.overridesHelper.passiveAbility(Abilities.REGENERATOR).startingLevel(5).enemyLevel(100);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    const wimpod = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(wimpod.hp).toEqual(Math.floor(wimpod.getMaxHp() * 0.33 + 1));
    confirmSwitch();
  });

  it("It makes wild pokemon flee if triggered", async () => {
    game.overridesHelper.enemyAbility(Abilities.WIMP_OUT);
    await game.classicModeHelper.startBattle([Species.GOLISOPOD, Species.TYRUNT]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.hp *= 0.52;

    game.moveHelper.select(Moves.FALSE_SWIPE);
    await game.phaseInterceptor.to("BerryPhase");

    const isVisible = enemyPokemon.visible;
    const hasFled = enemyPokemon.switchOutStatus;
    expect(!isVisible && hasFled).toBe(true);
  });

  it("Does not trigger when HP already below half", async () => {
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    const wimpod = game.scene.getPlayerPokemon()!;
    wimpod.hp = 5;

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(wimpod.hp).toEqual(1);
    confirmNoSwitch();
  });

  it("Trapping moves do not prevent Wimp Out from activating.", async () => {
    game.overridesHelper.enemyMoveset([Moves.SPIRIT_SHACKLE]).startingLevel(53).enemyLevel(45);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.phaseInterceptor.log).toContain("SwitchSummonPhase");
    expect(game.scene.getPlayerPokemon()!.getTag(BattlerTagType.TRAPPED)).toBeUndefined();
    expect(game.scene.getPlayerParty()[1].getTag(BattlerTagType.TRAPPED)).toBeUndefined();
    confirmSwitch();
  });

  it("If this Ability activates due to being hit by U-turn or Volt Switch, the user of that move will not be switched out.", async () => {
    game.overridesHelper.startingLevel(95).enemyMoveset([Moves.U_TURN]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const hasFled = enemyPokemon.switchOutStatus;
    expect(hasFled).toBe(false);
    confirmSwitch();
  });

  it("If this Ability does not activate due to being hit by U-turn or Volt Switch, the user of that move will be switched out.", async () => {
    game.overridesHelper.startingLevel(190).startingWave(8).enemyMoveset([Moves.U_TURN]);
    await game.classicModeHelper.startBattle([Species.GOLISOPOD, Species.TYRUNT]);
    const RIVAL_NINJASK1 = game.scene.getEnemyPokemon()?.id;
    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(game.scene.getEnemyPokemon()?.id !== RIVAL_NINJASK1);
  });

  it("Dragon Tail and Circle Throw switch out Pokémon before the Ability activates.", async () => {
    game.overridesHelper.startingLevel(69).enemyMoveset([Moves.DRAGON_TAIL]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    const wimpod = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("SwitchSummonPhase", false);

    expect(wimpod.summonData.abilitiesApplied).not.toContain(Abilities.WIMP_OUT);

    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.getPlayerPokemon()!.species.speciesId).not.toBe(Species.WIMPOD);
  });

  it("triggers when recoil damage is taken", async () => {
    game.overridesHelper.moveset([Moves.HEAD_SMASH]).enemyMoveset([Moves.SPLASH]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.moveHelper.select(Moves.HEAD_SMASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmSwitch();
  });

  it("It does not activate when the Pokémon cuts its own HP", async () => {
    game.overridesHelper.moveset([Moves.SUBSTITUTE]).enemyMoveset([Moves.SPLASH]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    const wimpod = game.scene.getPlayerPokemon()!;
    wimpod.hp *= 0.52;

    game.moveHelper.select(Moves.SUBSTITUTE);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmNoSwitch();
  });

  it("Does not trigger when neutralized", async () => {
    game.overridesHelper.enemyAbility(Abilities.NEUTRALIZING_GAS).startingLevel(5);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmNoSwitch();
  });

  // TODO: Enable when this behavior is fixed (currently Shell Bell won't activate if Wimp Out activates because
  // the pokemon is removed from the field before the Shell Bell modifier is applied, so it can't see the
  // damage dealt and doesn't heal the pokemon)
  it.todo(
    "If it falls below half and recovers back above half from a Shell Bell, Wimp Out will activate even after the Shell Bell recovery",
    async () => {
      game.overridesHelper
        .moveset([Moves.DOUBLE_EDGE])
        .enemyMoveset([Moves.SPLASH])
        .startingHeldItems([{ name: "SHELL_BELL", count: 4 }]);
      await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

      const wimpod = game.scene.getPlayerPokemon()!;

      wimpod.damageAndUpdate(toDmgValue(wimpod.getMaxHp() * 0.4));

      game.moveHelper.select(Moves.DOUBLE_EDGE);
      game.doSelectPartyPokemon(1);
      await game.phaseInterceptor.to("TurnEndPhase");

      expect(game.scene.getPlayerParty()[1].hp).toBeGreaterThan(
        toDmgValue(game.scene.getPlayerParty()[1].getMaxHp() / 2),
      );
      expect(game.phaseInterceptor.log).toContain("SwitchSummonPhase");
      expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(Species.TYRUNT);
    },
  );

  it("Wimp Out will activate due to weather damage", async () => {
    game.overridesHelper.weather(WeatherType.HAIL).enemyMoveset([Moves.SPLASH]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmSwitch();
  });

  it("Does not trigger when enemy has sheer force", async () => {
    game.overridesHelper.enemyAbility(Abilities.SHEER_FORCE).enemyMoveset(Moves.SLUDGE_BOMB).startingLevel(95);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.ENDURE);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmNoSwitch();
  });

  it("Wimp Out will activate due to post turn status damage", async () => {
    game.overridesHelper.statusEffect(StatusEffect.POISON).enemyMoveset([Moves.SPLASH]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Wimp Out will activate due to bad dreams", async () => {
    game.overridesHelper.statusEffect(StatusEffect.SLEEP).enemyAbility(Abilities.BAD_DREAMS);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.52;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Wimp Out will activate due to leech seed", async () => {
    game.overridesHelper.enemyMoveset([Moves.LEECH_SEED]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.52;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Wimp Out will activate due to curse damage", async () => {
    game.overridesHelper.enemySpecies(Species.DUSKNOIR).enemyMoveset([Moves.CURSE]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.52;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Wimp Out will activate due to salt cure damage", async () => {
    game.overridesHelper.enemySpecies(Species.NACLI).enemyMoveset([Moves.SALT_CURE]).enemyLevel(1);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.7;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Wimp Out will activate due to damaging trap damage", async () => {
    game.overridesHelper.enemySpecies(Species.MAGIKARP).enemyMoveset([Moves.WHIRLPOOL]).enemyLevel(1);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.55;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("Magic Guard passive should not allow indirect damage to trigger Wimp Out", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 1, Moves.STEALTH_ROCK, 0, ArenaTagSide.ENEMY);
    game.scene.arena.addTag(ArenaTagType.SPIKES, 1, Moves.SPIKES, 0, ArenaTagSide.ENEMY);
    game.overridesHelper
      .passiveAbility(Abilities.MAGIC_GUARD)
      .enemyMoveset([Moves.LEECH_SEED])
      .weather(WeatherType.HAIL)
      .statusEffect(StatusEffect.POISON);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.getPlayerParty()[0].getHpRatio()).toEqual(0.51);
    expect(game.phaseInterceptor.log).not.toContain("SwitchSummonPhase");
    expect(game.scene.getPlayerPokemon()!.species.speciesId).toBe(Species.WIMPOD);
  });

  it("Wimp Out activating should not cancel a double battle", async () => {
    game.overridesHelper
      .battleType("double")
      .enemyAbility(Abilities.WIMP_OUT)
      .enemyMoveset([Moves.SPLASH])
      .enemyLevel(1);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    const enemyLeadPokemon = game.scene.getEnemyParty()[0];
    const enemySecPokemon = game.scene.getEnemyParty()[1];

    game.moveHelper.select(Moves.FALSE_SWIPE, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.SPLASH, 1);

    await game.phaseInterceptor.to("BerryPhase");

    const isVisibleLead = enemyLeadPokemon.visible;
    const hasFledLead = enemyLeadPokemon.switchOutStatus;
    const isVisibleSec = enemySecPokemon.visible;
    const hasFledSec = enemySecPokemon.switchOutStatus;
    expect(!isVisibleLead && hasFledLead && isVisibleSec && !hasFledSec).toBe(true);
    expect(enemyLeadPokemon.hp).toBeLessThan(enemyLeadPokemon.getMaxHp());
    expect(enemySecPokemon.hp).toEqual(enemySecPokemon.getMaxHp());
  });

  it("Wimp Out will activate due to aftermath", async () => {
    game.overridesHelper
      .moveset([Moves.THUNDER_PUNCH])
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.AFTERMATH)
      .enemyMoveset([Moves.SPLASH])
      .enemyLevel(1);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.THUNDER_PUNCH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    confirmSwitch();
  });

  it("Activates due to entry hazards", async () => {
    game.scene.arena.addTag(ArenaTagType.STEALTH_ROCK, 1, Moves.STEALTH_ROCK, 0, ArenaTagSide.ENEMY);
    game.scene.arena.addTag(ArenaTagType.SPIKES, 1, Moves.SPIKES, 0, ArenaTagSide.ENEMY);
    game.overridesHelper.enemySpecies(Species.CENTISKORCH).enemyAbility(Abilities.WIMP_OUT).startingWave(4);
    await game.classicModeHelper.startBattle([Species.TYRUNT]);

    expect(game.phaseInterceptor.log).not.toContain("MovePhase");
    expect(game.phaseInterceptor.log).toContain("BattleEndPhase");
  });

  it("Wimp Out will activate due to Nightmare", async () => {
    game.overridesHelper.enemyMoveset([Moves.NIGHTMARE]).statusEffect(StatusEffect.SLEEP);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    game.scene.getPlayerPokemon()!.hp *= 0.65;

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    confirmSwitch();
  });

  it("triggers status on the wimp out user before a new pokemon is switched in", async () => {
    game.overridesHelper.enemyMoveset(Moves.SLUDGE_BOMB).startingLevel(80);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
    vi.spyOn(allMoves[Moves.SLUDGE_BOMB], "chance", "get").mockReturnValue(100);

    game.moveHelper.select(Moves.SPLASH);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(game.scene.getPlayerParty()[1].status?.effect).toEqual(StatusEffect.POISON);
    confirmSwitch();
  });

  it("triggers after last hit of multi hit move", async () => {
    game.overridesHelper.enemyMoveset(Moves.BULLET_SEED).enemyAbility(Abilities.SKILL_LINK);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.ENDURE);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(5);
    confirmSwitch();
  });

  it("triggers after last hit of multi hit move (multi lens)", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE).enemyHeldItems([{ name: "MULTI_LENS", count: 1 }]);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.ENDURE);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(2);
    confirmSwitch();
  });
  it("triggers after last hit of Parental Bond", async () => {
    game.overridesHelper.enemyMoveset(Moves.TACKLE).enemyAbility(Abilities.PARENTAL_BOND);
    await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);

    game.scene.getPlayerPokemon()!.hp *= 0.51;

    game.moveHelper.select(Moves.ENDURE);
    game.doSelectPartyPokemon(1);
    await game.phaseInterceptor.to("TurnEndPhase");

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.turnData.hitsLeft).toBe(0);
    expect(enemyPokemon.turnData.hitCount).toBe(2);
    confirmSwitch();
  });

  // TODO: This interaction is not implemented yet
  it.todo(
    "Wimp Out will not activate if the Pokémon's HP falls below half due to hurting itself in confusion",
    async () => {
      game.overridesHelper.moveset([Moves.SWORDS_DANCE]).enemyMoveset([Moves.SWAGGER]);
      await game.classicModeHelper.startBattle([Species.WIMPOD, Species.TYRUNT]);
      const playerPokemon = game.scene.getPlayerPokemon()!;
      playerPokemon.hp *= 0.51;
      playerPokemon.setStatStage(Stat.ATK, 6);
      playerPokemon.addTag(BattlerTagType.CONFUSED);

      // TODO: add helper function to force confusion self-hits

      while (playerPokemon.getHpRatio() > 0.49) {
        game.moveHelper.select(Moves.SWORDS_DANCE);
        await game.phaseInterceptor.to("TurnEndPhase");
      }

      confirmNoSwitch();
    },
  );

  it("should not activate on wave X0 bosses", async () => {
    game.overridesHelper.enemyAbility(Abilities.WIMP_OUT).startingLevel(5850).startingWave(10);
    await game.classicModeHelper.startBattle([Species.GOLISOPOD]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    // Use 2 turns of False Swipe due to opponent's health bar shield
    game.moveHelper.select(Moves.FALSE_SWIPE);
    await game.toNextTurn();
    game.moveHelper.select(Moves.FALSE_SWIPE);
    await game.toNextTurn();

    const isVisible = enemyPokemon.visible;
    const hasFled = enemyPokemon.switchOutStatus;
    expect(isVisible && !hasFled).toBe(true);
  });
  it("wimp out will not skip battles when triggered in a double battle", async () => {
    const wave = 2;
    game.overridesHelper
      .enemyMoveset(Moves.SPLASH)
      .enemySpecies(Species.WIMPOD)
      .enemyAbility(Abilities.WIMP_OUT)
      .moveset([Moves.MATCHA_GOTCHA, Moves.FALSE_SWIPE])
      .startingLevel(50)
      .enemyLevel(1)
      .battleType("double")
      .startingWave(wave);
    await game.classicModeHelper.startBattle([Species.RAICHU, Species.PIKACHU]);
    const [wimpod0, wimpod1] = game.scene.getEnemyField();

    game.moveHelper.select(Moves.FALSE_SWIPE, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.MATCHA_GOTCHA, 1);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("TurnEndPhase");

    expect(wimpod0.hp).toBeGreaterThan(0);
    expect(wimpod0.switchOutStatus).toBe(true);
    expect(wimpod0.isFainted()).toBe(false);
    expect(wimpod1.isFainted()).toBe(true);

    await game.toNextWave();
    expect(game.scene.currentBattle.waveIndex).toBe(wave + 1);
  });
});
