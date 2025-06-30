import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { DexAttr } from "#data/dex-attributes";
import { speciesStarterCosts } from "#data/starters";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import type { GameData } from "#system/game-data";
import { TextListContainer } from "#ui/text-list-container";
import { addTextObject } from "#ui/text-utils";
import { UiHandler } from "#ui/ui-handler";
import { addWindow } from "#ui/ui-theme";
import { formatLargeNumberFixedDigits, getPlayTimeString } from "#utils/string-utils";
import i18next from "i18next";
import type Phaser from "phaser";

interface DisplayStat {
  readonly label_key: string;
  readonly sourceFunc: (gameData: GameData) => string;
  readonly hidden?: boolean;
}

interface DisplayStats {
  [key: string]: DisplayStat;
}

const displayStats: DisplayStats = {
  playTime: {
    label_key: "playTime",
    sourceFunc: (gameData) => getPlayTimeString(gameData.gameStats.playTime),
  },
  battles: {
    label_key: "totalBattles",
    sourceFunc: (gameData) => gameData.gameStats.battles.toString(),
  },
  startersUnlocked: {
    label_key: "starters",
    sourceFunc: (gameData) => {
      const starterCount = gameData.getStarterCount((d) => d.caughtAttr > 0);
      return `${starterCount} (${Math.floor((starterCount / Object.keys(speciesStarterCosts).length) * 1000) / 10}%)`;
    },
  },
  shinyStartersUnlocked: {
    label_key: "shinyStarters",
    sourceFunc: (gameData) => {
      const starterCount = gameData.getStarterCount(
        (d) =>
          (d.caughtAttr & DexAttr.SHINY_BASE_VARIANT) > 0
          || (d.caughtAttr & DexAttr.SHINY_RARE_VARIANT) > 0
          || (d.caughtAttr & DexAttr.SHINY_EPIC_VARIANT) > 0,
      );
      return `${starterCount} (${Math.floor((starterCount / Object.keys(speciesStarterCosts).length) * 1000) / 10}%)`;
    },
  },
  dexSeen: {
    label_key: "speciesSeen",
    sourceFunc: (gameData) => {
      const seenCount = gameData.getSpeciesCount((d) => d.seenAttr > 0);
      return `${seenCount} (${Math.floor((seenCount / Object.keys(gameData.dexData).length) * 1000) / 10}%)`;
    },
  },
  dexCaught: {
    label_key: "speciesCaught",
    sourceFunc: (gameData) => {
      const caughtCount = gameData.getSpeciesCount((d) => d.caughtAttr > 0);
      return `${caughtCount} (${Math.floor((caughtCount / Object.keys(gameData.dexData).length) * 1000) / 10}%)`;
    },
  },
  ribbonsOwned: {
    label_key: "ribbonsOwned",
    sourceFunc: (gameData) => gameData.gameStats.ribbonsOwned.toString(),
  },
  classicSessionsPlayed: {
    label_key: "classicRuns",
    sourceFunc: (gameData) => gameData.gameStats.classicSessionsPlayed.toString(),
  },
  sessionsWon: {
    label_key: "classicWins",
    sourceFunc: (gameData) => gameData.gameStats.sessionsWon.toString(),
  },
  dailyRunSessionsPlayed: {
    label_key: "dailyRunAttempts",
    sourceFunc: (gameData) => gameData.gameStats.dailyRunSessionsPlayed.toString(),
  },
  dailyRunSessionsWon: {
    label_key: "dailyRunWins",
    sourceFunc: (gameData) => gameData.gameStats.dailyRunSessionsWon.toString(),
  },
  endlessSessionsPlayed: {
    label_key: "endlessRuns",
    sourceFunc: (gameData) => gameData.gameStats.endlessSessionsPlayed.toString(),
    hidden: true,
  },
  highestEndlessWave: {
    label_key: "highestWaveEndless",
    sourceFunc: (gameData) => gameData.gameStats.highestEndlessWave.toString(),
    hidden: true,
  },
  highestMoney: {
    label_key: "highestMoney",
    sourceFunc: (gameData) => formatLargeNumberFixedDigits(gameData.gameStats.highestMoney),
  },
  highestDamage: {
    label_key: "highestDamage",
    sourceFunc: (gameData) => gameData.gameStats.highestDamage.toString(),
  },
  highestHeal: {
    label_key: "highestHPHealed",
    sourceFunc: (gameData) => gameData.gameStats.highestHeal.toString(),
  },
  pokemonSeen: {
    label_key: "pokemonEncountered",
    sourceFunc: (gameData) => gameData.gameStats.pokemonSeen.toString(),
  },
  pokemonDefeated: {
    label_key: "pokemonDefeated",
    sourceFunc: (gameData) => gameData.gameStats.pokemonDefeated.toString(),
  },
  pokemonCaught: {
    label_key: "pokemonCaught",
    sourceFunc: (gameData) => gameData.gameStats.pokemonCaught.toString(),
  },
  pokemonHatched: {
    label_key: "eggsHatched",
    sourceFunc: (gameData) => gameData.gameStats.pokemonHatched.toString(),
  },
  subLegendaryPokemonSeen: {
    label_key: "subLegendsSeen",
    sourceFunc: (gameData) => gameData.gameStats.subLegendaryPokemonSeen.toString(),
    hidden: true,
  },
  subLegendaryPokemonCaught: {
    label_key: "subLegendsCaught",
    sourceFunc: (gameData) => gameData.gameStats.subLegendaryPokemonCaught.toString(),
    hidden: true,
  },
  subLegendaryPokemonHatched: {
    label_key: "subLegendsHatched",
    sourceFunc: (gameData) => gameData.gameStats.subLegendaryPokemonHatched.toString(),
    hidden: true,
  },
  legendaryPokemonSeen: {
    label_key: "legendsSeen",
    sourceFunc: (gameData) => gameData.gameStats.legendaryPokemonSeen.toString(),
    hidden: true,
  },
  legendaryPokemonCaught: {
    label_key: "legendsCaught",
    sourceFunc: (gameData) => gameData.gameStats.legendaryPokemonCaught.toString(),
    hidden: true,
  },
  legendaryPokemonHatched: {
    label_key: "legendsHatched",
    sourceFunc: (gameData) => gameData.gameStats.legendaryPokemonHatched.toString(),
    hidden: true,
  },
  mythicalPokemonSeen: {
    label_key: "mythicalsSeen",
    sourceFunc: (gameData) => gameData.gameStats.mythicalPokemonSeen.toString(),
    hidden: true,
  },
  mythicalPokemonCaught: {
    label_key: "mythicalsCaught",
    sourceFunc: (gameData) => gameData.gameStats.mythicalPokemonCaught.toString(),
    hidden: true,
  },
  mythicalPokemonHatched: {
    label_key: "mythicalsHatched",
    sourceFunc: (gameData) => gameData.gameStats.mythicalPokemonHatched.toString(),
    hidden: true,
  },
  shinyPokemonSeen: {
    label_key: "shiniesSeen",
    sourceFunc: (gameData) => gameData.gameStats.shinyPokemonSeen.toString(),
    hidden: true,
  },
  shinyPokemonCaught: {
    label_key: "shiniesCaught",
    sourceFunc: (gameData) => gameData.gameStats.shinyPokemonCaught.toString(),
    hidden: true,
  },
  shinyPokemonHatched: {
    label_key: "shiniesHatched",
    sourceFunc: (gameData) => gameData.gameStats.shinyPokemonHatched.toString(),
    hidden: true,
  },
  trainersDefeated: {
    label_key: "trainersDefeated",
    sourceFunc: (gameData) => gameData.gameStats.trainersDefeated.toString(),
  },
  eggsPulled: {
    label_key: "eggsPulled",
    sourceFunc: (gameData) => gameData.gameStats.eggsPulled.toString(),
    hidden: true,
  },
  rareEggsPulled: {
    label_key: "rareEggsPulled",
    sourceFunc: (gameData) => gameData.gameStats.rareEggsPulled.toString(),
    hidden: true,
  },
  epicEggsPulled: {
    label_key: "epicEggsPulled",
    sourceFunc: (gameData) => gameData.gameStats.epicEggsPulled.toString(),
    hidden: true,
  },
  legendaryEggsPulled: {
    label_key: "legendaryEggsPulled",
    sourceFunc: (gameData) => gameData.gameStats.legendaryEggsPulled.toString(),
    hidden: true,
  },
  manaphyEggsPulled: {
    label_key: "manaphyEggsPulled",
    sourceFunc: (gameData) => gameData.gameStats.manaphyEggsPulled.toString(),
    hidden: true,
  },
};

