import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PostAttackAbAttrParams } from "#types/ab-attr-param-types";

type ChanceFunc = (user: Pokemon, target: Pokemon, move: Move) => number;

/**
 * Ability attribute that applies a battler tag to the target after an attack
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Stench_(Ability) | Stench (Bulbapedia)}
 */
export class PostAttackApplyBattlerTagAbAttr extends PostAttackAbAttr {
  private readonly contactRequired: boolean;
  private readonly chance: ChanceFunc;
  // TODO: use `NonEmptyArray`
  private readonly effects: BattlerTagType[];

  constructor(contactRequired: boolean, chance: ChanceFunc, ...effects: BattlerTagType[]) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  public override apply({ pokemon, simulated, defender }: PostAttackAbAttrParams): void {
    if (simulated) {
      return;
    }

    const effect =
      this.effects.length === 1 ? this.effects[0] : this.effects[defender.randSeedInt(this.effects.length)];
    pokemon.addTag(effect);
  }

  public override canApply({ pokemon, defender, move }: Parameters<this["apply"]>[0]): boolean {
    /*
     * The battler tag is only applied to the target if
     * - The target does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute (checked in `move-effect-phase.ts`)
     * - The game rolls successfully based on the chance
     *
     * Note: Battler tags inflicted by abilities post attacking are also considered additional effects of moves.
     */
    return (
      !defender.hasAbilityWithAttr("IgnoreMoveEffectsAbAttr")
      && defender.id !== pokemon.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, pokemon, defender))
      && defender.randSeedInt(100) < this.getChance(pokemon, defender, move)
    );
  }

  /** This indirection function allows the tests to work. */
  // TODO: this shouldn't be necessary, remove this
  public getChance(attacker: Pokemon, target: Pokemon, move: Move): number {
    return this.chance(attacker, target, move);
  }
}
