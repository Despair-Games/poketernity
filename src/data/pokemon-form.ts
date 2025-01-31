import { PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import type { Abilities } from "#enums/abilities";
import type { ElementType } from "#enums/element-type";

export class PokemonForm extends PokemonSpeciesForm {
  public formName: string;
  public formKey: string;
  public formSpriteKey: string | null;

  // This is a collection of form keys that have in-run form changes, but should still be separately selectable from the start screen
  private starterSelectableKeys: string[] = [
    "10",
    "50",
    "10-pc",
    "50-pc",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  constructor(
    formName: string,
    formKey: string,
    type1: ElementType,
    type2: ElementType | null,
    height: number,
    weight: number,
    ability1: Abilities,
    ability2: Abilities,
    abilityHidden: Abilities,
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
    this.formName = formName;
    this.formKey = formKey;
    this.formSpriteKey = formSpriteKey;
  }

  getFormSpriteKey(_formIndex?: number) {
    return this.formSpriteKey !== null ? this.formSpriteKey : this.formKey;
  }

  override isPokemonForm(): this is this {
    return true;
  }
}
