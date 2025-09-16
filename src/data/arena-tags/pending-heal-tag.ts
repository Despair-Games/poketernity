import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { allMoves } from "#data/data-lists";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { BaseArenaTag } from "#types/arena-tag-types";
import type { Mutable } from "#types/utility-types";
import i18next from "i18next";

/**
 * Contains data related to a queued healing effect from
 * {@link https://bulbapedia.bulbagarden.net/wiki/Healing_Wish_(move) | Healing Wish}
 * or {@link https://bulbapedia.bulbagarden.net/wiki/Lunar_Dance_(move) | Lunar Dance}.
 */
interface PendingHealEffect {
  /** The id for the {@linkcode Pokemon} that created the effect */
  readonly sourceId: number;
  /** The {@linkcode MoveId | id} for the move that created the effect */
  readonly moveId: MoveId;
  /** If `true`, also restores the target's PP when the effect activates */
  readonly restorePP: boolean;
  /** The `i18n` key for the message to display when the effect activates */
  readonly healMessageKey: string;
}

type PendingHealEffectRecord = Record<FieldBattlerIndex, readonly PendingHealEffect[]>;

/**
 * Arena tag to contain stored healing effects, namely from
 * {@link https://bulbapedia.bulbagarden.net/wiki/Healing_Wish_(move) | Healing Wish}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Lunar_Dance_(move) | Lunar Dance}.
 *
 * When a damaged Pokemon first enters the effect's {@linkcode FieldBattlerIndex | field position},
 * their HP is fully restored, and they are cured of any non-volatile status condition. \
 * If the effect is from Lunar Dance, their PP is also restored.
 */
export class PendingHealTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.PENDING_HEAL;

  /**
   * All pending healing effects, organized by {@linkcode FieldBattlerIndex}
   * @privateRemarks
   * All of the `readonly` is to emulate the field being `private` (it needs to be public to be serializable).
   */
  public readonly pendingHeals: Partial<Readonly<PendingHealEffectRecord>> = {};

  constructor() {
    super(ArenaTagType.PENDING_HEAL, 0);
  }

  /**
   * Adds a pending healing effect to the field. Effects under the same move *and*
   * target index as an existing effect are ignored.
   * @param targetIndex - The {@linkcode FieldBattlerIndex} under which the effect applies
   * @param healEffect - The {@linkcode PendingHealEffect | data} for the pending heal effect
   */
  public queueHeal(targetIndex: FieldBattlerIndex, healEffect: PendingHealEffect): void {
    const existingHealEffects = this.pendingHeals[targetIndex];
    if (existingHealEffects) {
      if (!existingHealEffects.some((he) => he.moveId === healEffect.moveId)) {
        (existingHealEffects as PendingHealEffect[]).push(healEffect);
      }
    } else {
      (this.pendingHeals as PendingHealEffectRecord)[targetIndex] = [healEffect];
    }
  }

  /** Removes default on-remove message */
  override onRemove(): void {}

  /** This arena tag is removed at the end of the turn if no pending healing effects are on the field */
  override lapse(): boolean {
    for (const key in this.pendingHeals) {
      if (this.pendingHeals[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Applies a pending healing effect on the given target index. If an effect is found for
   * the index, the Pokemon at that index is healed to full HP, is cured of any non-volatile status,
   * and has its PP fully restored (if the effect is from Lunar Dance).
   * @param simulated - If `true`, suppresses changes to game state
   * @param pokemon - The {@linkcode Pokemon} receiving the healing effect
   * @returns `true` if the target Pokemon was healed by this effect
   * @todo This should also be called when a Pokemon moves into a new position via Ally Switch
   */
  override apply(simulated: boolean, pokemon: Pokemon): boolean {
    const targetIndex = pokemon.getBattlerIndex();
    const targetEffects = this.pendingHeals[targetIndex];

    if (simulated) {
      return !!targetEffects?.length;
    }

    const healEffect = targetEffects?.find((effect) => this.canApply(effect, pokemon));
    if (targetEffects && healEffect) {
      const { sourceId, moveId, restorePP, healMessageKey } = healEffect;
      const sourcePokemon = globalScene.getPokemonById(sourceId);
      if (!sourcePokemon) {
        console.warn(`Source of pending ${allMoves.get(moveId).name} effect is undefined!`);
        (targetEffects as PendingHealEffect[]).splice(targetEffects.indexOf(healEffect), 1);
        // Re-evaluate after the invalid heal effect is removed
        return this.apply(simulated, pokemon);
      }

      globalScene.phaseManager.createAndUnshiftPhase("PokemonHealPhase", targetIndex, pokemon.getMaxHp(), {
        message: i18next.t(healMessageKey, { pokemonName: getPokemonNameWithAffix(sourcePokemon) }),
        healStatus: true,
        fullRestorePP: restorePP,
      });

      (targetEffects as PendingHealEffect[]).splice(targetEffects.indexOf(healEffect), 1);
    }

    return healEffect != null;
  }

  /**
   * Determines if the given {@linkcode PendingHealEffect} can immediately heal
   * the given target {@linkcode Pokemon}.
   * @param healEffect - The {@linkcode PendingHealEffect} to evaluate
   * @param pokemon - The {@linkcode Pokemon} to evaluate against
   * @returns `true` if the Pokemon can be healed by the effect
   */
  private canApply(healEffect: PendingHealEffect, pokemon: Pokemon): boolean {
    return (
      !pokemon.isFullHp()
      || pokemon.hasNonVolatileStatusEffect()
      || (healEffect.restorePP && pokemon.getMoveset().some((mv) => mv.ppUsed > 0))
    );
  }

  override loadTag(source: BaseArenaTag & Pick<PendingHealTag, "tagType" | "pendingHeals">): void {
    super.loadTag(source);
    (this as Mutable<this>).pendingHeals = source.pendingHeals;
  }
}
