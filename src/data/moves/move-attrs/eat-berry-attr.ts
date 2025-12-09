import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getBerryEffectFunc } from "#data/berry";
import type { Pokemon } from "#field/pokemon";
import { type BerryModifier, PreserveBerryModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute that causes targets of the move to eat a berry.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Stuff_Cheeks_(move) | Stuff Cheeks}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Teatime_(move) | Teatime}.
 */
export class EatBerryAttr extends MoveEffectAttr {
  protected chosenBerry: BerryModifier | undefined;
  // biome-ignore lint/complexity/noUselessConstructor: enforces no options can be passed to the superclass
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
    applyAbAttrs("HealFromBerryUseAbAttr", consumer, false);
  }
}
