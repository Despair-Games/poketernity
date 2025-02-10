import type { StarterMoveset } from "#app/@types/StarterData";
import type { AnySound } from "#app/battle-scene";
import { speciesEggMoves } from "#app/data/balance/egg-moves";
import { pokemonPrevolutions } from "#app/data/balance/pokemon-evolutions";
import { type LevelMoves, pokemonSpeciesLevelMoves } from "#app/data/balance/pokemon-level-moves";
import { pokemonFormLevelMoves } from "./balance/pokemon-form-level-moves";
import { speciesStarterCosts } from "#app/data/balance/starters";
import { uncatchableSpecies } from "#app/data/balance/uncatchable-species";
import type { PokemonForm } from "./pokemon-form";
import { variantData, type VariantSet, type Variant } from "#app/data/variant";
import { globalScene } from "#app/global-scene";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { Abilities } from "#enums/abilities";
import { PokemonRegion } from "#enums/pokemon-regions";
import { Species } from "#enums/species";
import { SpeciesFormKey } from "#enums/species-form-key";
import type { Stat } from "#enums/stat";
import { argbFromRgba, QuantizerCelebi, rgbaFromArgb } from "@material/material-color-utilities";
import type { ElementalType } from "#enums/elemental-type";

//#region Types

type PokemonSpeciesFormType = "PokemonSpeciesForm" | "PokemonForm" | "PokemonSpecies";

//#endregion

export abstract class PokemonSpeciesForm {
  /** Identifier for the class. HAS NOTHING TO DO WITH {@linkcode type1} and {@linkcode type2}. The name is derived from {@linkcode Phaser.GameObjects.Container} */
  public type: PokemonSpeciesFormType;
  public speciesId: Species;
  protected _formIndex: number;
  protected _generation: number;
  readonly type1: ElementalType;
  readonly type2: ElementalType | null;
  readonly height: number;
  readonly weight: number;
  readonly ability1: Abilities;
  readonly ability2: Abilities;
  readonly abilityHidden: Abilities;
  readonly baseTotal: number;
  readonly baseStats: number[];
  readonly catchRate: number;
  readonly baseFriendship: number;
  readonly baseExp: number;
  readonly genderDiffs: boolean;
  readonly isStarterSelectable: boolean;

  constructor(
    type1: ElementalType,
    type2: ElementalType | null,
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
    genderDiffs: boolean,
    isStarterSelectable: boolean,
  ) {
    this.type = "PokemonSpeciesForm";
    this.type1 = type1;
    this.type2 = type2;
    this.height = height;
    this.weight = weight;
    this.ability1 = ability1;
    this.ability2 = ability2 === Abilities.NONE ? ability1 : ability2;
    this.abilityHidden = abilityHidden;
    this.baseTotal = baseTotal;
    this.baseStats = [baseHp, baseAtk, baseDef, baseSpatk, baseSpdef, baseSpd];
    this.catchRate = catchRate;
    this.baseFriendship = baseFriendship;
    this.baseExp = baseExp;
    this.genderDiffs = genderDiffs;
    this.isStarterSelectable = isStarterSelectable;
  }

  /**
   * Method to get the root species id of a Pokemon.
   * @example
   * ```
   * Magmortar.getRootSpeciesId(true) => Magmar
   * Magmortar.getRootSpeciesId(false) => Magby
   * ```
   * @param forStarter boolean to get the nonbaby form of a starter
   * @returns The species
   */
  getRootSpeciesId(forStarter: boolean = false): Species {
    let ret = this.speciesId;
    while (pokemonPrevolutions.hasOwnProperty(ret) && (!forStarter || !speciesStarterCosts.hasOwnProperty(ret))) {
      ret = pokemonPrevolutions[ret];
    }
    return ret;
  }

  get generation(): number {
    return this._generation;
  }

  set generation(generation: number) {
    this._generation = generation;
  }

  get formIndex(): number {
    return this._formIndex;
  }

  set formIndex(formIndex: number) {
    this._formIndex = formIndex;
  }

  isOfType(type: number): boolean {
    return this.type1 === type || (this.type2 !== null && this.type2 === type);
  }

  /**
   * Method to get the total number of abilities a Pokemon species has.
   * @returns Number of abilities
   */
  getAbilityCount(): number {
    return this.abilityHidden !== Abilities.NONE ? 3 : 2;
  }

  /**
   * Method to get the ability of a Pokemon species.
   * @param abilityIndex Which ability to get (should only be 0-2)
   * @returns The id of the Ability
   */
  getAbility(abilityIndex: number): Abilities {
    let ret: Abilities;
    if (abilityIndex === 0) {
      ret = this.ability1;
    } else if (abilityIndex === 1) {
      ret = this.ability2;
    } else {
      ret = this.abilityHidden;
    }
    return ret;
  }

