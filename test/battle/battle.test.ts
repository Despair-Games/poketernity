import { allSpecies } from "#app/data/data-lists";
import { getGameMode } from "#app/game-mode";
import { EncounterPhase } from "#app/phases/encounter-phase";
import { SelectStarterPhase } from "#app/phases/select-starter-phase";
import { settings } from "#app/system/settings/settings-manager";
import { Abilities } from "#enums/abilities";
import { Biome } from "#enums/biome";
import { GameModes } from "#enums/game-modes";
import { MoveId } from "#enums/move-id";
import { PlayerGender } from "#enums/player-gender";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { UiMode } from "#enums/ui-mode";
import { GameManager } from "#test/testUtils/gameManager";
import { generateStarter } from "#test/testUtils/gameManagerUtils";
import { EVERYTHING_SAVE_FILE_PATH } from "#test/testUtils/testUtils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Test Phase Interceptor", () => {
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
    settings.update("display", "playerGender", PlayerGender.UNSET);
  });

  it("test phase interceptor with prompt", async () => {
    await game.phaseInterceptor.run("LoginPhase");

    game.onNextPrompt("SelectGenderPhase", UiMode.OPTION_SELECT, () => {
      settings.update("display", "playerGender", PlayerGender.FEMALE);
      game.endPhase();
    });

    await game.phaseInterceptor.run("SelectGenderPhase");

    await game.phaseInterceptor.run("TitlePhase");
    await game.waitMode(UiMode.TITLE);

    expect(game.scene.ui?.getMode()).toBe(UiMode.TITLE);
    expect(settings.display.playerGender).toBe(PlayerGender.FEMALE);
  });

  it("test phase interceptor with prompt with preparation for a future prompt", async () => {
    await game.phaseInterceptor.run("LoginPhase");

    game.onNextPrompt("SelectGenderPhase", UiMode.OPTION_SELECT, () => {
      settings.update("display", "playerGender", PlayerGender.MALE);
      game.endPhase();
    });

    game.onNextPrompt("CheckSwitchPhase", UiMode.CONFIRM, () => {
      game.setMode(UiMode.MESSAGE);
      game.endPhase();
    });
    await game.phaseInterceptor.run("SelectGenderPhase");

    await game.phaseInterceptor.run("TitlePhase");
    await game.waitMode(UiMode.TITLE);

    expect(game.scene.ui?.getMode()).toBe(UiMode.TITLE);
    expect(settings.display.playerGender).toBe(PlayerGender.MALE);
  });

  it("newGame one-liner", async () => {
    await game.classicMode.startBattle();
    expect(game.scene.ui?.getMode()).toBe(UiMode.COMMAND);
    expect(game.scene.getCurrentPhase()!.constructor.name).toBe("CommandPhase");
  });

  it("wrong phase", async () => {
    await game.phaseInterceptor.run("LoginPhase");
    await game.phaseInterceptor.run("LoginPhase").catch((e) => {
      expect(e).toBe("Wrong phase: this is SelectGenderPhase and not LoginPhase");
    });
  });

  it("wrong phase but skip", async () => {
    await game.phaseInterceptor.run("LoginPhase");
    await game.phaseInterceptor.run("LoginPhase", () => game.isCurrentPhase("SelectGenderPhase"));
  });

  it("good run", async () => {
    await game.phaseInterceptor.run("LoginPhase");
    game.onNextPrompt(
      "SelectGenderPhase",
      UiMode.OPTION_SELECT,
      () => {
        settings.update("display", "playerGender", PlayerGender.MALE);
        game.endPhase();
      },
      () => game.isCurrentPhase("TitlePhase"),
    );
    await game.phaseInterceptor.run("SelectGenderPhase", () => game.isCurrentPhase("TitlePhase"));
    await game.phaseInterceptor.run("TitlePhase");
  });

  it("good run from select gender to title", async () => {
    await game.phaseInterceptor.run("LoginPhase");
    game.onNextPrompt(
      "SelectGenderPhase",
      UiMode.OPTION_SELECT,
      () => {
        settings.update("display", "playerGender", PlayerGender.MALE);
        game.endPhase();
      },
      () => game.isCurrentPhase("TitlePhase"),
    );
    await game.phaseInterceptor.to("TitlePhase");
  });

  it("good run to SummonPhase phase", async () => {
    await game.phaseInterceptor.run("LoginPhase");
    game.onNextPrompt(
      "SelectGenderPhase",
      UiMode.OPTION_SELECT,
      () => {
        settings.update("display", "playerGender", PlayerGender.MALE);
        game.endPhase();
      },
      () => game.isCurrentPhase("TitlePhase"),
    );
    game.onNextPrompt("TitlePhase", UiMode.TITLE, () => {
      game.scene.gameMode = getGameMode(GameModes.CLASSIC);
      const starters = generateStarter(game.scene);
      const selectStarterPhase = new SelectStarterPhase();
      game.scene.pushPhase(new EncounterPhase(false));
      selectStarterPhase.initBattle(starters);
    });
    await game.phaseInterceptor.to("SummonPhase");
  });
});

