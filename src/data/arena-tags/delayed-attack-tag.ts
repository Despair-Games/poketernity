import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import { isNil } from "#utils/common-utils";

/**
 * Interface representing a delayed attack command.
 * @see {@linkcode DelayedAttackTag}
 */
interface DelayedAttack {
  sourceId: number;
  moveId: MoveId;
  targetIndex: FieldBattlerIndex;
  turnCount: number;
}

/**
 * Arena Tag class for delayed attacks from {@link https://bulbapedia.bulbagarden.net/wiki/Future_Sight_(move) Future Sight}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Doom_Desire_(move) Doom Desire}.
 * Delays the attack's effect by 3 turns (including the turn the move is used),
 * and deals damage after the turn count is reached.
 */
export class DelayedAttackTag extends ArenaTag {
  /** Contains all queued delayed attacks on the field */
  public delayedAttacks: DelayedAttack[];

  constructor() {
    super(ArenaTagType.DELAYED_ATTACK, 0);

    this.delayedAttacks = [];
  }

  /**
   * Adds a delayed attack to the field.
   * @param source - The attacking {@linkcode Pokemon}
   * @param moveId - The {@linkcode MoveId} for the move being used
   * @param targetIndex - The {@linkcode FieldBattlerIndex} targeted by the attack
   */
  public addAttack(source: Pokemon, moveId: MoveId, targetIndex: FieldBattlerIndex): void {
    this.delayedAttacks.push({ sourceId: source.id, moveId: moveId, targetIndex, turnCount: 3 });
  }

  override lapse(_arena: Arena): boolean {
    this.delayedAttacks.forEach((attack) => {
      attack.turnCount--;

      if (!isNil(globalScene.getPokemonById(attack.sourceId)) && attack.turnCount <= 0) {
        const target = globalScene.getField(true).find((p) => attack.targetIndex === p.getBattlerIndex());
        if (target) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "MoveEffectPhase",
            attack.sourceId,
            [attack.targetIndex],
            new PokemonMove(attack.moveId, 0, 0, true),
          );
        } else if (globalScene.currentBattle.double) {
          const redirectIndex = attack.targetIndex + (attack.targetIndex % 2 === 0 ? 1 : -1);
          globalScene.phaseManager.createAndUnshiftPhase(
            "MoveEffectPhase",
            attack.sourceId,
            [redirectIndex],
            new PokemonMove(attack.moveId, 0, 0, true),
          );
        }
      }
    });

    this.delayedAttacks = this.delayedAttacks.filter(
      (attack) => !isNil(globalScene.getPokemonById(attack.sourceId)) && attack.turnCount > 0,
    );
    return this.delayedAttacks.length > 0;
  }

  override onRemove(_arena: Arena): void {}

  override loadTag(source: ArenaTag | any): void {
    super.loadTag(source);
    this.delayedAttacks = source.delayedAttacks;
  }
}
