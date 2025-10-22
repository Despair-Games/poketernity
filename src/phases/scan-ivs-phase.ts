import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { CommonColor } from "#enums/color";
import { CommonAnim } from "#enums/common-anim";
import { Stat } from "#enums/stat";
import { UiMode } from "#enums/ui-mode";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { settings } from "#system/settings-manager";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import i18next from "i18next";

export class ScanIvsPhase extends PokemonPhase {
  public override readonly phaseName = "ScanIvsPhase";

  private readonly shownIvs: number;

  constructor(battlerIndex: FieldBattlerIndex, shownIvs: number) {
    super(battlerIndex);

    this.shownIvs = shownIvs;
  }

  public override start(): void {
    const { gameData, ui } = globalScene;

    if (!this.shownIvs) {
      this.end();
      return;
    }

    const pokemon = this.getPokemon();

    let statsContainer: Phaser.GameObjects.Sprite[] = [];
    let statsContainerLabels: Phaser.GameObjects.Sprite[] = [];

    const messageUiHandler = ui.getMessageHandler();
    if (!messageUiHandler) {
      this.end();
      return;
    }

    const enemyField = globalScene.getEnemyField();
    for (const enemyPokemon of enemyField) {
      const enemyIvs = enemyPokemon.ivs;
      // we are using getRootSpeciesId() here because we want to check against the baby form, not the mid form if it exists
      const currentIvs = gameData.starterData[enemyPokemon.species.getRootSpeciesId()].ivs;
      const ivsToShow = messageUiHandler.getTopIvs(enemyIvs, this.shownIvs);

      statsContainer = enemyPokemon.getBattleInfo().getStatsValueContainer().list as Phaser.GameObjects.Sprite[];
      statsContainerLabels = statsContainer.filter((m) => m.name.includes("icon_stat_label"));

      for (const label of statsContainerLabels) {
        const ivStat = Stat[label.frame.name];
        if (enemyIvs[ivStat] > currentIvs[ivStat] && ivsToShow.indexOf(Number(ivStat)) >= 0) {
          const hexColour = enemyIvs[ivStat] === 31 ? CommonColor.SOFT_ORANGE : CommonColor.LIGHT_GREEN;
          const hexTextColour = Phaser.Display.Color.HexStringToColor(hexColour).color;
          label.setTint(hexTextColour);
        }
        label.setVisible(true);
      }
    }

    if (settings.general.hideIvScanner) {
      this.end();
    } else {
      ui.showText(i18next.t("battle:ivScannerUseQuestion", { pokemonName: getPokemonNameWithAffix(pokemon) }), {
        callback: () => {
          const options: ConfirmModeConfig = {
            yesHandler: () => {
              ui.setMessageMode();
              ui.clearText();
              new CommonBattleAnim(CommonAnim.LOCK_ON, pokemon, pokemon).play(false, () => {
                messageUiHandler.promptIvs(pokemon.id, pokemon.ivs, this.shownIvs).then(() => this.end());
              });
            },
            noHandler: () => {
              ui.setMessageMode();
              ui.clearText();
              this.end();
            },
          };
          ui.setMode<ConfirmUiHandler>(UiMode.CONFIRM, options);
        },
      });
    }
  }
}
