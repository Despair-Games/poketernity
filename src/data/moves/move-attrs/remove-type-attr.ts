import { MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { ElementalType } from "#enums/elemental-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to remove a set type from the user after the move is used.
 *
 * If the user has no remaining type after removal, this makes the user
 * {@linkcode ElementalType.UNKNOWN | typeless} instead.
 *
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Burn_Up_(move) | Burn Up}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Double_Shock_(move) | Double Shock}.
 */
export class RemoveTypeAttr extends MoveEffectAttr {
  private removedType: ElementalType;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(removedType: ElementalType, messageCallback?: (user: Pokemon) => void) {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
    this.removedType = removedType;
    this.messageCallback = messageCallback;
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    if (user.isTerastallized && user.teraType === this.removedType) {
      // active tera types cannot be removed
      return false;
    }

    const userTypes = user.getTypes(true);
    const modifiedTypes = userTypes.filter((type) => type !== this.removedType);
    if (modifiedTypes.length === 0) {
      modifiedTypes.push(ElementalType.UNKNOWN);
    }
    user.setTemporaryTypes(modifiedTypes);
    user.updateInfo();

    if (this.messageCallback) {
      this.messageCallback(user);
    }

    return true;
  }

  /** @returns a {@linkcode MINOR_EFFECT_SCORE_PENALTY} if the user isn't Terastallized */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    /**
     * Whether or not the user is set to Terastallize into the type matching this effect
     * @todo {@linkcode EnemyPokemon.shouldTera}'s output may need to be cached in the future to
     * make this and the user's final decision to Tera consistent
     */
    const willTera = user.shouldTera() && user.teraType === this.removedType;

    return user.isTerastallized || willTera ? 0 : MINOR_EFFECT_SCORE_PENALTY;
  }
}
