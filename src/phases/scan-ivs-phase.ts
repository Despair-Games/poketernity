import type { BattlerIndex } from "#enums/battler-index";
import { CommonBattleAnim } from "#app/data/battle-anims/common-battle-anim";
import { CommonAnim } from "#enums/common-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import { getTextColor } from "#app/ui/text";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { Stat } from "#enums/stat";
import i18next from "i18next";
import { settings } from "#app/system/settings/settings-manager";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { PhaseId } from "#enums/phase-id";

export class ScanIvsPhase extends PokemonPhase {
  override readonly id = PhaseId.SCAN_IVS;

  private readonly shownIvs: number;

  constructor(battlerIndex: BattlerIndex, shownIvs: number) {
    super(battlerIndex);

    this.shownIvs = shownIvs;
  }

  public override start(): void {
    super.start();

    const { gameData, ui } = globalScene;

    if (!this.shownIvs) {
      return this.end();
    }

    const pokemon = this.getPokemon();

    let enemyIvs: number[] = [];
    let statsContainer: Phaser.GameObjects.Sprite[] = [];
    let statsContainerLabels: Phaser.GameObjects.Sprite[] = [];

    const enemyField = globalScene.getEnemyField();
    const uiTheme = settings.display.uiTheme; // Assuming uiTheme is accessible
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

    if (!settings.general.hideIvScanner) {
      ui.showText(
        i18next.t("battle:ivScannerUseQuestion", { pokemonName: getPokemonNameWithAffix(pokemon) }),
        null,
        () => {
          const options: ConfirmModeConfig = {
            yesHandler: () => {
              ui.setMode(UiMode.MESSAGE);
              ui.clearText();
              new CommonBattleAnim(CommonAnim.LOCK_ON, pokemon, pokemon).play(false, () => {
                ui.getMessageHandler()
                  .promptIvs(pokemon.id, pokemon.ivs, this.shownIvs)
                  .then(() => this.end());
              });
            },
            noHandler: () => {
              ui.setMode(UiMode.MESSAGE);
              ui.clearText();
              this.end();
            },
          };
          ui.setMode(UiMode.CONFIRM, options);
        },
      );
    } else {
      this.end();
    }
  }
}
