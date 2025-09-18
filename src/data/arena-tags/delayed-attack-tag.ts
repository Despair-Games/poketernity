import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import type { BaseArenaTag } from "#types/arena-tag-types";
import type { Mutable } from "#types/utility-types";

/**
 * Interface representing a delayed attack command.
 * @see {@linkcode DelayedAttackTag}
 */
interface DelayedAttack {
  readonly sourceId: number;
  readonly moveId: MoveId;
  readonly targetIndex: FieldBattlerIndex;
  readonly turnCount: number;
}

/**
 * Arena Tag class for delayed attacks from {@link https://bulbapedia.bulbagarden.net/wiki/Future_Sight_(move) Future Sight}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Doom_Desire_(move) Doom Desire}.
 *
 * Delays the attack's effect by 3 turns (including the turn the move is used),
 * and deals damage after the turn count is reached.
 */
export class DelayedAttackTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.DELAYED_ATTACK;

  /**
   * Contains all queued delayed attacks on the field
   * @privateRemarks
   * This is `public` due to needing to be serialized to save data,
   * so `readonly` is used to emulate `private` visibility. \
   * Otherwise, this would be `private` and have a `public` getter for use in `DelayedAttackAttr`.
   */
  public readonly delayedAttacks: readonly DelayedAttack[];

  constructor() {
    super(0);

    this.delayedAttacks = [];
  }

  /**
   * Adds a delayed attack to the field.
   * @param source - The attacking {@linkcode Pokemon}
   * @param moveId - The {@linkcode MoveId} for the move being used
   * @param targetIndex - The {@linkcode FieldBattlerIndex} targeted by the attack
   */
  public addAttack(source: Pokemon, moveId: MoveId, targetIndex: FieldBattlerIndex): void {
    (this.delayedAttacks as DelayedAttack[]).push({ sourceId: source.id, moveId, targetIndex, turnCount: 3 });
  }

  override lapse(): boolean {
    for (const attack of this.delayedAttacks) {
      (attack as Mutable<DelayedAttack>).turnCount--;
      const attacker = globalScene.getPokemonById(attack.sourceId);

      if (attacker != null && attack.turnCount <= 0) {
        const target = globalScene.getField(true).find((p) => attack.targetIndex === p.getBattlerIndex());
        if (target) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "MoveEffectPhase",
            attack.sourceId,
            [attack.targetIndex],
            new PokemonMove(attack.moveId, {
              pokemonId: attacker.id,
              virtual: true,
            }),
          );
        } else if (globalScene.currentBattle.double) {
          const redirectIndex = attack.targetIndex + (attack.targetIndex % 2 === 0 ? 1 : -1);
          globalScene.phaseManager.createAndUnshiftPhase(
            "MoveEffectPhase",
            attack.sourceId,
            [redirectIndex],
            new PokemonMove(attack.moveId, {
              pokemonId: attacker.id,
              virtual: true,
            }),
          );
        }
      }
    }

    (this as Mutable<this>).delayedAttacks = this.delayedAttacks.filter(
      (attack) => globalScene.getPokemonById(attack.sourceId) != null && attack.turnCount > 0,
    );
    return this.delayedAttacks.length > 0;
  }

  override onRemove(): void {}

  override loadTag(source: BaseArenaTag & Pick<DelayedAttackTag, "tagType" | "delayedAttacks">): void {
    super.loadTag(source);
    (this as Mutable<this>).delayedAttacks = source.delayedAttacks;
  }
}