  getLevelMoves(): LevelMoves {
    if (
      pokemonFormLevelMoves.hasOwnProperty(this.speciesId)
      && pokemonFormLevelMoves[this.speciesId].hasOwnProperty(this.formIndex)
    ) {
      return pokemonFormLevelMoves[this.speciesId][this.formIndex].slice(0);
    }
    return pokemonSpeciesLevelMoves[this.speciesId].slice(0);
  }

  getRegion(): PokemonRegion {
    return Math.floor(this.speciesId / 2000) as PokemonRegion;
  }

  isObtainable(): boolean {
    return this.generation <= 9 || pokemonPrevolutions.hasOwnProperty(this.speciesId);
  }

  isCatchable(): boolean {
    return this.isObtainable() && uncatchableSpecies.indexOf(this.speciesId) === -1;
  }

  isRegional(): boolean {
    return this.getRegion() !== PokemonRegion.NORMAL;
  }

  isTrainerForbidden(): boolean {
    return [Species.ETERNAL_FLOETTE, Species.BLOODMOON_URSALUNA].includes(this.speciesId);
  }

  isRareRegional(): boolean {
    if (this.getRegion() === PokemonRegion.HISUI) {
      return true;
    }
    return false;
  }

  /**
   * Gets the BST for the species
   * @returns The species' BST.
   */
  getBaseStatTotal(): number {
    return this.baseStats.reduce((i, n) => n + i);
  }

  /**
   * Gets the species' base stat amount for the given stat.
   * @param stat  The desired stat.
   * @returns The species' base stat amount.
   */
  getBaseStat(stat: Stat): number {
    return this.baseStats[stat];
  }

  getBaseExp(): number {
    let ret = this.baseExp;
    switch (this.getFormSpriteKey()) {
      case SpeciesFormKey.MEGA:
      case SpeciesFormKey.MEGA_X:
      case SpeciesFormKey.MEGA_Y:
      case SpeciesFormKey.PRIMAL:
      case SpeciesFormKey.GIGANTAMAX:
      case SpeciesFormKey.ETERNAMAX:
        ret *= 1.5;
        break;
    }
    return ret;
  }

  getSpriteAtlasPath(female: boolean, formIndex?: number, shiny?: boolean, variant?: number): string {
    const spriteId = this.getSpriteId(female, formIndex, shiny, variant).replace(/\_{2}/g, "/");
    return `${/_[1-3]$/.test(spriteId) ? "variant/" : ""}${spriteId}`;
  }

  getSpriteId(female: boolean, formIndex?: number, shiny?: boolean, variant: number = 0, back?: boolean): string {
    if (formIndex === undefined || this.isPokemonForm()) {
      formIndex = this.formIndex;
    }

    const formSpriteKey = this.getFormSpriteKey(formIndex);
    const showGenderDiffs =
      this.genderDiffs && female && ![SpeciesFormKey.MEGA, SpeciesFormKey.GIGANTAMAX].find((k) => formSpriteKey === k);

    const baseSpriteKey = `${showGenderDiffs ? "female__" : ""}${this.speciesId}${formSpriteKey ? `-${formSpriteKey}` : ""}`;

    let config = variantData;
    `${back ? "back__" : ""}${baseSpriteKey}`.split("__").map((p) => (config ? (config = config[p]) : null));
    const variantSet = config as VariantSet;

    return `${back ? "back__" : ""}${shiny && (!variantSet || (!variant && !variantSet[variant || 0])) ? "shiny__" : ""}${baseSpriteKey}${shiny && variantSet && variantSet[variant] === 2 ? `_${variant + 1}` : ""}`;
  }

  getSpriteKey(female: boolean, formIndex?: number, shiny?: boolean, variant?: number): string {
    return `pkmn__${this.getSpriteId(female, formIndex, shiny, variant)}`;
  }

  abstract getFormSpriteKey(formIndex?: number): string;

  /**
   * Variant Data key/index is either species id or species id followed by -formkey
   * @param formIndex optional form index for pokemon with different forms
   * @returns species id if no additional forms, index with formkey if a pokemon with a form
   */
  getVariantDataIndex(formIndex?: number) {
    let formkey: string | null = null;
    let variantDataIndex: number | string = this.speciesId;
    const species = getPokemonSpecies(this.speciesId);
    if (species.forms.length > 0 && formIndex !== undefined) {
      formkey = species.forms[formIndex]?.getFormSpriteKey(formIndex);
      if (formkey) {
        variantDataIndex = `${this.speciesId}-${formkey}`;
      }
    }
    return variantDataIndex;
  }

