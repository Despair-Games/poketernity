import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Steals 1/8 of the owner's maximum HP at the end of each turn,
 * giving it to the Pokemon in the position of the original user.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Seeding}
 */
export class SeededTag extends BattlerTag {
  public declare sourceId: number;
  private sourceIndex: FieldBattlerIndex | undefined;

  constructor(sourceId: number) {
    super(BattlerTagType.SEEDED, BattlerTagLapseType.TURN_END, 1, MoveId.LEECH_SEED, sourceId, true);
  }

  public override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);

    this.sourceIndex = source.sourceIndex;
  }

  public override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isOfType(ElementalType.GRASS);
  }

  public override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:seededOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    this.sourceIndex = globalScene.getPokemonById(this.sourceId)?.getBattlerIndex();
  }

  public override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM && !super.lapse(pokemon, lapseType)) {
      return false;
    }

    const source = pokemon.getOpponents().find((o) => o.getBattlerIndex() === this.sourceIndex);
    if (!source) {
      return true;
    }

    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockNonDirectDamageAbAttr", { pokemon, simulated: false, cancelled });

    if (cancelled.value) {
      return true;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "CommonAnimPhase",
      CommonAnim.LEECH_SEED,
      source.getBattlerIndex(),
      pokemon.getBattlerIndex(),
    );

    const damage = pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 8));
    const reversed = new ValueHolder(false);
    applyAbAttrs("ReverseDrainAbAttr", { pokemon, simulated: false, attacker: source, reversed });

    const i18nKey = `battlerTags:seededLapse${reversed.value ? "Shed" : ""}`;
    const message = i18next.t(i18nKey, { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
      source.getBattlerIndex(),
      reversed.value ? damage * -1 : damage,
      { message, showFullHpMessage: false, skipAnim: true },
    );

    return true;
  }

  public override getDescriptor(): string {
    return i18next.t("battlerTags:seedDesc");
  }
}
