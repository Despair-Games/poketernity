import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Heals the user or target by {@linkcode healRatio} depending on the value of {@linkcode selfTarget}
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class HealAttr extends MoveEffectAttr {
  /** The percentage of {@linkcode Stat.HP} to heal */
  private healRatio: number;
  /** Should an animation be shown? */
  private showAnim: boolean;

  constructor(healRatio?: number, showAnim?: boolean, selfTarget?: boolean) {
    super(selfTarget === undefined || selfTarget);

    this.healRatio = healRatio || 1;
    this.showAnim = !!showAnim;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    this.addHealPhase(this.selfTarget ? user : target, this.getHealRatio(user, target, move));
    return true;
  }

  /**
   * Helper function to obtain this attribute's heal ratio
   * @returns a heal ratio in the interval [0, 1]
   */
  protected getHealRatio(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return this.healRatio;
  }

  /**
   * Creates a new {@linkcode PokemonHealPhase}.
   * This heals the target and shows the appropriate message.
   */
  addHealPhase(target: Pokemon, healRatio: number) {
    globalScene.unshiftPhase(
      new PokemonHealPhase(
        target.getBattlerIndex(),
        toDmgValue(target.getMaxHp() * healRatio),
        i18next.t("moveTriggers:healHp", { pokemonName: getPokemonNameWithAffix(target) }),
        true,
        !this.showAnim,
      ),
    );
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    const score =
      (1 - (this.selfTarget ? user : target).getHpRatio()) * 20 - this.getHealRatio(user, target, move) * 10;
    return Math.round(score / (1 - this.healRatio / 2));
  }
}
