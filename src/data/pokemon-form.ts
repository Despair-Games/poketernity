import { PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import type { AbilityId } from "#enums/ability-id";
import type { ElementalType } from "#enums/elemental-type";

export class PokemonForm extends PokemonSpeciesForm {
  public readonly formName: string;
  public readonly formKey: string;
  public readonly formSpriteKey: string | null;
  /**
   * For non starter selectable Pokemon only. This is the formKey corresponding to the form that should
   * be marked as seen or caught in the dex data instead of the non starter selectable form.
   */
  public readonly baseFormKey: string | null;

  constructor(
    formName: string,
    formKey: string,
    type1: ElementalType,
    type2: ElementalType | null,
    height: number,
    weight: number,
    ability1: AbilityId,
    ability2: AbilityId,
    abilityHidden: AbilityId,
    baseTotal: number,
    baseHp: number,
    baseAtk: number,
    baseDef: number,
    baseSpatk: number,
    baseSpdef: number,
    baseSpd: number,
    catchRate: number,
    baseFriendship: number,
    baseExp: number,
    genderDiffs: boolean = false,
    formSpriteKey: string | null = null,
    isStarterSelectable: boolean = false,
    baseFormKey: string | null = null,
  ) {
    super(
      type1,
      type2,
      height,
      weight,
      ability1,
      ability2,
      abilityHidden,
      baseTotal,
      baseHp,
      baseAtk,
      baseDef,
      baseSpatk,
      baseSpdef,
      baseSpd,
      catchRate,
      baseFriendship,
      baseExp,
      genderDiffs,
      isStarterSelectable || !formKey,
    );
    this.type = "PokemonForm";
    this.formName = formName;
    this.formKey = formKey;
    this.formSpriteKey = formSpriteKey;
    this.baseFormKey = baseFormKey;
  }

  getFormSpriteKey(_formIndex?: number) {
    return this.formSpriteKey !== null ? this.formSpriteKey : this.formKey;
  }

  override isPokemonForm(): this is this {
    return true;
  }
}