const ROWS_ON_SCREEN = 9;
const NUM_COLUMNS = 2;
const MAX_STATS_ON_SCREEN = ROWS_ON_SCREEN - NUM_COLUMNS;
const MAX_CURSOR = Math.ceil((Object.keys(displayStats).length - MAX_STATS_ON_SCREEN) / NUM_COLUMNS);

/**
 * Ui Handler for {@linkcode UiMode.GAME_STATS}.
 * Shows a list of account statistics over two columns.
 *
 * Note: currently the stats are computed when the handler is shown and not updated while it's in use,
 * meaning the playtime stat won't change until the handler is exited then re-opened.
 */
export class GameStatsUiHandler extends UiHandler {
  private gameStatsContainer: Phaser.GameObjects.Container;

  private statLabels: TextListContainer[];
  private statValues: TextListContainer[];

  private arrowUp: Phaser.GameObjects.Sprite;
  private arrowDown: Phaser.GameObjects.Sprite;

  constructor() {
    super(UiMode.GAME_STATS);

    this.statLabels = [];
    this.statValues = [];
  }

  protected override setup() {
    const ui = this.getUi();

    this.gameStatsContainer = globalScene.add.container(1, -GAME_HEIGHT + 1);

    const headerBg = addWindow(0, 0, GAME_WIDTH - 2, 24);
    headerBg.setOrigin(0, 0);
    this.gameStatsContainer.add(headerBg);

    const headerText = addTextObject(0, 0, i18next.t("gameStatsUiHandler:stats"), TextStyle.SETTINGS_LABEL)
      .setOrigin(0, 0)
      .setPositionRelative(headerBg, 8, 4);
    this.gameStatsContainer.add(headerText);

    const statsBgWidth = Math.floor((GAME_WIDTH - 2) / NUM_COLUMNS);
    const statsBgHeight = Math.floor(GAME_HEIGHT - headerBg.height - 2);

    for (let i = 0; i < NUM_COLUMNS; i++) {
      const xPosition = (statsBgWidth - 2) * i;
      const yPosition = headerBg.height;
      const width = statsBgWidth + (i > 0 ? 2 : 0) + (i < NUM_COLUMNS - 1 ? 2 : 0);
      // Create the background window for each panel
      const statsBg = addWindow(xPosition, yPosition, width, statsBgHeight, false, false, i > 0 ? -3 : 0, 1);
      statsBg.setOrigin(0, 0);

      const statY = statsBg.y + 5;
      // Create a single text object for all labels to save on resources
      const statsLabels = new TextListContainer(statsBg.x + 8, statY, TextStyle.STATS_LABEL, ROWS_ON_SCREEN);
      this.statLabels.push(statsLabels);

      // Create a single text object for all values to save on resources
      const statX = statsBg.x + statsBgWidth - 5;
      const statsValues = new TextListContainer(statX, statY, TextStyle.STATS_VALUE, ROWS_ON_SCREEN, {
        textAlign: "right",
      });
      this.statValues.push(statsValues);

      this.gameStatsContainer.add([statsBg, statsLabels, statsValues]);
    }

    // Create arrows to show that we can scroll through the stats. TODO: replace with scrollbar?
    const centerX = Math.floor(headerBg.width / 2);
    this.arrowDown = globalScene.add.sprite(centerX, GAME_HEIGHT - 5, "prompt");
    this.gameStatsContainer.add(this.arrowDown);
    this.arrowUp = globalScene.add.sprite(centerX, headerBg.height + 3, "prompt");
    this.arrowUp.flipY = true;
    this.gameStatsContainer.add(this.arrowUp);

    ui.add(this.gameStatsContainer);

    this.cursor = -1;
    this.gameStatsContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.gameStatsContainer.destroy();
  }