describe("Test Battle Phase", () => {
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
  });

  it("do attack wave 3 - single battle - regular - OHKO", async () => {
    game.override.starterSpecies(Species.MEWTWO);
    game.override.enemySpecies(Species.RATTATA);
    game.override.startingLevel(2000);
    game.override.startingWave(3).battleType("single");
    game.override.moveset([MoveId.TACKLE]);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    await game.classicMode.startBattle();
    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to("SelectModifierPhase", false);
  });

  it("do attack wave 3 - single battle - regular - NO OHKO with opponent using non damage attack", async () => {
    game.override.starterSpecies(Species.MEWTWO);
    game.override.enemySpecies(Species.RATTATA);
    game.override.startingLevel(5);
    game.override.startingWave(3);
    game.override.moveset([MoveId.TACKLE]);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.enemyMoveset([MoveId.TAIL_WHIP, MoveId.TAIL_WHIP, MoveId.TAIL_WHIP, MoveId.TAIL_WHIP]);
    game.override.battleType("single");
    await game.classicMode.startBattle();
    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to("TurnInitPhase", false);
  });

  it("load 100% data file", async () => {
    await game.importData(EVERYTHING_SAVE_FILE_PATH);
    const caughtCount = Object.keys(game.scene.gameData.dexData).filter((key) => {
      const species = game.scene.gameData.dexData[key];
      return species.caughtAttr !== 0n;
    }).length;
    expect(caughtCount).toBe(Object.keys(allSpecies).length);
  });

  it("start battle with selected team", async () => {
    await game.classicMode.startBattle([Species.CHARIZARD, Species.CHANSEY, Species.MEW]);
    expect(game.scene.getPlayerParty()[0].species.speciesId).toBe(Species.CHARIZARD);
    expect(game.scene.getPlayerParty()[1].species.speciesId).toBe(Species.CHANSEY);
    expect(game.scene.getPlayerParty()[2].species.speciesId).toBe(Species.MEW);
  });

  it("test remove random battle seed int", async () => {
    for (let i = 0; i < 10; i++) {
      const rand = game.scene.randBattleSeedInt(16);
      expect(rand).toBe(15);
    }
  });

  it("2vs1", async () => {
    game.override.battleType("single");
    game.override.enemySpecies(Species.MIGHTYENA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.HYDRATION);
    await game.classicMode.startBattle([Species.BLASTOISE, Species.CHARIZARD]);
    expect(game.scene.ui?.getMode()).toBe(UiMode.COMMAND);
    expect(game.scene.getCurrentPhase()!.constructor.name).toBe("CommandPhase");
  });

  it("1vs1", async () => {
    game.override.battleType("single");
    game.override.enemySpecies(Species.MIGHTYENA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.HYDRATION);
    await game.classicMode.startBattle([Species.BLASTOISE]);
    expect(game.scene.ui?.getMode()).toBe(UiMode.COMMAND);
    expect(game.scene.getCurrentPhase()!.constructor.name).toBe("CommandPhase");
  });

  it("2vs2", async () => {
    game.override.battleType("double");
    game.override.enemySpecies(Species.MIGHTYENA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.HYDRATION);
    game.override.startingWave(3);
    await game.classicMode.startBattle([Species.BLASTOISE, Species.CHARIZARD]);
    expect(game.scene.ui?.getMode()).toBe(UiMode.COMMAND);
    expect(game.scene.getCurrentPhase()!.constructor.name).toBe("CommandPhase");
  });

  it("4vs2", async () => {
    game.override.battleType("double");
    game.override.enemySpecies(Species.MIGHTYENA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.HYDRATION);
    game.override.startingWave(3);
    await game.classicMode.startBattle([Species.BLASTOISE, Species.CHARIZARD, Species.DARKRAI, Species.GABITE]);
    expect(game.scene.ui?.getMode()).toBe(UiMode.COMMAND);
    expect(game.scene.getCurrentPhase()!.constructor.name).toBe("CommandPhase");
  });

  it("kill opponent pokemon", async () => {
    const moveToUse = MoveId.SPLASH;
    game.override.battleType("single");
    game.override.starterSpecies(Species.MEWTWO);
    game.override.enemySpecies(Species.RATTATA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.ZEN_MODE);
    game.override.startingLevel(2000);
    game.override.startingWave(3);
    game.override.moveset([moveToUse]);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    await game.classicMode.startBattle([Species.DARMANITAN, Species.CHARIZARD]);

    game.move.select(moveToUse);
    await game.phaseInterceptor.to("DamageAnimPhase", false);
    await game.killPokemon(game.scene.currentBattle.enemyParty[0]);
    expect(game.scene.currentBattle.enemyParty[0].isFainted()).toBe(true);
    await game.phaseInterceptor.to("VictoryPhase", false);
  });

  it("to next turn", async () => {
    const moveToUse = MoveId.SPLASH;
    game.override.battleType("single");
    game.override.starterSpecies(Species.MEWTWO);
    game.override.enemySpecies(Species.RATTATA);
    game.override.enemyAbility(Abilities.HYDRATION);
    game.override.ability(Abilities.ZEN_MODE);
    game.override.startingLevel(2000);
    game.override.startingWave(3);
    game.override.moveset([moveToUse]);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    await game.classicMode.startBattle();
    const turn = game.scene.currentBattle.turn;
    game.move.select(moveToUse);
    await game.toNextTurn();
    expect(game.scene.currentBattle.turn).toBeGreaterThan(turn);
  });

  it("does not set new weather if staying in same biome", async () => {
    const moveToUse = MoveId.SPLASH;
    game.override
      .battleType("single")
      .starterSpecies(Species.MEWTWO)
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.HYDRATION)
      .ability(Abilities.ZEN_MODE)
      .startingLevel(2000)
      .startingWave(3)
      .startingBiome(Biome.LAKE)
      .moveset([moveToUse]);
    game.override.enemyMoveset([MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE, MoveId.TACKLE]);
    await game.classicMode.startBattle();
    const waveIndex = game.scene.currentBattle.waveIndex;
    game.move.select(moveToUse);

    vi.spyOn(game.scene.arena, "trySetWeather");
    await game.doKillOpponents();
    await game.toNextWave();
    expect(game.scene.arena.trySetWeather).not.toHaveBeenCalled();
    expect(game.scene.currentBattle.waveIndex).toBeGreaterThan(waveIndex);
  });

  it("does not force switch if active pokemon faints at same time as enemy mon and is revived in post-battle", async () => {
    const moveToUse = MoveId.TAKE_DOWN;
    game.override
      .battleType("single")
      .starterSpecies(Species.SAWK)
      .enemySpecies(Species.RATTATA)
      .startingWave(1)
      .startingLevel(100)
      .moveset([moveToUse])
      .enemyMoveset(MoveId.SPLASH)
      .startingHeldItems([{ name: "TEMP_STAT_STAGE_BOOSTER", type: Stat.ACC }]);

    await game.classicMode.startBattle();
    game.scene.getPlayerPokemon()!.hp = 1;
    game.move.select(moveToUse);

    await game.phaseInterceptor.to("BattleEndPhase");
    game.doRevivePokemon(0); // pretend max revive was picked
    game.doSelectModifier();

    game.onNextPrompt(
      "SwitchPhase",
      UiMode.PARTY,
      () => {
        expect.fail("Switch was forced");
      },
      () => game.isCurrentPhase("NextEncounterPhase"),
    );
    await game.phaseInterceptor.to("SwitchPhase");
  });

  it("moves between waves normally", async () => {
    game.override
      .battleType("single")
      .enemySpecies(Species.SUNKERN)
      .enemyAbility(Abilities.BALL_FETCH)
      .startingWave(8)
      .startingLevel(1000)
      .enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle([Species.ARCEUS]);

    game.move.use(MoveId.FLAMETHROWER);
    await game.toNextTurn();
    game.move.use(MoveId.FLAMETHROWER);
    await game.toNextWave();

    expect(game.scene.currentBattle.waveIndex).toBe(9);

    game.move.use(MoveId.FLAMETHROWER);
    await game.toNextWave();

    expect(game.scene.currentBattle.waveIndex).toBe(10);

    game.move.use(MoveId.FLAMETHROWER);
    await game.toNextTurn();

    expect(game.scene.currentBattle.waveIndex).toBe(11);
  });
});
