import type { BattlerIndex } from "#app/battle";
import { CommonAnim, CommonBattleAnim } from "#app/data/battle-anims";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getTextColor, TextStyle } from "#app/ui/text";
import { Mode } from "#app/ui/ui";
import { Stat } from "#enums/stat";
import i18next from "i18next";
import { PokemonPhase } from "./abstract-pokemon-phase";

export class ScanIvsPhase extends PokemonPhase {
  private readonly shownIvs: number;

  constructor(battlerIndex: BattlerIndex, shownIvs: number) {
    super(battlerIndex);

    this.shownIvs = shownIvs;
  }

  public override start(): void {
    super.start();

    const { gameData, hideIvs, ui, uiTheme } = globalScene;

    if (!this.shownIvs) {
      return this.end();
    }

    const pokemon = this.getPokemon();

    let enemyIvs: number[] = [];
    let statsContainer: Phaser.GameObjects.Sprite[] = [];
    let statsContainerLabels: Phaser.GameObjects.Sprite[] = [];

    const enemyField = globalScene.getEnemyField();
    for (let e = 0; e < enemyField.length; e++) {
      enemyIvs = enemyField[e].ivs;
      // we are using getRootSpeciesId() here because we want to check against the baby form, not the mid form if it exists
      const currentIvs = gameData.dexData[enemyField[e].species.getRootSpeciesId()].ivs;
      const ivsToShow = ui.getMessageHandler().getTopIvs(enemyIvs, this.shownIvs);

      statsContainer = enemyField[e].getBattleInfo().getStatsValueContainer().list as Phaser.GameObjects.Sprite[];
      statsContainerLabels = statsContainer.filter((m) => m.name.indexOf("icon_stat_label") >= 0);

      for (let s = 0; s < statsContainerLabels.length; s++) {
        const ivStat = Stat[statsContainerLabels[s].frame.name];
        if (enemyIvs[ivStat] > currentIvs[ivStat] && ivsToShow.indexOf(Number(ivStat)) >= 0) {
          const hexColour =
            enemyIvs[ivStat] === 31
              ? getTextColor(TextStyle.PERFECT_IV, false, uiTheme)
              : getTextColor(TextStyle.SUMMARY_GREEN, false, uiTheme);
          const hexTextColour = Phaser.Display.Color.HexStringToColor(hexColour).color;
          statsContainerLabels[s].setTint(hexTextColour);
        }
        statsContainerLabels[s].setVisible(true);
      }
    }

    if (!hideIvs) {
      ui.showText(
        i18next.t("battle:ivScannerUseQuestion", { pokemonName: getPokemonNameWithAffix(pokemon) }),
        null,
        () => {
          ui.setMode(
            Mode.CONFIRM,
            () => {
              ui.setMode(Mode.MESSAGE);
              ui.clearText();
              new CommonBattleAnim(CommonAnim.LOCK_ON, pokemon, pokemon).play(false, () => {
                ui.getMessageHandler()
                  .promptIvs(pokemon.id, pokemon.ivs, this.shownIvs)
                  .then(() => this.end());
              });
            },
            () => {
              ui.setMode(Mode.MESSAGE);
              ui.clearText();
              this.end();
            },
          );
        },
      );
    } else {
      this.end();
    }
  }
}
