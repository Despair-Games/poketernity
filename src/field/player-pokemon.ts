import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { timedEventManager } from "#app/timed-event-manager";
import { FRIENDSHIP_GAIN_CUTOFF } from "#constants/friendship-constants";
import type { SpeciesFormEvolution } from "#data/pokemon-evolutions";
import type { SpeciesFormChange } from "#data/pokemon-forms";
import type { PokemonSpecies } from "#data/pokemon-species";
import { CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER, getCandyProgressRequirement, speciesStarterCosts } from "#data/starters";
import { reverseCompatibleTms, tmSpecies } from "#data/tms";
import { AbilityId } from "#enums/ability-id";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { EventModifierType } from "#enums/event-modifier-type";
import { Gender } from "#enums/gender";
import type { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { Pokemon, type PokemonOptions } from "#field/pokemon";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import { EvoTrackerModifier, PokemonFriendshipBoosterModifier, type PokemonHeldItemModifier } from "#modifier/modifier";
import { achvs } from "#system/achievements";
import type { StarterMoveset } from "#types/starter-data";
import { PlayerBattleInfo } from "#ui/battle-info";
import { NumberHolder } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";

export class PlayerPokemon extends Pokemon {
  public compatibleTms: MoveId[];

  constructor(species: PokemonSpecies, level: number, options: PokemonOptions | Pokemon = {}) {
    super(106, 148, species, level, options);

    if (activeOverrides.STATUS_OVERRIDE) {
      this.setStatus(activeOverrides.STATUS_OVERRIDE, { sleepTurnsRemaining: 4 });
    }

    this.shiny = activeOverrides.SHINY_OVERRIDE ?? this.shiny;
    this.variant = activeOverrides.VARIANT_OVERRIDE ?? this.variant;
    if (this.shiny) {
      this.initShinySparkle();
    }

    this.nature = activeOverrides.NATURE_OVERRIDE ?? this.nature;

    if (options["moveset"] == null) {
      if (
        globalScene.gameMode.isDaily
        || (activeOverrides.STARTER_SPECIES_OVERRIDE && activeOverrides.STARTER_SPECIES_OVERRIDE !== SpeciesId.KELDEO)
      ) {
        this.generateAndPopulateMoveset();
      } else {
        this.moveset = [];
      }
    }
    this.generateCompatibleTms();
  }

  initBattleInfo(): void {
    this.battleInfo = new PlayerBattleInfo();
    this.battleInfo.initInfo(this);
  }

  override isPlayer(): this is PlayerPokemon {
    return true;
  }

  override isEnemy(): this is EnemyPokemon {
    return false;
  }

  hasTrainer(): boolean {
    return true;
  }

  public override get boss(): boolean {
    return false;
  }

  getBossSegments(): number {
    return 0;
  }

  getBossSegmentIndex(): number {
    return 0;
  }

  getFieldIndex(): number {
    return globalScene.getPlayerField().indexOf(this);
  }

  getBattlerIndex(): FieldBattlerIndex {
    return this.getFieldIndex();
  }

  override getAlly(): Pokemon | undefined {
    const ally = super.getAlly();
    if (ally?.isAllowedInChallenge()) {
      return ally;
    }
    return;
  }

  generateCompatibleTms(): void {
    this.compatibleTms = [];

    const tms = Object.keys(tmSpecies);
    for (const tm of tms) {
      const moveId = Number.parseInt(tm) as MoveId;
      let compatible = false;
      for (const p of tmSpecies[tm]) {
        if (Array.isArray(p)) {
          const [pkm, form] = p;
          if (pkm === this.species.speciesId && form === this.getFormKey()) {
            compatible = true;
            break;
          }
        } else if (p === this.species.speciesId) {
          compatible = true;
          break;
        }
      }
      if (reverseCompatibleTms.indexOf(moveId) > -1) {
        compatible = !compatible;
      }
      if (compatible) {
        this.compatibleTms.push(moveId);
      }
    }
  }

  tryPopulateMoveset(moveset: StarterMoveset): boolean {
    if (
      !this.getSpeciesForm().validateStarterMoveset(
        moveset,
        globalScene.gameData.starterData[this.species.getRootSpeciesId()].eggMoves,
      )
    ) {
      return false;
    }

    this.setMoveset(...moveset);

    return true;
  }

  /**
   * Updates the Pokemon's friendship value
   * @param friendshipChange - The amount of friendship to add or remove
   */
  addFriendship(friendshipChange: number): void {
    if (friendshipChange <= 0) {
      // Multipliers do not apply for friendship loss. A Pokemon's friendship cannot go below 0
      this.friendship = Math.max(this.friendship + friendshipChange, 0);
      return;
    }
    const amount = new NumberHolder(friendshipChange);
    // Soothe bell multiplier applies here
    globalScene.applyModifier(PokemonFriendshipBoosterModifier, true, this, amount);

    // If the Pokemon's friendship is 150 or higher, the gain is halved
    if (this.friendship >= FRIENDSHIP_GAIN_CUTOFF) {
      amount.value = Math.floor(amount.value / 2);
    }

    // Add friendship to this PlayerPokemon
    this.friendship = Math.min(this.friendship + amount.value, 255);
    if (this.friendship === 255) {
      globalScene.validateAchv(achvs.MAX_FRIENDSHIP);
    }
  }

  /**
   * Not used right now
   * Updates the `candyProgress` of a starter and grants candy
   * if the requirement is met
   * @param candyProgressChange - The amount to increase the candy progress value by
   */
  addCandyProgress(candyProgressChange: number): void {
    const starterSpeciesId = this.species.getRootSpeciesId();
    const starterData = globalScene.gameData.starterData[starterSpeciesId];

    // If a player does not have the starter unlocked, do nothing
    if (!starterData) {
      return;
    }

    // Calculate bonuses
    let candyFriendshipMultiplier = CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER;
    if (timedEventManager.isEventActive(EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER)) {
      candyFriendshipMultiplier *= timedEventManager.getClassicCandyFriendshipMultiplier();
    }

    // Apply bonus only if in classic mode
    const starterAmount = new NumberHolder(
      Math.floor(candyProgressChange * (globalScene.gameMode.isClassic ? candyFriendshipMultiplier : 1)),
    );

    const candyProgressReq = getCandyProgressRequirement(speciesStarterCosts[starterSpeciesId]);
    starterData.candyProgress = (starterData.candyProgress || 0) + starterAmount.value;
    if (starterData.candyProgress >= candyProgressReq) {
      globalScene.gameData.addStarterCandy(getPokemonSpecies(starterSpeciesId), 1);
      starterData.candyProgress -= candyProgressReq;
    }
  }

  public async getPossibleEvolution(evolution: SpeciesFormEvolution | null): Promise<Pokemon> {
    if (!evolution) {
      return this;
    }

    const evolutionSpecies = getPokemonSpecies(evolution.speciesId);
    const formIndex =
      evolution.evoFormKey !== null
        ? Math.max(
            evolutionSpecies.forms.findIndex((f) => f.formKey === evolution.evoFormKey),
            0,
          )
        : this.formIndex;
    const ret = globalScene.addPlayerPokemon(evolutionSpecies, this.level, { ...this, formIndex });
    await ret.loadAssets();
    return ret;
  }

  /**
   * @param evolution - The {@linkcode SpeciesFormEvolution} to use
   * @returns array of {@linkcode SpeciesId} of unlocked starters, if any (root species will be last in the array)
   */
  public evolve(evolution: SpeciesFormEvolution | null): Promise<SpeciesId[]> {
    if (!evolution) {
      return new Promise((resolve) => resolve([]));
    }
    return new Promise((resolve) => {
      const preEvolutionSpecies = this.species;

      this.pauseEvolutions = false;
      // Handles Nincada evolving into Ninjask + Shedinja
      this.handleShedinjaEvolution(evolution);
      this.species = getPokemonSpecies(evolution.speciesId);
      if (evolution.preFormKey !== null) {
        const formIndex = Math.max(
          this.species.forms.findIndex((f) => f.formKey === evolution.evoFormKey),
          0,
        );
        this.formIndex = formIndex;
      }
      this.generateName();
      if ([0, 1, 2].includes(this.abilityIndex)) {
        // Handles cases where a Pokemon with HA evolves into a Pokemon with no HA
        if (this.abilityIndex === 2 && this.getSpeciesForm().abilityHidden === AbilityId.NONE) {
          this.abilityIndex = 0;
        }
      } else {
        // Prevent pokemon with an illegal ability value from breaking things
        console.warn(
          `${getPokemonNameWithAffix(this)}'s ability index is somehow an illegal value (${this.abilityIndex}), please report this.`,
        );
        this.abilityIndex = 0;
      }
      this.compatibleTms.splice(0, this.compatibleTms.length);
      this.generateCompatibleTms();
      const updateAndResolve = (unlockedStarters: SpeciesId[]) => {
        this.loadAssets().then(() => {
          this.calculateStats();
          this.updateInfo(true).then(() => resolve(unlockedStarters));
        });
      };
      // TODO: should this be done in "handleSpecialEvolutions" to keep all species-specific things in the same spot?
      if (preEvolutionSpecies.speciesId === SpeciesId.GIMMIGHOUL) {
        const evotracker = this.getHeldItems().filter((m) => m instanceof EvoTrackerModifier)[0] ?? null;
        if (evotracker) {
          globalScene.removeModifier(evotracker);
        }
      }
      if (!globalScene.gameMode.isDaily || this.metBiome > -1) {
        globalScene.gameData.updateSpeciesDexIvs(this.species.speciesId, this.ivs);
        globalScene.gameData.setPokemonSeen(this, false);
        globalScene.gameData.setPokemonCaught(this, false, false, false).then((unlockedStarters) => {
          updateAndResolve(unlockedStarters);
        });
      } else {
        updateAndResolve([]);
      }
    });
  }

  private handleShedinjaEvolution(evolution: SpeciesFormEvolution) {
    const { abilityIndex, formIndex, shiny, variant, ivs, nature } = this;
    const { speciesId } = this.species;
    if (speciesId === SpeciesId.NINCADA && evolution.speciesId === SpeciesId.NINJASK) {
      const newEvolution = pokemonEvolutions[speciesId][1];

      if (newEvolution.conditions?.every((condition) => condition.predicate(this))) {
        const newPokemon = globalScene.addPlayerPokemon(this.species, this.level, {
          abilityIndex,
          formIndex,
          shiny,
          variant,
          ivs,
          nature,
        });
        newPokemon.passive = this.passive;
        this.copyMoveset(newPokemon);
        newPokemon.gender = Gender.GENDERLESS;
        newPokemon.metLevel = this.metLevel;
        newPokemon.metBiome = this.metBiome;
        newPokemon.metSpecies = this.metSpecies;
        newPokemon.metWave = this.metWave;
        newPokemon.usedTMs = this.usedTMs;

        globalScene.getPlayerParty().push(newPokemon);
        newPokemon.evolve(newEvolution);
        const modifiers = globalScene.findModifiers(
          (m) => m.isPokemonHeldItemModifier() && m.pokemonId === this.id,
          true,
        ) as PokemonHeldItemModifier[];
        modifiers.forEach((m) => {
          const clonedModifier = m.clone() as PokemonHeldItemModifier;
          clonedModifier.pokemonId = newPokemon.id;
          globalScene.addModifier(clonedModifier, true);
        });
        globalScene.updateModifiers(true);
      }
    }
  }

  public async getPossibleForm(formChange: SpeciesFormChange): Promise<Pokemon> {
    const { abilityIndex, gender, shiny, variant, ivs, nature } = this;
    const formIndex = Math.max(
      this.species.forms.findIndex((f) => f.formKey === formChange.formKey),
      0,
    );
    const ret = globalScene.addPlayerPokemon(this.species, this.level, {
      abilityIndex,
      formIndex,
      gender,
      shiny,
      variant,
      ivs,
      nature,
    });
    await ret.loadAssets();
    return ret;
  }

  override changeForm(formChange: SpeciesFormChange): Promise<void> {
    return new Promise((resolve) => {
      const previousFormIndex = this.formIndex;
      this.formIndex = Math.max(
        this.species.forms.findIndex((f) => f.formKey === formChange.formKey),
        0,
      );
      this.generateName();
      const abilityCount = this.getSpeciesForm().getAbilityCount();
      if (this.abilityIndex >= abilityCount) {
        // Shouldn't happen
        this.abilityIndex = abilityCount - 1;
      }

      // In cases where a form change updates the type of a Pokemon from its previous form (Arceus, Silvally, Castform, etc.),
      // persist that type change in customPokemonData if necessary
      const baseForm = this.species.forms[previousFormIndex];
      const baseFormTypes = [baseForm.type1, baseForm.type2];
      if (this.customPokemonData.types.length > 0) {
        if (this.getSpeciesForm().type1 !== baseFormTypes[0]) {
          this.customPokemonData.types[0] = this.getSpeciesForm().type1;
        }

        const type2 = this.getSpeciesForm().type2;
        if (type2 != null && type2 !== baseFormTypes[1]) {
          if (this.customPokemonData.types.length > 1) {
            this.customPokemonData.types[1] = type2;
          } else {
            this.customPokemonData.types.push(type2);
          }
        }
      }

      this.compatibleTms.splice(0, this.compatibleTms.length);
      this.generateCompatibleTms();
      const updateAndResolve = () => {
        this.loadAssets().then(() => {
          this.calculateStats();
          globalScene.updateModifiers(true, true);
          this.updateInfo(true).then(() => resolve());
        });
      };
      if (!globalScene.gameMode.isDaily || this.metBiome > -1) {
        globalScene.gameData.setPokemonSeen(this, false);
        globalScene.gameData.setPokemonCaught(this, false).then(() => updateAndResolve());
      } else {
        updateAndResolve();
      }
    });
  }

  /**
   * Copies this Pokemon's moveset array onto the given Pokemon.
   * @param pokemon - The {@linkcode Pokemon} receiving the copied moveset
   * @todo This doesn't deeply copy each move (e.g. copied moves always have full PP)
   */
  copyMoveset(pokemon: Pokemon): void {
    pokemon.setMoveset(...this.getMoveset(true).map((mv) => mv.moveId));
  }
}
