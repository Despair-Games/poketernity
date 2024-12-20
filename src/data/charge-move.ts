import { Moves } from "#enums/moves";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Constructor } from "#app/utils";
import { AttackMove } from "#app/data/attack-move";
import { ChargeAnim } from "#app/data/battle-anims";
import type { Move } from "#app/data/move";
import type { MoveAttr } from "#app/data/move-attrs/move-attr";
import { SelfStatusMove } from "#app/data/self-status-move";

type SubMove = new (...args: any[]) => Move;
function ChargeMove<TBase extends SubMove>(Base: TBase) {
  return class extends Base {
    /** The animation to play during the move's charging phase */
    public readonly chargeAnim: ChargeAnim = ChargeAnim[`${Moves[this.id]}_CHARGING`];
    /** The message to show during the move's charging phase */
    private _chargeText: string;

    /** Move attributes that apply during the move's charging phase */
    public chargeAttrs: MoveAttr[] = [];

    override isChargingMove(): this is ChargingMove {
      return true;
    }

    /**
     * Sets the text to be displayed during this move's charging phase.
     * References to the user Pokemon should be written as "{USER}", and
     * references to the target Pokemon should be written as "{TARGET}".
     * @param chargeText the text to set
     * @returns this {@linkcode Move} (for chaining API purposes)
     */
    chargeText(chargeText: string): this {
      this._chargeText = chargeText;
      return this;
    }

    /**
     * Queues the charge text to display to the player
     * @param user the {@linkcode Pokemon} using this move
     * @param target the {@linkcode Pokemon} targeted by this move (optional)
     */
    showChargeText(user: Pokemon, target?: Pokemon): void {
      globalScene.queueMessage(
        this._chargeText
          .replace("{USER}", getPokemonNameWithAffix(user))
          .replace("{TARGET}", getPokemonNameWithAffix(target)),
      );
    }

    /**
     * Gets all charge attributes of the given attribute type.
     * @param attrType any attribute that extends {@linkcode MoveAttr}
     * @returns Array of attributes that match `attrType`, or an empty array if
     * no matches are found.
     */
    getChargeAttrs<T extends MoveAttr>(attrType: Constructor<T>): T[] {
      return this.chargeAttrs.filter((attr): attr is T => attr instanceof attrType);
    }

    /**
     * Checks if this move has an attribute of the given type.
     * @param attrType any attribute that extends {@linkcode MoveAttr}
     * @returns `true` if a matching attribute is found; `false` otherwise
     */
    hasChargeAttr<T extends MoveAttr>(attrType: Constructor<T>): boolean {
      return this.chargeAttrs.some((attr) => attr instanceof attrType);
    }

    /**
     * Adds an attribute to this move to be applied during the move's charging phase
     * @param ChargeAttrType the type of {@linkcode MoveAttr} being added
     * @param args the parameters to construct the given {@linkcode MoveAttr} with
     * @returns this {@linkcode Move} (for chaining API purposes)
     */
    chargeAttr<T extends Constructor<MoveAttr>>(ChargeAttrType: T, ...args: ConstructorParameters<T>): this {
      const chargeAttr = new ChargeAttrType(...args);
      this.chargeAttrs.push(chargeAttr);

      return this;
    }
  };
}

export class ChargingAttackMove extends ChargeMove(AttackMove) {}
export class ChargingSelfStatusMove extends ChargeMove(SelfStatusMove) {}

export type ChargingMove = ChargingAttackMove | ChargingSelfStatusMove;
