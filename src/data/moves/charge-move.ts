import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MAJOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { ChargeAnim } from "#enums/charge-anim";
import { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { InstantChargeAttr } from "#moves/instant-charge-attr";
import type { ChargingMove } from "#moves/move";
import type { MoveAttr } from "#moves/move-attr";
import { MoveCondition } from "#moves/move-condition";
import type { SubMove } from "#types/move-types";
import type { AbstractConstructor, Constructor } from "#types/utility-types";

export function ChargeMove<TBase extends SubMove>(Base: TBase) {
  return class extends Base {
    /** The animation to play during the move's charging phase */
    public readonly chargeAnim: ChargeAnim = ChargeAnim[`${MoveId[this.id]}_CHARGING`];
    /** The message to show during the move's charging phase */
    private _chargeText: string;

    /** Move attributes that apply during the move's charging phase */
    public chargeAttrs: MoveAttr[] = [];
    /** Does the move calculate its hit check during its charging phase? */
    public hitCheckOnCharge: boolean = false;

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
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
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
    getChargeAttrs<T extends MoveAttr>(attrType: AbstractConstructor<T>): T[] {
      return this.chargeAttrs.filter((attr): attr is T => attr instanceof attrType);
    }

    /**
     * Checks if this move has an attribute of the given type.
     * @param attrType any attribute that extends {@linkcode MoveAttr}
     * @returns `true` if a matching attribute is found; `false` otherwise
     */
    hasChargeAttr<T extends MoveAttr>(attrType: AbstractConstructor<T>): boolean {
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
      let attrCondition = chargeAttr.getCondition();
      if (attrCondition) {
        if (typeof attrCondition === "function") {
          attrCondition = new MoveCondition(attrCondition);
        }
        this.conditions.push(attrCondition);
      }
      return this;
    }

    /**
     * Causes the move's hit check to also be calculated during its charging phase.
     * @returns this {@linkcode Move} (for chaining API purposes)
     */
    doesHitCheckOnCharge(): this {
      this.hitCheckOnCharge = true;
      return this;
    }

    /**
     * Charge moves have two additional Effect Score components compared to other moves:
     * 1. The combined Effect Score from all attributes that apply on the "charge turn" of the move.
     * 2. A {@linkcode MAJOR_EFFECT_SCORE_PENALTY} if the move cannot charge instantly under current conditions.
     *
     * All attributes are individually evaluated as if applied on the turn the move is selected.
     * Charge attributes contribute to score regardless of whether the move is expected to KO or fail.
     */
    protected override getCombinedAttributeScore(
      user: EnemyPokemon,
      target: Pokemon,
      isKnockOut: boolean,
      isFail: boolean,
      isMultiTarget: boolean,
    ): number {
      const baseScore = this.getCombinedAttributeScore(user, target, isKnockOut, isFail, isMultiTarget);

      const chargeAttrScore = this.chargeAttrs.reduce(
        (score, attr) => score + attr.getEffectScore(user, target, this),
        0,
      );

      const canInstantCharge = this.chargeAttrs
        .filter((attr) => attr instanceof InstantChargeAttr)
        .some((attr) => attr.condition(user, this));

      return baseScore + chargeAttrScore + (canInstantCharge ? 0 : MAJOR_EFFECT_SCORE_PENALTY);
    }
  };
}
