import { globalScene } from "#app/global-scene";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { getFrameMs } from "#utils/common-utils";

/**
 * Tag representing {@link https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) | Sky Drop}'s
 * airborne state for both the user and the target. While airborne, both Pokemon
 * are {@link https://bulbapedia.bulbagarden.net/wiki/Semi-invulnerable_turn | semi-invulnerable}
 * to most attacks, and the target's moves are cancelled.
 * @extends BattlerTag
 */
export class SkyDropTag extends BattlerTag {
  constructor(sourceId: number) {
    super(BattlerTagType.SKY_DROP, BattlerTagLapseType.CUSTOM, 1, MoveId.SKY_DROP, sourceId);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
    pokemon.setVisible(false);
  }

  override onRemove(pokemon: Pokemon): void {
    if (pokemon.id === this.sourceId) {
      pokemon.removeTag(BattlerTagType.CHARGING);
    }
    // Wait 2 frames before setting visible for battle animations that don't immediately show the sprite invisible
    globalScene.tweens.addCounter({
      duration: getFrameMs(2),
      onComplete: () => pokemon.setVisible(true),
    });
  }

  /**
   * Removes Sky Drop's effects from all Pokemon affected by this instance of Sky Drop.
   */
  public clearSkyDropEffects(): void {
    globalScene.getField(true).forEach((pokemon) => {
      if (pokemon?.getTag(BattlerTagType.SKY_DROP)?.sourceId === this.sourceId) {
        // Cancel the Sky Drop user's next use of Sky Drop
        if (this.sourceId === pokemon.id) {
          globalScene.currentBattle.turnManager.tryRemoveCommand((tc) => tc.pokemon === pokemon);
          pokemon.getMoveQueue().shift();
          pokemon.removeTag(BattlerTagType.CHARGING);
        }
        pokemon.removeTag(BattlerTagType.SKY_DROP);
      }
    });
  }
}
