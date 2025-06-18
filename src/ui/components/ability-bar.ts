import { globalScene } from "#app/global-scene";
import { GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { TextStyle } from "#enums/text-style";
import { addTextObject } from "#ui/text-utils";
import { playTween } from "#utils/anim-utils";
import i18next from "i18next";

const ABILITY_BAR_WIDTH = 118;

const PLAYER_SHOWN_X = 0;
const PLAYER_HIDDEN_X = PLAYER_SHOWN_X - ABILITY_BAR_WIDTH;
const PLAYER_BASE_Y = -116;

const ENEMY_SHOWN_X = GAME_WIDTH;
const ENEMY_HIDDEN_X = ENEMY_SHOWN_X + ABILITY_BAR_WIDTH;
const ENEMY_BASE_Y = -102;

export class AbilityBar extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private abilityBarText: Phaser.GameObjects.Text;
  /** The x-value of the flyout when displayed */
  private shownX: number;
  /** The x-value of the flyout when hidden */
  private hiddenX: number;
  /** The y-value of the flyout */
  private baseY: number;

  /** @todo Is the auto-hide functionality still needed? */
  private autoHideTimer: NodeJS.Timeout | null;

  public shown: boolean;

  constructor(player: boolean = true) {
    const shownX = player ? PLAYER_SHOWN_X : ENEMY_SHOWN_X;
    const hiddenX = player ? PLAYER_HIDDEN_X : ENEMY_HIDDEN_X;
    const baseY = player ? PLAYER_BASE_Y : ENEMY_BASE_Y;

    super(globalScene, hiddenX, baseY);

    this.shownX = shownX;
    this.hiddenX = hiddenX;
    this.baseY = baseY;
  }

  setup(): void {
    this.bg = globalScene.add.image(0, 0, "ability_bar_left");
    this.bg.setOrigin(0, 0);

    this.add(this.bg);

    this.abilityBarText = addTextObject(15, 3, "", TextStyle.NOTIFICATION_BAR_LIGHT);
    this.abilityBarText.setOrigin(0, 0);
    this.abilityBarText.setWordWrapWidth(100 * TEXT_SCALE, true);
    this.add(this.abilityBarText);

    this.setVisible(false);
    this.shown = false;
  }

  /**
   * Displays the Ability Bar flyout with the given text.
   * @param pokemonName - The name of the {@linkcode Pokemon} whose ability activated the flyout
   * @param abilityName - The name of the {@linkcode Ability} that activated the flyout
   * @param passive - (Default `false`) `true` if the Ability that activated is the source Pokemon's Passive
   */
  public async show(pokemonName: string, abilityName: string, passive: boolean = false): Promise<void> {
    this.abilityBarText.setText(
      i18next.t("fightUiHandler:abilityFlyInText", {
        pokemonName,
        passive: passive ? i18next.t("fightUiHandler:passive") : "",
        abilityName,
      }),
    );

    if (this.shown) {
      return;
    }

    globalScene.fieldUI.bringToTop(this);

    this.y = this.baseY + (globalScene.currentBattle.double ? 14 : 0);
    this.setVisible(true);
    this.shown = true;

    await playTween({
      targets: this,
      x: this.shownX,
      duration: 500,
      ease: "Sine.easeOut",
    });

    this.resetAutoHideTimer();
  }

  /** Hides the Ability Bar flyout */
  public async hide(): Promise<void> {
    if (!this.shown) {
      return;
    }

    if (this.autoHideTimer) {
      clearInterval(this.autoHideTimer);
    }

    await playTween({
      targets: this,
      x: this.hiddenX,
      duration: 500,
      ease: "Sine.easeIn",
    });

    this.setVisible(false);
    this.shown = false;
  }

  /** @todo If all ability flyout state changes become synchronous, this should be deprecated */
  resetAutoHideTimer(): void {
    if (this.autoHideTimer) {
      clearInterval(this.autoHideTimer);
    }
    this.autoHideTimer = setTimeout(() => {
      this.hide();
      this.autoHideTimer = null;
    }, 2500);
  }
}