  getIconAtlasKey(formIndex?: number, shiny?: boolean, variant?: number): string {
    const variantDataIndex = this.getVariantDataIndex(formIndex);
    const isVariant =
      shiny && variantData[variantDataIndex] && variant !== undefined && variantData[variantDataIndex][variant];
    return `pokemon_icons_${this.generation}${isVariant ? "v" : ""}`;
  }

  getIconId(female: boolean, formIndex?: number, shiny?: boolean, variant?: number): string {
    if (formIndex === undefined) {
      formIndex = this.formIndex;
    }

    const variantDataIndex = this.getVariantDataIndex(formIndex);

    let ret = this.speciesId.toString();

    const isVariant =
      shiny && variantData[variantDataIndex] && variant !== undefined && variantData[variantDataIndex][variant];

    if (shiny && !isVariant) {
      ret += "s";
    }

    switch (this.speciesId) {
      case Species.DODUO:
      case Species.DODRIO:
      case Species.MEGANIUM:
      case Species.TORCHIC:
      case Species.COMBUSKEN:
      case Species.BLAZIKEN:
      case Species.HIPPOPOTAS:
      case Species.HIPPOWDON:
      case Species.UNFEZANT:
      case Species.FRILLISH:
      case Species.JELLICENT:
      case Species.PYROAR:
        ret += female ? "-f" : "";
        break;
    }

    let formSpriteKey = this.getFormSpriteKey(formIndex);
    if (formSpriteKey) {
      switch (this.speciesId) {
        case Species.DUDUNSPARCE:
          break;
        case Species.ZACIAN:
        case Species.ZAMAZENTA:
          if (formSpriteKey.startsWith("behemoth")) {
            formSpriteKey = "crowned";
          }
        default:
          ret += `-${formSpriteKey}`;
          break;
      }
    }

    if (isVariant) {
      ret += `_${variant + 1}`;
    }

    return ret;
  }

  getCryKey(formIndex?: number): string {
    let speciesId = this.speciesId;
    if (this.speciesId > 2000) {
      switch (this.speciesId) {
        case Species.GALAR_SLOWPOKE:
        case Species.ETERNAL_FLOETTE:
        case Species.BLOODMOON_URSALUNA:
          break;
        default:
          speciesId = speciesId % 2000;
          break;
      }
    }
    let ret = speciesId.toString();
    const forms = getPokemonSpecies(speciesId).forms;
    if (forms.length) {
      if (formIndex !== undefined && formIndex >= forms.length) {
        console.warn(
          `Attempted accessing form with index ${formIndex} of species ${getPokemonSpecies(speciesId).getName()} with only ${forms.length || 0} forms`,
        );
        formIndex = Math.min(formIndex, forms.length - 1);
      }
      const formKey = forms[formIndex || 0].formKey;
      switch (formKey) {
        case SpeciesFormKey.MEGA:
        case SpeciesFormKey.MEGA_X:
        case SpeciesFormKey.MEGA_Y:
        case SpeciesFormKey.GIGANTAMAX:
        case SpeciesFormKey.GIGANTAMAX_SINGLE:
        case SpeciesFormKey.GIGANTAMAX_RAPID:
        case "white":
        case "black":
        case "therian":
        case "sky":
        case "gorging":
        case "gulping":
        case "no-ice":
        case "hangry":
        case "crowned":
        case "eternamax":
        case "four":
        case "droopy":
        case "stretchy":
        case "hero":
        case "roaming":
        case "complete":
        case "10-complete":
        case "10":
        case "10-pc":
        case "super":
        case "unbound":
        case "pau":
        case "pompom":
        case "sensu":
        case "dusk":
        case "midnight":
        case "school":
        case "dawn-wings":
        case "dusk-mane":
        case "ultra":
          ret += `-${formKey}`;
          break;
      }
    }
    return `cry/${ret}`;
  }

