import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { DamagingTrapTag } from "#app/data/battler-tags/damaging-trap-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import i18next from "i18next";

/**
 * Tag implementing the {@link https://bulbapedia.bulbagarden.net/wiki/Substitute_(doll)#Effect | Substitute Doll} effect,
 * for use with the moves Substitute and Shed Tail. Pokemon with this tag deflect most forms of received attack damage
 * onto the tag. This tag also grants immunity to most Status moves and several move effects.
 * @extends BattlerTag
 */
export class SubstituteTag extends BattlerTag {
  /** The substitute's remaining HP. If HP is depleted, the Substitute fades. */
  public hp: number;
  /** A reference to the sprite representing the Substitute doll */
  public sprite: Phaser.GameObjects.Sprite;
  /** Is the source Pokemon "in focus," i.e. is it fully visible on the field? */
  public sourceInFocus: boolean;

  constructor(sourceMoveId: MoveId, sourceId: number) {
    super(
      BattlerTagType.SUBSTITUTE,
      [BattlerTagLapseType.PRE_MOVE, BattlerTagLapseType.AFTER_MOVE, BattlerTagLapseType.HIT],
      0,
      sourceMoveId,
      sourceId,
      true,
    );
  }

  /** Sets the Substitute's HP and queues an on-add battle animation that initializes the Substitute's sprite. */
  override onAdd(pokemon: Pokemon): void {
    this.hp = Math.floor(globalScene.getPokemonById(this.sourceId!)!.getMaxHp() / 4);
    this.sourceInFocus = false;

    // Queue battle animation and message
    globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.SUBSTITUTE_ADD);
    if (this.sourceMoveId === MoveId.SHED_TAIL) {
      globalScene.queueMessage(
        i18next.t("battlerTags:shedTailOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        1500,
      );
    } else {
      globalScene.queueMessage(
        i18next.t("battlerTags:substituteOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        1500,
      );
    }

    // Remove any binding effects from the user
    pokemon.findAndRemoveTags((tag) => tag instanceof DamagingTrapTag);
  }

  /** Queues an on-remove battle animation that removes the Substitute's sprite. */
  override onRemove(pokemon: Pokemon): void {
    // Only play the animation if the cause of removal isn't from the source's own move
    if (!this.sourceInFocus) {
      globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.SUBSTITUTE_REMOVE, [this.sprite]);
    } else {
      this.sprite.destroy();
    }
    globalScene.queueMessage(
      i18next.t("battlerTags:substituteOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    switch (lapseType) {
      case BattlerTagLapseType.PRE_MOVE:
        this.onPreMove(pokemon);
        break;
      case BattlerTagLapseType.AFTER_MOVE:
        this.onAfterMove(pokemon);
        break;
      case BattlerTagLapseType.HIT:
        this.onHit(pokemon);
        break;
    }
    return lapseType !== BattlerTagLapseType.CUSTOM; // only remove this tag on custom lapse
  }

  /** Triggers an animation that brings the Pokemon into focus before it uses a move */
  onPreMove(pokemon: Pokemon): void {
    globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.SUBSTITUTE_PRE_MOVE, [this.sprite]);
    this.sourceInFocus = true;
  }

  /** Triggers an animation that brings the Pokemon out of focus after it uses a move */
  onAfterMove(pokemon: Pokemon): void {
    globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.SUBSTITUTE_POST_MOVE, [this.sprite]);
    this.sourceInFocus = false;
  }

  /** If the Substitute redirects damage, queue a message to indicate it. */
  onHit(pokemon: Pokemon): void {
    const moveEffectPhase = globalScene.getCurrentPhase();
    if (moveEffectPhase?.is<MoveEffectPhase>(PhaseId.MOVE_EFFECT)) {
      const attacker = moveEffectPhase.getUserPokemon();
      if (!attacker) {
        return;
      }
      const move = moveEffectPhase.move.getMove();
      const firstHit = attacker.turnData.hitCount === attacker.turnData.hitsLeft;

      if (firstHit && move.hitsSubstitute(attacker, pokemon)) {
        globalScene.queueMessage(
          i18next.t("battlerTags:substituteOnHit", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
      }
    }
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.hp = source.hp;
  }
}
