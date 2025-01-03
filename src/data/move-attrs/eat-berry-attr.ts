import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BerryModifier, PreserveBerryModifier } from "#app/modifier/modifier";
import { BooleanHolder } from "#app/utils";
import { HealFromBerryUseAbAttr } from "#app/data/ab-attrs/heal-from-berry-use-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import { getBerryEffectFunc } from "#app/data/berry";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute that causes targets of the move to eat a berry.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Stuff_Cheeks_(move) Stuff Cheeks}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Teatime_(move) Teatime}.
 * @extends MoveEffectAttr
 */
export class EatBerryAttr extends MoveEffectAttr {
  protected chosenBerry: BerryModifier | undefined;
  constructor(selfTarget: boolean) {
    super(selfTarget);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

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

  getTargetHeldBerries(target: Pokemon): BerryModifier[] {
    return globalScene.findModifiers(
      (m) => m instanceof BerryModifier && (m as BerryModifier).pokemonId === target.id,
      target.isPlayer(),
    ) as BerryModifier[];
  }

  reduceBerryModifier(target: Pokemon) {
    if (this.chosenBerry) {
      target.loseHeldItem(this.chosenBerry);
    }
    globalScene.updateModifiers(target.isPlayer());
  }

  eatBerry(consumer: Pokemon, berryOwner?: Pokemon) {
    getBerryEffectFunc(this.chosenBerry!.berryType)(consumer, berryOwner); // consumer eats the berry
    applyAbAttrs(HealFromBerryUseAbAttr, consumer, new BooleanHolder(false));
  }
}
