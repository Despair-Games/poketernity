import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import { getPokeballTintColor } from "#data/pokeball";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";
import i18next from "i18next";

/**
 * - Handles all VFX and SFX related to recalling a {@linkcode Pokemon}.
 * - {@link Pokemon.leaveField | Removes the Pokemon from the field}.
 * @extends PokemonPhase
 */
export class RecallPhase extends PokemonPhase {
  override readonly id = PhaseId.RECALL;

  private readonly switchType: SwitchType;
  private readonly pokemon: Pokemon;

  constructor(battlerIndex: BattlerIndex, switchType: SwitchType) {
    super(battlerIndex);

    this.switchType = switchType;
    this.pokemon = this.getPokemon();
  }

  // #region Public methods

  public override start(): void {
    this.recall().then(this.end);
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
    this.pokemon.leaveField(this.switchType === SwitchType.SWITCH, false);
  }

  /** Plays a message before this phase's target {@linkcode Pokemon} is recalled */
  private async playRecallMessage(): Promise<void> {
    await new Promise<void>((resolve) =>
      globalScene.ui.showText(
        this.isPlayer
          ? i18next.t("battle:playerComeBack", { pokemonName: getPokemonNameWithAffix(this.pokemon) })
          : i18next.t("battle:trainerComeBack", {
              trainerName: globalScene.currentBattle.trainer?.getName(this.getTrainerSlot()),
              pokemonName: this.pokemon.getNameToRender(),
            }),
        250, // TODO: check and adjust this delay if needed
        resolve,
      ),
    );
  }

  /**
   * Plays the animation to remove the target {@linkcode Pokemon} from the field.
   * This also {@link Pokemon.hideInfo | hides the Pokemon's info container}
   * and removes the Pokemon's substitute from the field (depending on
   * the phase's {@linkcode SwitchType}).
   */
  private async playRecallAnimation(): Promise<void> {
    const { tweens, audioManager } = globalScene;
    const promises: Promise<void>[] = [];

    audioManager.playSound("se/pb_rel");
    promises.push(this.pokemon.hideInfo());
    this.pokemon.tint(getPokeballTintColor(this.pokemon.pokeball), 1, 250, "Sine.easeIn");

    if (![SwitchType.BATON_PASS, SwitchType.SHED_TAIL].includes(this.switchType)) {
      promises.push(this.removeSubstitute());
    }

    promises.push(
      new Promise<void>((resolve) =>
        tweens.add({
          targets: this.pokemon,
          duration: 250,
          ease: "Sine.easeIn",
          scale: 0.5,
          onComplete: () => resolve,
        }),
      ),
    );

    await Promise.allSettled(promises);
  }

  private async removeSubstitute(): Promise<void> {
    await new Promise<void>((resolve) => {
      const substitute = this.pokemon.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
      if (!substitute) {
        resolve();
        return;
      }

      globalScene.tweens.add({
        targets: substitute.sprite,
        duration: 250,
        scale: substitute.sprite.scale * 0.5,
        ease: "Sine.easeIn",
        onComplete: () => {
          substitute.sprite.destroy();
          resolve();
        },
      });
    });
  }

  // #endregion
}
