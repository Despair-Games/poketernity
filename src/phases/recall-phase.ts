import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import { getPokeballTintColor } from "#data/pokeball";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { playTween } from "#utils/anim-utils";
import i18next from "i18next";

/**
 * - Handles all VFX and SFX related to recalling a {@linkcode Pokemon} for player Pokemon at all times,
 * and for enemy Pokemon in trainer battles.
 * - {@link Pokemon.leaveField | Removes the Pokemon from the field}.
 */
export class RecallPhase extends PokemonPhase {
  public override readonly phaseName = "RecallPhase";

  private readonly switchType: SwitchType;
  private pokemon: Pokemon;

  constructor(battlerIndex: FieldBattlerIndex, switchType: SwitchType = SwitchType.SWITCH) {
    super(battlerIndex);

    this.switchType = switchType;
  }

  // #region Public methods

  public override start(): void {
    const pokemon = this.getPokemonAtFieldIndex();
    if (!pokemon?.isOnField()) {
      this.end();
      return;
    }
    this.pokemon = pokemon;

    this.recall().then(() => this.end());
  }

  // #endregion
  // #region Private methods

  /**
   * Recalls the Phase's target {@linkcode Pokemon}.
   * This plays a return animation and message, then removes
   * the Pokemon and related assets from the field container.
   */
  private async recall(): Promise<void> {
    await this.playRecallMessage();
    await this.playRecallAnimation();
    this.pokemon.leaveField(![SwitchType.BATON_PASS, SwitchType.SHED_TAIL].includes(this.switchType), false);
  }

  /** Plays a message before this phase's target {@linkcode Pokemon} is recalled */
  private async playRecallMessage(): Promise<void> {
    await new Promise<void>((resolve) => {
      const text = this.isPlayer
        ? i18next.t("battle:playerComeBack", { pokemonName: getPokemonNameWithAffix(this.pokemon) })
        : i18next.t("battle:trainerComeBack", {
            trainerName: globalScene.currentBattle.trainer?.getName(this.getTrainerSlot()),
            pokemonName: this.pokemon.getNameToRender(),
          });
      // TODO: check and adjust this delay if needed
      globalScene.ui.showText(text, { callback: resolve, callbackDelay: 250 });
    });
  }

  /**
   * Plays the animation to remove the target {@linkcode Pokemon} from the field.
   * This also {@link Pokemon.hideInfo | hides the Pokemon's info container}
   * and removes the Pokemon's substitute from the field (depending on
   * the phase's {@linkcode SwitchType}).
   */
  private async playRecallAnimation(): Promise<void> {
    const promises: Promise<void>[] = [];

    globalScene.audioManager.playSound("se/pb_rel");
    promises.push(this.pokemon.hideInfo());
    this.pokemon.tint(getPokeballTintColor(this.pokemon.pokeball), 1, 250, "Sine.easeIn");

    if (![SwitchType.BATON_PASS, SwitchType.SHED_TAIL].includes(this.switchType)) {
      promises.push(this.removeSubstitute());
    }

    promises.push(
      playTween({
        targets: this.pokemon,
        duration: 250,
        ease: "Sine.easeIn",
        scale: 0.5,
      }),
    );

    await Promise.allSettled(promises);
    await globalScene.updateFieldScale();
  }

  private async removeSubstitute(): Promise<void> {
    const substitute = this.pokemon.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
    if (!substitute) {
      return;
    }

    await playTween({
      targets: substitute.sprite,
      duration: 250,
      scale: substitute.sprite.scale * 0.5,
      ease: "Sine.easeIn",
    });

    substitute.sprite.destroy();
  }

  // #endregion
}