  public override show(): boolean {
    this.initStatsDisplay();

    this.setCursor(0);

    this.arrowUp.play("prompt");
    this.arrowDown.play("prompt");

    this.updateArrows();

    this.gameStatsContainer.setVisible(true);

    this.getUi().moveTo(this.gameStatsContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    return true;
  }

  /**
   * Prepare the stats labels and values for display.
   */
  private initStatsDisplay() {
    // Init arrays containing labels and values for each column of statistics
    const labels = new Array(NUM_COLUMNS);
    const values = new Array(NUM_COLUMNS);
    for (let col = 0; col < NUM_COLUMNS; col++) {
      values[col] = [];
      labels[col] = [];
      this.statValues[col].setList(values[col]);
      this.statLabels[col].setList(labels[col]);
    }

    // Fill the arrays with computed stats and labels for each statistic
    Object.keys(displayStats).forEach((key, i) => {
      const stat = displayStats[key] as DisplayStat;
      const column = i % NUM_COLUMNS;
      const value = stat.sourceFunc(globalScene.gameData);
      const showStat = !stat.hidden || Number.isNaN(Number.parseInt(value)) || Number.parseInt(value);
      labels[column].push(showStat ? i18next.t(`gameStatsUiHandler:${stat.label_key}`) : "???");
      values[column].push(value);
    });
  }

  /**
   * Update the stats currently on screen.
   */
  private updateStats(): void {
    for (let col = 0; col < NUM_COLUMNS; col++) {
      this.statLabels[col].setCursor(this.cursor);
      this.statValues[col].setCursor(this.cursor);
    }
  }

  /**
   * Show arrows at the top / bottom of the page if it's possible to scroll in that direction
   */
  private updateArrows(): void {
    const showUpArrow = this.cursor > 0;
    this.arrowUp.setVisible(showUpArrow);

    const showDownArrow = this.cursor < MAX_CURSOR;
    this.arrowDown.setVisible(showDownArrow);
  }

  public override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    if (button === Button.CANCEL) {
      success = true;
      globalScene.ui.revertMode();
    } else {
      switch (button) {
        case Button.UP:
          if (this.cursor > 0) {
            success = this.setCursor(this.cursor - 1);
          } else if (this.cursor === 0) {
            success = this.setCursor(MAX_CURSOR);
          }
          break;
        case Button.DOWN:
          if (this.cursor < MAX_CURSOR) {
            success = this.setCursor(this.cursor + 1);
          } else {
            success = this.setCursor(0);
          }
          break;
      }
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  public override setCursor(cursor: number): boolean {
    const ret = super.setCursor(cursor);

    if (ret) {
      this.updateStats();
      this.updateArrows();
    }

    return ret;
  }

  protected override clear() {
    this.gameStatsContainer.setVisible(false);
    this.cursor = -1;
    [...this.statLabels, ...this.statValues].forEach((textList) => textList.reset());
  }
}
