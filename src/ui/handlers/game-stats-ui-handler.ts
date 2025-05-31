import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { DexAttr } from "#data/dex-attributes";
import { speciesStarterCosts } from "#data/starters";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import type { GameData } from "#system/game-data";
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

export class GameStatsUiHandler extends UiHandler {
  private readonly ROWS_ON_SCREEN = 9;
  private readonly NUM_COLUMNS = 2;
  private readonly MAX_STATS_ON_SCREEN = this.ROWS_ON_SCREEN * this.NUM_COLUMNS;
  private readonly MAX_CURSOR = Math.ceil(
    (Object.keys(displayStats).length - this.MAX_STATS_ON_SCREEN) / this.NUM_COLUMNS,
  );

  private gameStatsContainer: Phaser.GameObjects.Container;

  private statLabels: Phaser.GameObjects.Text[];
  private statValues: Phaser.GameObjects.Text[];

  private arrowUp: Phaser.GameObjects.Sprite;
  private arrowDown: Phaser.GameObjects.Sprite;

  constructor(mode: UiMode | null = null) {
    super(mode);

    this.statLabels = [];
    this.statValues = [];
  }

  protected override setup() {
    const ui = this.getUi();

    this.gameStatsContainer = globalScene.add.container(1, -GAME_HEIGHT + 1);

    const headerBg = addWindow(0, 0, GAME_WIDTH - 2, 24);
    headerBg.setOrigin(0, 0);
    this.gameStatsContainer.add(headerBg);

    const headerText = addTextObject(0, 0, i18next.t("gameStatsUiHandler:stats"), TextStyle.SETTINGS_LABEL);
    headerText.setOrigin(0, 0);
    headerText.setPositionRelative(headerBg, 8, 4);
    this.gameStatsContainer.add(headerText);

    const statsBgWidth = Math.floor((GAME_WIDTH - 2) / this.NUM_COLUMNS);
    const statsBgHeight = Math.floor(GAME_HEIGHT - headerBg.height - 2);

    for (let i = 0; i < this.NUM_COLUMNS; i++) {
      const xPosition = (statsBgWidth - 2) * i;
      // Create the background window for each panel
      const statsBg = addWindow(
        xPosition,
        headerBg.height,
        statsBgWidth + (i > 0 ? 2 : 0) + (i < this.NUM_COLUMNS - 1 ? 2 : 0),
        statsBgHeight,
        false,
        false,
        i > 0 ? -3 : 0,
        1,
      );
      statsBg.setOrigin(0, 0);
      this.gameStatsContainer.add(statsBg);

      // Create a single text object for all labels to save on resources
      const statLabel = addTextObject(statsBg.x + 8, statsBg.y + 5, "", TextStyle.STATS_LABEL, {
        lineSpacing: 12,
        maxLines: this.ROWS_ON_SCREEN,
      });
      statLabel.setOrigin(0, 0);
      this.gameStatsContainer.add(statLabel);
      this.statLabels.push(statLabel);

      // Create a single text object for all values to save on resources
      const statValue = addTextObject(statsBg.x + statsBgWidth - 5, statsBg.y + 5, "", TextStyle.STATS_VALUE, {
        align: "right",
        lineSpacing: 12,
        maxLines: this.ROWS_ON_SCREEN,
      });
      statValue.setOrigin(1, 0);
      this.gameStatsContainer.add(statValue);
      this.statValues.push(statValue);
    }

    // Create arrows to show that we can scroll through the stats. TODO: replace with scrollbar?
    const centerX = Math.floor(headerBg.width / 2);
    this.arrowDown = globalScene.add.sprite(centerX, GAME_HEIGHT - 5, "prompt");
    this.gameStatsContainer.add(this.arrowDown);
    this.arrowUp = globalScene.add.sprite(centerX, headerBg.height + 3, "prompt");
    this.arrowUp.flipY = true;
    this.gameStatsContainer.add(this.arrowUp);

    ui.add(this.gameStatsContainer);

    this.setCursor(0);

    this.gameStatsContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.gameStatsContainer.destroy();
  }

  public override show(): boolean {
    this.setCursor(0);

    this.updateStats();

    this.arrowUp.play("prompt");
    this.arrowDown.play("prompt");

    this.updateArrows();

    this.gameStatsContainer.setVisible(true);

    this.getUi().moveTo(this.gameStatsContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    return true;
  }

  updateStats(): void {
    const labels = new Array(this.NUM_COLUMNS);
    const values = new Array(this.NUM_COLUMNS);
    for (let col = 0; col < this.NUM_COLUMNS; col++) {
      labels[col] = [];
      values[col] = [];
    }

    const startIndex = this.cursor * this.NUM_COLUMNS;
    const statKeys = Object.keys(displayStats).slice(startIndex, startIndex + this.MAX_STATS_ON_SCREEN);
    statKeys.forEach((key, i) => {
      const stat = displayStats[key] as DisplayStat;
      const column = i % this.NUM_COLUMNS;
      const value = stat.sourceFunc(globalScene.gameData);
      const showStat = !stat.hidden || Number.isNaN(Number.parseInt(value)) || Number.parseInt(value);
      labels[column].push(showStat ? i18next.t(`gameStatsUiHandler:${stat.label_key}`) : "???");
      values[column].push(value);
    });

    for (let col = 0; col < this.NUM_COLUMNS; col++) {
      this.statLabels[col].setText(labels[col].join("\n"));
      this.statValues[col].setText(values[col].join("\n"));
    }
  }

  /**
   * Show arrows at the top / bottom of the page if it's possible to scroll in that direction
   */
  updateArrows(): void {
    const showUpArrow = this.cursor > 0;
    this.arrowUp.setVisible(showUpArrow);

    const showDownArrow = this.cursor < this.MAX_CURSOR;
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
          if (this.cursor) {
            success = this.setCursor(this.cursor - 1);
          }
          break;
        case Button.DOWN:
          if (this.cursor < this.MAX_CURSOR) {
            success = this.setCursor(this.cursor + 1);
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
  }
}
