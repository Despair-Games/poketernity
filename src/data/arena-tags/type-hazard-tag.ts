import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import { HitResult } from "#enums/hit-result";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Class used for hazards that damage based on type. The two existing ones are
 * Stealth rock (produced by stealth rock and stone axe) and
 * Sharp steel (produced by G-Max steelsurge)
 */
export abstract class TypeHazardTag extends EntryHazardTag {
  public readonly damagingType: ElementalType;
  public readonly onAddKey: string;
  public readonly activateTrapKey: string;

  constructor(
    arenaTagType: ArenaTagType,
    damagingType: ElementalType,
    sourceId: number,
    side: ArenaTagSide,
    sourceMoveId: MoveId,
    onAddKey: string,
    activateTrapKey: string,
  ) {
    super(arenaTagType, sourceMoveId, sourceId, side, 1);
    this.damagingType = damagingType;
    this.onAddKey = onAddKey;
    this.activateTrapKey = activateTrapKey;
  }

  override onAdd(quiet: boolean = false): void {
    super.onAdd();

    const source = this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
    if (!quiet && source) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(this.onAddKey, { opponentDesc: source.getOpponentDescriptor() }),
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
    const effectiveness = pokemon.getAttackTypeEffectiveness(this.damagingType, undefined, true);
    return effectiveness * 0.125;
  }

  override activateTrap(pokemon: Pokemon, simulated: boolean): boolean {
    const cancelled = new BooleanHolder(false);
    applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, simulated, cancelled);

    if (cancelled.value) {
      return false;
    }

    const damageHpRatio = this.getDamageHpRatio(pokemon);

    if (damageHpRatio) {
      if (simulated) {
        return true;
      }
      const damage = toDmgValue(pokemon.getMaxHp() * damageHpRatio);
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(this.activateTrapKey, { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      pokemon.damageAndUpdate(damage, { result: HitResult.OTHER });
      return true;
    }

    return false;
  }

  override getMatchupScoreMultiplier(pokemon: Pokemon): number {
    const damageHpRatio = this.getDamageHpRatio(pokemon);
    return Phaser.Math.Linear(super.getMatchupScoreMultiplier(pokemon), 1, 1 - Math.pow(damageHpRatio, damageHpRatio));
  }
}
