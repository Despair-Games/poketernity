import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ElementalType } from "#enums/elemental-type";
import { HitResult } from "#enums/hit-result";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { TypeHazardTagType } from "#types/arena-tag-types";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Class used for hazards that damage based on type.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/List_of_moves_that_cause_entry_hazards#List_of_traps | Pointed stones and Sharp steel (Bulbapedia)}
 */
export abstract class TypeHazardTag extends EntryHazardTag {
  public override readonly tagType: TypeHazardTagType;

  readonly #damagingType: ElementalType;
  readonly #onAddKey: string;
  readonly #activateTrapKey: string;

  constructor(
    damagingType: ElementalType,
    sourceId: number | undefined,
    side: ArenaTagSide,
    sourceMoveId: MoveId,
    onAddKey: string,
    activateTrapKey: string,
  ) {
    super(sourceMoveId, sourceId, side);

    this.#damagingType = damagingType;
    this.#onAddKey = onAddKey;
    this.#activateTrapKey = activateTrapKey;
  }

  public override onAdd(quiet: boolean = false): void {
    super.onAdd();

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(this.#onAddKey, { opponentDesc: source.getOpponentDescriptor() }),
      );
    }
  }

  /**
   * Calculates the damage dealt to a Pokemon as a fraction of the
   * Pokemon's maximum HP.
   * @param pokemon - The afflicted {@linkcode Pokemon}
   * @returns The ratio of the Pokemon's HP dealt as damage
   */
  private getDamageHpRatio(pokemon: Pokemon): number {
    const effectiveness = pokemon.getAttackTypeEffectiveness(this.#damagingType, undefined, true);
    return effectiveness * 0.125;
  }

  protected override activateTrap(pokemon: Pokemon, simulated: boolean): boolean {
    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockNonDirectDamageAbAttr", { pokemon, simulated, cancelled });

    if (cancelled.value) {
      return false;
    }

    const damageHpRatio = this.getDamageHpRatio(pokemon);

    if (!damageHpRatio) {
      return false;
    }
    if (simulated) {
      return true;
    }

    const damage = toDmgValue(pokemon.getMaxHp() * damageHpRatio);
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(this.#activateTrapKey, { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    pokemon.damageAndUpdate(damage, { result: HitResult.OTHER });
    return true;
  }

  public override getMatchupScoreMultiplier(pokemon: Pokemon): number {
    const damageHpRatio = this.getDamageHpRatio(pokemon);
    return Phaser.Math.Linear(super.getMatchupScoreMultiplier(pokemon), 1, 1 - Math.pow(damageHpRatio, damageHpRatio));
  }
}
