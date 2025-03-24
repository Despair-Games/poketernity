import type { HealFromBerryUseAbAttr } from "#app/data/abilities/ab-attrs/heal-from-berry-use-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { getBerryEffectFunc } from "#app/data/berry";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { type BerryModifier, PreserveBerryModifier } from "#app/modifier/modifier";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute that causes targets of the move to eat a berry.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Stuff_Cheeks_(move) | Stuff Cheeks}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Teatime_(move) | Teatime}.
 * @extends MoveEffectAttr
 */
export class EatBerryAttr extends MoveEffectAttr {
  protected chosenBerry: BerryModifier | undefined;
  constructor(selfTarget: boolean) {
    super(selfTarget);
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const pokemon = this.selfTarget ? user : target;

    const heldBerries = this.getTargetHeldBerries(pokemon);
    if (heldBerries.length <= 0) {
      return false;
    }
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    const preserve = new BooleanHolder(false);
    globalScene.applyModifiers(PreserveBerryModifier, pokemon.isPlayer(), pokemon, preserve); // check for berry pouch preservation
    if (!preserve.value) {
      this.reduceBerryModifier(pokemon);
    }
    this.eatBerry(pokemon);
    return true;
  }

  getTargetHeldBerries(target: Pokemon) {
    return globalScene.findModifiers<BerryModifier>(
      (m) => m.isBerryModifier() && m.pokemonId === target.id,
      target.isPlayer(),
    );
  }

  reduceBerryModifier(target: Pokemon) {
    if (this.chosenBerry) {
      target.loseHeldItem(this.chosenBerry);
    }
    globalScene.updateModifiers(target.isPlayer());
  }

  eatBerry(consumer: Pokemon, berryOwner?: Pokemon) {
    getBerryEffectFunc(this.chosenBerry!.berryType)(consumer, berryOwner); // consumer eats the berry
    applyAbAttrs<HealFromBerryUseAbAttr>(AbAttrFlag.HEAL_FROM_BERRY_USE, consumer, false);
  }
}
