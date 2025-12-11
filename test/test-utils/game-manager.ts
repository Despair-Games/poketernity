import { updateUserInfo } from "#app/account";
import { BattleScene } from "#app/battle-scene";
import { getGameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import type { AbilityId } from "#enums/ability-id";
import { BattleCommand } from "#enums/battle-command";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { Button } from "#enums/button";
import { ExpGainSpeed } from "#enums/exp-gain-speed";
import { ExpNotification } from "#enums/exp-notification";
import { GameModes } from "#enums/game-modes";
import { HpBarSpeed } from "#enums/hp-bar-speed";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { PlayerGender } from "#enums/player-gender";
import type { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { UiMode } from "#enums/ui-mode";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { Trainer } from "#field/trainer";
import { ModifierTypeOption } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import type { CommandPhase } from "#phases/command-phase";
import type { TurnEndPhase } from "#phases/turn-end-phase";
import { settings } from "#system/settings-manager";
import { ErrorInterceptor } from "#test/test-utils/error-interceptor";
import { generateStarter, waitUntil } from "#test/test-utils/game-manager-utils";
import { GameWrapper } from "#test/test-utils/game-wrapper";
import { ChallengeModeHelper } from "#test/test-utils/helpers/challenge-mode-helper";
import { ClassicModeHelper } from "#test/test-utils/helpers/classic-mode-helper";
import { DailyModeHelper } from "#test/test-utils/helpers/daily-mode-helper";
import { FieldHelper } from "#test/test-utils/helpers/field-helper";
import { ModifierHelper } from "#test/test-utils/helpers/modifiers-helper";
import { MoveHelper } from "#test/test-utils/helpers/move-helper";
import { OverridesHelper } from "#test/test-utils/helpers/overrides-helper";
import { ReloadHelper } from "#test/test-utils/helpers/reload-helper";
import { RngHelper } from "#test/test-utils/helpers/rng-helper";
import { SettingsHelper } from "#test/test-utils/helpers/settings-helper";
import type { InputsHandler } from "#test/test-utils/inputs-handler";
import { MockFetch } from "#test/test-utils/mocks/mock-fetch";
import { PhaseInterceptor } from "#test/test-utils/phase-interceptor";
import { TextInterceptor } from "#test/test-utils/text-interceptor";
import type { PhaseKey } from "#types/phase-types";
import type { BattleMessageUiHandler } from "#ui/battle-message-ui-handler";
import type { CommandUiHandler } from "#ui/command-ui-handler";
import type { ModifierSelectUiHandler } from "#ui/modifier-select-ui-handler";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import type { UiHandler } from "#ui/ui-handler";
import fs from "node:fs";
import { AES, enc } from "crypto-js";
import { expect, vi } from "vitest";

/**
 * Class to manage the game state and transitions between phases.
 */
export class GameManager {
  public gameWrapper: GameWrapper;
  public scene: BattleScene;
  public phaseInterceptor: PhaseInterceptor;
  public textInterceptor: TextInterceptor;
  public inputsHandler: InputsHandler;
  public readonly override: OverridesHelper;
  public readonly move: MoveHelper;
  public readonly classicMode: ClassicModeHelper;
  public readonly dailyMode: DailyModeHelper;
  public readonly challengeMode: ChallengeModeHelper;
  public readonly settings: SettingsHelper;
  public readonly reload: ReloadHelper;
  public readonly modifiers: ModifierHelper;
  public readonly field: FieldHelper;
  public readonly rng: RngHelper;

  /**
   * Creates an instance of GameManager.
   * @param phaserGame - The Phaser game instance.
   * @param bypassLogin - Whether to bypass the login phase.
   */
  constructor(phaserGame: Phaser.Game, bypassLogin: boolean = true) {
    localStorage.clear();
    ErrorInterceptor.getInstance().clear();
    BattleScene.prototype.randBattleSeedInt = (range, min: number = 0) => min + range - 1; // This simulates a max roll
    this.gameWrapper = new GameWrapper(phaserGame, bypassLogin);

    let firstTimeScene = false;
    if (globalScene) {
      this.scene = globalScene;
    } else {
      this.scene = new BattleScene();
      this.gameWrapper.setScene(this.scene);
      firstTimeScene = true;
    }

    this.phaseInterceptor = new PhaseInterceptor(this.scene);

    if (!firstTimeScene) {
      this.scene.reset(false, true);

      this.scene.phaseManager.clear();
      this.scene.ui.resetHandlers(); // reset ui state

      // This part, in particular, must not be run before the PhaseInterceptor has been initialized.
      this.scene.phaseManager.createAndPushPhase("LoginPhase");
      this.scene.phaseManager.toTitleScreen();
      this.scene.phaseManager.shiftPhase();

      this.gameWrapper.scene = this.scene;
    }
    this.textInterceptor = new TextInterceptor(this.scene);
    this.override = new OverridesHelper(this);
    this.move = new MoveHelper(this);
    this.classicMode = new ClassicModeHelper(this);
    this.dailyMode = new DailyModeHelper(this);
    this.challengeMode = new ChallengeModeHelper(this);
    this.settings = new SettingsHelper(this);
    this.reload = new ReloadHelper(this);
    this.modifiers = new ModifierHelper(this);
    this.field = new FieldHelper(this);
    this.rng = new RngHelper(this);
    this.override.sanitizeOverrides();

    // Disables Mystery Encounters on all tests (can be overridden at test level)
    this.override.mysteryEncounterChance(0);

    // Disables timed events on all tests (can be overriden at test level)
    this.override.timedEvents([]);

    global.fetch = vi.fn(MockFetch) as any;
  }

  /**
   * Sets the game mode.
   * @param mode - The mode to set.
   */
  setMode(mode: UiMode) {
    // biome-ignore lint/nursery/noFloatingPromises: TODO: fix this
    this.scene.ui?.setMode<UiHandler>(mode);
  }

  /**
   * Waits until the specified mode is set.
   * @param mode - The mode to wait for.
   * @returns A promise that resolves when the mode is set.
   */
  waitMode(mode: UiMode): Promise<void> {
    return new Promise(async (resolve) => {
      await waitUntil(() => this.scene.ui?.getMode() === mode);
      return resolve();
    });
  }

  /**
   * Ends the current phase.
   */
  endPhase() {
    this.scene.phaseManager.getCurrentPhase()?.end();
  }

  /**
   * Adds an action to be executed on the next prompt.
   * @param phaseTarget - The target phase.
   * @param mode - The mode to wait for.
   * @param callback - The callback to execute.
   * @param expireFn - Optional function to determine if the prompt has expired.
   */
  onNextPrompt(
    phaseTarget: string,
    mode: UiMode,
    callback: () => void,
    expireFn?: () => void,
    awaitingActionInput: boolean = false,
  ) {
    this.phaseInterceptor.addToNextPrompt(phaseTarget, mode, callback, expireFn, awaitingActionInput);
  }

  /**
   * Runs the game to the title phase.
   * @returns A promise that resolves when the title phase is reached.
   */
  async runToTitle(): Promise<void> {
    await this.phaseInterceptor.to("LoginPhase", false);
    this.phaseInterceptor.pop();
    await this.phaseInterceptor.to("TitlePhase");

    settings.update("general", "gameSpeed", 5);
    settings.update("display", "enableMoveAnimations", false);
    settings.update("display", "showStatsOnLevelUp", false);
    settings.update("general", "expGainSpeed", ExpGainSpeed.SKIP);
    settings.update("general", "partyExpNotificationMode", ExpNotification.SKIP);
    settings.update("general", "hpBarSpeed", HpBarSpeed.SKIP);
    settings.update("general", "enableTutorials", false);
    settings.update("display", "playerGender", PlayerGender.MALE);
    settings.update("general", "battleStyle", this.settings.battleStyle);
    settings.update("audio", "fieldVolume", 0);
  }

  /**
   * Helper function to run to the final boss encounter as it's a bit tricky due to extra dialogue
   */
  async runToFinalBossEncounter(species: SpeciesId[], mode: GameModes) {
    console.log("===to final boss encounter===");
    await this.runToTitle();

    this.onNextPrompt("TitlePhase", UiMode.TITLE, () => {
      const { phaseManager } = this.scene;
      this.scene.gameMode = getGameMode(mode);
      const starters = generateStarter(this.scene, species);
      const selectStarterPhase = phaseManager.createPhase("SelectStarterPhase");
      phaseManager.createAndPushPhase("EncounterPhase", false);
      selectStarterPhase.initBattle(starters);
    });

    // This will consider all battle entry dialog as seens and skip them
    vi.spyOn(this.scene.ui, "shouldSkipDialogue").mockReturnValue(true);

    await this.phaseInterceptor.to("EncounterPhase");

    if (activeOverrides.ENEMY_HELD_ITEMS_OVERRIDE.length === 0 && this.override.removeEnemyStartingItems) {
      this.removeEnemyHeldItems();
    }

    console.log("===finished run to final boss encounter===");
  }

  /**
   * Runs the game to a mystery encounter phase.
   * @param encounterType if specified, will expect encounter to have been spawned
   * @param species Optional array of species for party. If not provided, a party of Feebas, Magikarp and Feebas is used.
   * @returns A promise that resolves when the EncounterPhase ends.
   * @todo Move to a `MysteryEncounter` helper class
   */
  async runToMysteryEncounter(
    encounterType?: MysteryEncounterType,
    species: SpeciesId[] = [SpeciesId.FEEBAS, SpeciesId.MAGIKARP, SpeciesId.FEEBAS],
  ) {
    if (encounterType != null) {
      this.override.trainerChance(0).mysteryEncounter(encounterType);
    }

    await this.runToTitle();

    this.onNextPrompt(
      "TitlePhase",
      UiMode.TITLE,
      () => {
        const { phaseManager } = this.scene;
        this.scene.gameMode = getGameMode(GameModes.CLASSIC);
        const starters = generateStarter(this.scene, species);
        const selectStarterPhase = phaseManager.createPhase("SelectStarterPhase");
        phaseManager.createAndPushPhase("EncounterPhase", false);
        selectStarterPhase.initBattle(starters);
      },
      () => this.isCurrentPhase("EncounterPhase"),
    );

    this.onNextPrompt(
      "EncounterPhase",
      UiMode.MESSAGE,
      () => {
        const handler = this.scene.ui.getCurrentHandler<BattleMessageUiHandler>();
        handler.processInput(Button.ACTION);
      },
      () => this.isCurrentPhase("MysteryEncounterPhase"),
      true,
    );

    await this.phaseInterceptor.to("EncounterPhase");
    if (encounterType != null) {
      expect(this.scene.currentBattle?.mysteryEncounter?.encounterType).toBe(encounterType);
    }

    if (this.override.disableExpGain) {
      vi.spyOn(activeOverrides, "LEVEL_CAP_OVERRIDE", "get").mockReturnValue(1);
    }
  }

  /**
   * Faint all opponents currently on the field
   */
  async faintOpponents() {
    await this.faintPokemon(this.scene.currentBattle.enemyParty[0]);
    if (this.scene.currentBattle.double && this.scene.currentBattle.enemyParty[1]?.isOnField()) {
      // run the first PostKnockoutPhase now, otherwise both PostKnockoutPhases will queue a VictoryPhase
      await this.phaseInterceptor.to("PostKnockoutPhase");
      await this.faintPokemon(this.scene.currentBattle.enemyParty[1]);
    }
  }

  /** Emulate selecting a modifier (item) */
  doSelectModifier() {
    this.onNextPrompt(
      "SelectModifierPhase",
      UiMode.MODIFIER_SELECT,
      () => {
        const handler = this.scene.ui.getCurrentHandler<ModifierSelectUiHandler>();
        handler.processInput(Button.CANCEL);
      },
      () =>
        this.isCurrentPhase("CommandPhase")
        || this.isCurrentPhase("NewBattlePhase")
        || this.isCurrentPhase("CheckSwitchPhase"),
      true,
    );

    this.onNextPrompt(
      "SelectModifierPhase",
      UiMode.CONFIRM,
      () => {
        const handler = this.scene.ui.getCurrentHandler<ModifierSelectUiHandler>();
        handler.processInput(Button.ACTION);
      },
      () =>
        this.isCurrentPhase("CommandPhase")
        || this.isCurrentPhase("NewBattlePhase")
        || this.isCurrentPhase("CheckSwitchPhase"),
    );
  }

  forceEnemyToSwitch() {
    const originalMatchupScore = Trainer.prototype.getPartyMemberMatchupScores;
    Trainer.prototype.getPartyMemberMatchupScores = () => {
      Trainer.prototype.getPartyMemberMatchupScores = originalMatchupScore;
      return [
        [1, 100],
        [1, 100],
      ];
    };
  }

  /** Transition to the first {@linkcode CommandPhase} of the next turn. */
  async toNextTurn() {
    await this.phaseInterceptor.to("TurnInitPhase");
    await this.phaseInterceptor.to("CommandPhase");
  }

  /** Transition to the {@linkcode TurnEndPhase | end of the current turn}. */
  async toEndOfTurn() {
    await this.phaseInterceptor.to("TurnEndPhase");
  }

  /** Emulate selecting a modifier (item) and transition to the next upcoming {@linkcode CommandPhase} */
  async toNextWave() {
    this.doSelectModifier();

    this.onNextPrompt(
      "CheckSwitchPhase",
      UiMode.CONFIRM,
      () => {
        this.setMode(UiMode.MESSAGE);
        this.endPhase();
      },
      () => this.isCurrentPhase("TurnInitPhase") || this.isCurrentPhase("CommandPhase"),
    );

    await this.toNextTurn();
  }

  /**
   * Checks if the player has won the battle.
   * @returns True if the player has won, otherwise false.
   */
  isVictory() {
    return this.scene.currentBattle.enemyParty.every((pokemon) => pokemon.isFainted());
  }

  /**
   * Checks if the current phase matches the target phase.
   * @param phaseTarget - The target phase.
   * @returns True if the current phase matches the target phase, otherwise false.
   */
  isCurrentPhase(phaseTarget: PhaseKey) {
    return this.scene.phaseManager.getCurrentPhase()?.is(phaseTarget);
  }

  /**
   * Checks if the current mode matches the target mode.
   * @param mode - The target mode.
   * @returns True if the current mode matches the target mode, otherwise false.
   */
  isCurrentMode(mode: UiMode) {
    return this.scene.ui?.getMode() === mode;
  }

  /**
   * Exports the save data to import it in a test game.
   * @returns A promise that resolves with the exported save data.
   */
  exportSaveToTest(): Promise<string> {
    const saveKey = "x0i2O7WRiANTqPmZ";
    return new Promise((resolve) => {
      const sessionSaveData = this.scene.gameData.getSessionSaveData();
      const encryptedSaveData = AES.encrypt(JSON.stringify(sessionSaveData), saveKey).toString();
      resolve(encryptedSaveData);
    });
  }

  /**
   * Imports game data from a file.
   * @param path - The path to the data file.
   * @returns A promise that resolves with a tuple containing a boolean indicating success and an integer status code.
   */
  async importData(path): Promise<[boolean, number]> {
    const saveKey = "x0i2O7WRiANTqPmZ";
    const dataRaw = fs.readFileSync(path, { encoding: "utf8", flag: "r" });
    let dataStr = AES.decrypt(dataRaw, saveKey).toString(enc.Utf8);
    dataStr = this.scene.gameData.convertSystemDataStr(dataStr);
    const systemData = this.scene.gameData.parseSystemData(dataStr);
    const valid = !!systemData.dexData && !!systemData.timestamp;
    if (valid) {
      await updateUserInfo();
      await this.scene.gameData.initSystem(dataStr);
    }
    return updateUserInfo();
  }

  /**
   * Faints the given Pokemon.
   * @returns A promise that resolves when the Pokemon is fainted
   * @example
   * const enemyPkmn = game.field.getEnemyPokemon();
   * game.move.select(MoveId.SPLASH);
   * await game.faintPokemon(enemyPkmn);
   */
  async faintPokemon(pokemon: PlayerPokemon | EnemyPokemon): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      pokemon.faint();
      this.scene.phaseManager.createAndUnshiftPhase("FaintPhase", pokemon.getBattlerIndex(), true);
      this.phaseInterceptor.to("FaintPhase").then(resolve).catch(reject);
    });
  }

  /**
   * Command an in-battle switch to another Pokemon via the main battle menu.
   * @param pokemonIndex - The index of the pokemon in your party to switch to
   */
  switchPokemon(pokemonIndex: number): void {
    this.onNextPrompt("CommandPhase", UiMode.COMMAND, () => {
      this.scene.ui.getCurrentHandler<CommandUiHandler>().setCursor(2);
      this.scene.ui.getCurrentHandler<CommandUiHandler>().processInput(Button.ACTION);
    });

    this.selectPartyPokemon(pokemonIndex, "CommandPhase");
  }

  /**
   * Revive pokemon, currently players only.
   * @param pokemonIndex - The index of the pokemon in your party to revive
   */
  revivePokemon(pokemonIndex: number): void {
    const party = this.scene.getPlayerParty();
    const candidate = new ModifierTypeOption(modifierTypes.MAX_REVIVE(), 0);
    const modifier = candidate.type!.newModifier(party[pokemonIndex]);
    this.scene.addModifier(modifier, false);
  }

  /**
   * Select a pokemon from the party menu. Only really handles the basic cases
   * of the party UI, where you just need to navigate to a party slot and press
   * Action twice - navigating any menus that come up after you select a party member
   * is not supported.
   * @param slot - The index of the pokemon in your party to switch to
   * @param inPhase - (Default `"SwitchPhase"`) Which phase to expect the selection to occur in.
   *   Typically non-command switch actions happen in `SwitchPhase`.
   */
  selectPartyPokemon(slot: number, inPhase = "SwitchPhase"): void {
    this.onNextPrompt(inPhase, UiMode.PARTY, () => {
      const partyHandler = this.scene.ui.getCurrentHandler<PartyUiHandler>();

      partyHandler.setCursor(slot);
      partyHandler.processInput(Button.ACTION); // select party slot
      partyHandler.processInput(Button.ACTION); // send out (or whatever option is at the top)
    });
  }

  /**
   * Mocks the game's {@linkcode TurnCommandManager} to set the specified turn order for future turns.
   * Commands will execute in the given order regardless of command type, move priority, etc.
   * @param order The turn order to set
   * @example
   * ```ts
   * game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);
   * ```
   *
   * @remarks
   * To ensure stability, be sure to respect command type priority when mocking turn order.
   * Not doing so can yield turn sequences that are not reproducible in normal gameplay
   * and potentially lead to unexpected behavior.
   */
  setTurnOrder(order: FieldBattlerIndex[]): void {
    expect(order).toHaveLength(globalScene.getField(true).length);

    const { turnManager } = this.scene.currentBattle;
    const turnCommandQueue = turnManager["queue"];
    vi.spyOn(turnCommandQueue, "comparator").mockImplementation((commandA, commandB) => {
      const [orderA, orderB] = [commandA, commandB].map(({ pokemon }) => order.indexOf(pokemon.getBattlerIndex()));

      return orderA - orderB;
    });
  }

  /**
   * Removes all held items from enemy pokemon
   */
  removeEnemyHeldItems(): void {
    this.scene.clearEnemyHeldItemModifiers();
    this.scene.clearEnemyModifiers();
    console.log("Enemy held items removed");
  }

  /**
   * Forces every player and enemy Pokemon of a certain species to have a certain ability.
   *
   * This function has higher priority over {@linkcode OverridesHelper.ability | override.ability}
   * and {@linkcode OverridesHelper.enemyAbility | override.enemyAbility}.
   * Also, unlike the overrides, this function can only be called after `startBattle()` has finished.
   *
   * @param speciesId - The ID of the species that is to receive the ability.
   * @param abilityId - The ID of the ability to give.
   */
  forceSpeciesSpecificAbility(speciesId: SpeciesId, abilityId: AbilityId): void {
    for (const p of (this.scene.getPlayerParty() as Pokemon[]).concat(this.scene.getEnemyParty())) {
      if (p.species.speciesId === speciesId) {
        this.field.mockAbility(p, abilityId);
      }
    }
  }

  /**
   * Picks the {@linkcode BattleCommand.RUN} command and executes it.
   * @remarks
   * **Must** be called during the {@linkcode CommandPhase}.
   */
  public tryToRunAway() {
    const commandPhase = this.scene.phaseManager.getCurrentPhase<CommandPhase>()!;
    expect(commandPhase.phaseName).toBe("CommandPhase");

    commandPhase.handleCommand(BattleCommand.RUN, 0);
  }

  /**
   * Picks the {@linkcode BattleCommand.BALL} command with the given {@linkcode ballType} and executes it.
   * @remarks
   * **Must** be called during the {@linkcode CommandPhase}.
   * @param ballType - The type of Pokeball to throw
   * @see {@linkcode PokeballType}
   */
  public throwPokeball(ballType: PokeballType) {
    const commandPhase = this.scene.phaseManager.getCurrentPhase<CommandPhase>()!;
    expect(commandPhase.phaseName).toBe("CommandPhase");

    commandPhase.handleCommand(BattleCommand.BALL, ballType);
  }
}