  validateStarterMoveset(moveset: StarterMoveset, eggMoves: number): boolean {
    const rootSpeciesId = this.getRootSpeciesId();
    for (const moveId of moveset) {
      if (speciesEggMoves.hasOwnProperty(rootSpeciesId)) {
        const eggMoveIndex = speciesEggMoves[rootSpeciesId].findIndex((m) => m === moveId);
        if (eggMoveIndex > -1 && eggMoves & (1 << eggMoveIndex)) {
          continue;
        }
      }
      if (
        pokemonFormLevelMoves.hasOwnProperty(this.speciesId)
        && pokemonFormLevelMoves[this.speciesId].hasOwnProperty(this.formIndex)
      ) {
        if (!pokemonFormLevelMoves[this.speciesId][this.formIndex].find((lm) => lm[0] <= 5 && lm[1] === moveId)) {
          return false;
        }
      } else if (!pokemonSpeciesLevelMoves[this.speciesId].find((lm) => lm[0] <= 5 && lm[1] === moveId)) {
        return false;
      }
    }

    return true;
  }

  loadAssets(
    female: boolean,
    formIndex?: number,
    shiny?: boolean,
    variant?: Variant,
    startLoad?: boolean,
  ): Promise<void> {
    return new Promise((resolve) => {
      const spriteKey = this.getSpriteKey(female, formIndex, shiny, variant);
      globalScene.loadPokemonAtlas(spriteKey, this.getSpriteAtlasPath(female, formIndex, shiny, variant));
      globalScene.load.audio(`${this.getCryKey(formIndex)}`, `audio/${this.getCryKey(formIndex)}.m4a`);
      globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        const originalWarn = console.warn;
        // Ignore warnings for missing frames, because there will be a lot
        console.warn = () => {};
        const frameNames = globalScene.anims.generateFrameNames(spriteKey, {
          zeroPad: 4,
          suffix: ".png",
          start: 1,
          end: 400,
        });
        console.warn = originalWarn;
        if (!globalScene.anims.exists(spriteKey)) {
          globalScene.anims.create({
            key: this.getSpriteKey(female, formIndex, shiny, variant),
            frames: frameNames,
            frameRate: 10,
            repeat: -1,
          });
        } else {
          globalScene.anims.get(spriteKey).frameRate = 10;
        }
        resolve();
      });
      if (startLoad) {
        if (!globalScene.load.isLoading()) {
          globalScene.load.start();
        }
      } else {
        resolve();
      }
    });
  }

  cry(soundConfig?: Phaser.Types.Sound.SoundConfig, ignorePlay?: boolean): AnySound {
    const cryKey = this.getCryKey(this.formIndex);
    let cry: AnySound | null = globalScene.sound.get(cryKey) as AnySound;
    if (cry?.pendingRemove) {
      cry = null;
    }
    cry = globalScene.playSound(cry ?? cryKey, soundConfig);
    if (ignorePlay) {
      cry.stop();
    }
    return cry;
  }

  generateCandyColors(): number[][] {
    const sourceTexture = globalScene.textures.get(this.getSpriteKey(false));

    const sourceFrame = sourceTexture.frames[sourceTexture.firstFrame];
    const sourceImage = sourceTexture.getSourceImage() as HTMLImageElement;

    const canvas = document.createElement("canvas");

    const spriteColors: number[][] = [];

    const context = canvas.getContext("2d");
    const frame = sourceFrame;
    canvas.width = frame.width;
    canvas.height = frame.height;
    context?.drawImage(sourceImage, frame.cutX, frame.cutY, frame.width, frame.height, 0, 0, frame.width, frame.height);
    const imageData = context?.getImageData(frame.cutX, frame.cutY, frame.width, frame.height);
    const pixelData = imageData?.data;
    const pixelColors: number[] = [];

    if (pixelData?.length !== undefined) {
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3]) {
          const pixel = pixelData.slice(i, i + 4);
          const [r, g, b, a] = pixel;
          if (!spriteColors.find((c) => c[0] === r && c[1] === g && c[2] === b)) {
            spriteColors.push([r, g, b, a]);
          }
        }
      }

      for (let i = 0; i < pixelData.length; i += 4) {
        const total = pixelData.slice(i, i + 3).reduce((total: number, value: number) => total + value, 0);
        if (!total) {
          continue;
        }
        pixelColors.push(
          argbFromRgba({ r: pixelData[i], g: pixelData[i + 1], b: pixelData[i + 2], a: pixelData[i + 3] }),
        );
      }
    }

    let paletteColors: Map<number, number> = new Map();

    const originalRandom = Math.random;
    Math.random = () => Phaser.Math.RND.realInRange(0, 1);

    globalScene.executeWithSeedOffset(
      () => {
        paletteColors = QuantizerCelebi.quantize(pixelColors, 2);
      },
      0,
      "This result should not vary",
    );

    Math.random = originalRandom;

    return Array.from(paletteColors.keys()).map((c) => Object.values(rgbaFromArgb(c)) as number[]);
  }

  isPokemonForm(): this is PokemonForm {
    return false;
  }
}
