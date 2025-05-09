import type { StarterMoveset } from "#app/@types/StarterData";
import { FRIENDSHIP_GAIN_CUTOFF } from "#app/constants/friendship-constants";
import { pokemonEvolutions } from "#app/data/init/init-pokemon-evolutions";
import type { SpeciesFormEvolution } from "#app/data/pokemon-evolutions";
import type { SpeciesFormChange } from "#app/data/pokemon-forms";
import type PokemonSpecies from "#app/data/pokemon-species";
import {
  CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER,
  getCandyProgressRequirement,
  speciesStarterCosts,
} from "#app/data/starters";
import { reverseCompatibleTms, tmSpecies } from "#app/data/tms";
import type { Variant } from "#app/data/variant";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import { Pokemon } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  EvoTrackerModifier,
  PokemonFriendshipBoosterModifier,
  type PokemonHeldItemModifier,
} from "#app/modifier/modifier";
import Overrides from "#app/overrides";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { achvs } from "#app/system/achievements";
import type PokemonData from "#app/system/pokemon-data";
import { timedEventManager } from "#app/timed-event-manager";
import { PlayerBattleInfo } from "#app/ui/components/battle-info";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import { NumberHolder, isNil } from "#app/utils/common-utils";
import { PartyFilterNonFainted } from "#app/utils/party-ui-utils";
import { getPokemonSpecies } from "#app/utils/pokemon-utils";
import { AbilityId } from "#enums/ability-id";
import type { BattlerIndex } from "#enums/battler-index";
import { EventModifierType } from "#enums/event-modifier-type";
import { Gender } from "#enums/gender";
import type { MoveId } from "#enums/move-id";
import type { Nature } from "#enums/nature";
import type { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { PhaseId } from "#enums/phase-id";
import { SpeciesId } from "#enums/species-id";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";

export class PlayerPokemon extends Pokemon {
  public compatibleTms: MoveId[];

  constructor(
    species: PokemonSpecies,
    level: number,
    abilityIndex?: number,
    formIndex?: number,
    gender?: Gender,
    shiny?: boolean,
    variant?: Variant,
    ivs?: number[],
    nature?: Nature,
    dataSource?: Pokemon | PokemonData,
  ) {
    super(106, 148, species, level, abilityIndex, formIndex, gender, shiny, variant, ivs, nature, dataSource);

    if (Overrides.STATUS_OVERRIDE) {
      this.setStatus(Overrides.STATUS_OVERRIDE, { sleepTurnsRemaining: 4 });
    }

    if (Overrides.SHINY_OVERRIDE) {
      this.shiny = true;
      this.initShinySparkle();
    } else if (Overrides.SHINY_OVERRIDE === false) {
      this.shiny = false;
    }

    if (Overrides.VARIANT_OVERRIDE !== null && this.shiny) {
      this.variant = Overrides.VARIANT_OVERRIDE;
    }

    if (!dataSource) {
      if (globalScene.gameMode.isDaily) {
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

  isBoss(): boolean {
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

  getBattlerIndex(): BattlerIndex {
    return this.getFieldIndex();
  }

  override getAlly(): Pokemon | undefined {
    const ally = super.getAlly();
    if (ally?.isAllowedInChallenge()) {
      return ally;
    }
    return undefined;
  }

  generateCompatibleTms(): void {
    this.compatibleTms = [];

    const tms = Object.keys(tmSpecies);
    for (const tm of tms) {
      const moveId = parseInt(tm) as MoveId;
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

    this.moveset = moveset.map((m) => new PokemonMove(m));

    return true;
  }

  /**
   * Causes this mon to leave the field (via {@linkcode leaveField}) and then
   * opens the party switcher UI to switch a new mon in
   * @param switchType the {@linkcode SwitchType} for this switch-out. If this is
   * `BATON_PASS` or `SHED_TAIL`, this Pokemon's effects are not cleared upon leaving
   * the field.
   */
  switchOut(switchType: SwitchType = SwitchType.SWITCH): Promise<void> {
    return new Promise((resolve) => {
      this.leaveField(switchType === SwitchType.SWITCH);

      globalScene.ui.setMode<PartyUiHandler>(
        UiMode.PARTY,
        PartyUiMode.FAINT_SWITCH,
        this.getFieldIndex(),
        (slotIndex: number, _option: PartyOption) => {
          if (slotIndex >= globalScene.currentBattle.getBattlerCount() && slotIndex < 6) {
            globalScene.phaseManager.prependToPhase(
              new SwitchSummonPhase(switchType, this.getFieldIndex(), slotIndex, false),
              PhaseId.POST_ACTION,
            );
          }
          globalScene.ui.setMessageMode().then(resolve);
        },
        PartyFilterNonFainted,
      );
    });
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

  getPossibleEvolution(evolution: SpeciesFormEvolution | null): Promise<Pokemon> {
    if (!evolution) {
      return new Promise((resolve) => resolve(this));
    }
    return new Promise((resolve) => {
      const evolutionSpecies = getPokemonSpecies(evolution.speciesId);
      const formIndex =
        evolution.evoFormKey !== null
          ? Math.max(
              evolutionSpecies.forms.findIndex((f) => f.formKey === evolution.evoFormKey),
              0,
            )
          : this.formIndex;
      const ret = globalScene.addPlayerPokemon(
        evolutionSpecies,
        this.level,
        this.abilityIndex,
        formIndex,
        this.gender,
        this.shiny,
        this.variant,
        this.ivs,
        this.nature,
        this,
      );
      ret.loadAssets().then(() => resolve(ret));
    });
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
    const { speciesId } = this.species;
    if (speciesId === SpeciesId.NINCADA && evolution.speciesId === SpeciesId.NINJASK) {
      const newEvolution = pokemonEvolutions[speciesId][1];

      if (newEvolution.conditions?.every((condition) => condition.predicate(this))) {
        const newPokemon = globalScene.addPlayerPokemon(
          this.species,
          this.level,
          this.abilityIndex,
          this.formIndex,
          undefined,
          this.shiny,
          this.variant,
          this.ivs,
          this.nature,
        );
        newPokemon.passive = this.passive;
        newPokemon.moveset = this.moveset.slice();
        newPokemon.moveset = this.copyMoveset();
        newPokemon.luck = this.luck;
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

  getPossibleForm(formChange: SpeciesFormChange): Promise<Pokemon> {
    return new Promise((resolve) => {
      const formIndex = Math.max(
        this.species.forms.findIndex((f) => f.formKey === formChange.formKey),
        0,
      );
      const ret = globalScene.addPlayerPokemon(
        this.species,
        this.level,
        this.abilityIndex,
        formIndex,
        this.gender,
        this.shiny,
        this.variant,
        this.ivs,
        this.nature,
        this,
      );
      ret.loadAssets().then(() => resolve(ret));
    });
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
        if (!isNil(type2) && type2 !== baseFormTypes[1]) {
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

  /** Returns a deep copy of this Pokemon's moveset array */
  copyMoveset(): PokemonMove[] {
    const newMoveset: PokemonMove[] = [];
    this.moveset.forEach((move) => {
      newMoveset.push(new PokemonMove(move.moveId, 0, move.ppUp, move.virtual, move.maxPpOverride));
    });

    return newMoveset;
  }
}
