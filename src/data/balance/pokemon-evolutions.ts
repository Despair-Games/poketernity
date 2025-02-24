import { globalScene } from "#app/global-scene";
import { Gender } from "#enums/gender";
import { PokeballType } from "#enums/pokeball";
import type { Pokemon } from "#app/field/pokemon";
import { ElementalType } from "#enums/elemental-type";
import { randSeedInt } from "#app/utils";
import { WeatherType } from "#enums/weather-type";
import { Nature } from "#enums/nature";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { SpeciesFormKey } from "#enums/species-form-key";
import { EvolutionItem } from "#enums/evolution-item";

/**
 * Pokemon Evolution tuple type consisting of:
 * @property 0 {@linkcode Species} The species of the Pokemon.
 * @property 1 The level at which the Pokemon evolves.
 */
export type EvolutionLevel = [species: Species, level: number];

export type EvolutionConditionPredicate = (p: Pokemon) => boolean;
export type EvolutionConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormEvolution {
  public speciesId: Species;
  public preFormKey: string | null;
  public evoFormKey: string | null;
  public level: number;
  public item: EvolutionItem | null;
  public condition: SpeciesEvolutionCondition | null;
  /** A numerical level for Pokemon that don't evolve with level
   * Is 0 if it is a level evolution
   */
  public altLevel: number;

  constructor(
    speciesId: Species,
    preFormKey: string | null,
    evoFormKey: string | null,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    altLevel: number,
  ) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.evoFormKey = evoFormKey;
    this.level = level;
    this.item = item || EvolutionItem.NONE;
    this.condition = condition;
    this.altLevel = altLevel;
  }
}

export class SpeciesEvolution extends SpeciesFormEvolution {
  constructor(
    speciesId: Species,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    altLevel: number,
  ) {
    super(speciesId, null, null, level, item, condition, altLevel);
  }
}

export class SpeciesEvolutionCondition {
  public predicate: EvolutionConditionPredicate;
  public enforceFunc: EvolutionConditionEnforceFunc | undefined;

  constructor(predicate: EvolutionConditionPredicate, enforceFunc?: EvolutionConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc;
  }
}

export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(
    friendshipAmount: number,
    predicate?: EvolutionConditionPredicate,
    enforceFunc?: EvolutionConditionEnforceFunc,
  ) {
    super((p) => p.friendship >= friendshipAmount && (!predicate || predicate(p)), enforceFunc);
  }
}

interface PokemonEvolutions {
  [key: string]: SpeciesFormEvolution[];
}

/** TODO: Should maybe have multiple tiers for each of these */
const GENERIC_ITEM_EVO_LEVEL = 36;
const HAPPINESS_EVO_LEVEL = 25;
const KNOW_MOVE_EVO_LEVEL = 36;

export const pokemonEvolutions: PokemonEvolutions = {
  [Species.BULBASAUR]: [new SpeciesEvolution(Species.IVYSAUR, 16, null, null, 0)],
  [Species.IVYSAUR]: [new SpeciesEvolution(Species.VENUSAUR, 32, null, null, 0)],
  [Species.CHARMANDER]: [new SpeciesEvolution(Species.CHARMELEON, 16, null, null, 0)],
  [Species.CHARMELEON]: [new SpeciesEvolution(Species.CHARIZARD, 36, null, null, 0)],
  [Species.SQUIRTLE]: [new SpeciesEvolution(Species.WARTORTLE, 16, null, null, 0)],
  [Species.WARTORTLE]: [new SpeciesEvolution(Species.BLASTOISE, 36, null, null, 0)],
  [Species.CATERPIE]: [new SpeciesEvolution(Species.METAPOD, 7, null, null, 0)],
  [Species.METAPOD]: [new SpeciesEvolution(Species.BUTTERFREE, 10, null, null, 0)],
  [Species.WEEDLE]: [new SpeciesEvolution(Species.KAKUNA, 7, null, null, 0)],
  [Species.KAKUNA]: [new SpeciesEvolution(Species.BEEDRILL, 10, null, null, 0)],
  [Species.PIDGEY]: [new SpeciesEvolution(Species.PIDGEOTTO, 18, null, null, 0)],
  [Species.PIDGEOTTO]: [new SpeciesEvolution(Species.PIDGEOT, 36, null, null, 0)],
  [Species.RATTATA]: [new SpeciesEvolution(Species.RATICATE, 20, null, null, 0)],
  [Species.SPEAROW]: [new SpeciesEvolution(Species.FEAROW, 20, null, null, 0)],
  [Species.EKANS]: [new SpeciesEvolution(Species.ARBOK, 22, null, null, 0)],
  [Species.SANDSHREW]: [new SpeciesEvolution(Species.SANDSLASH, 22, null, null, 0)],
  [Species.NIDORAN_F]: [new SpeciesEvolution(Species.NIDORINA, 16, null, null, 0)],
  [Species.NIDORAN_M]: [new SpeciesEvolution(Species.NIDORINO, 16, null, null, 0)],
  [Species.ZUBAT]: [new SpeciesEvolution(Species.GOLBAT, 22, null, null, 0)],
  [Species.ODDISH]: [new SpeciesEvolution(Species.GLOOM, 21, null, null, 0)],
  [Species.PARAS]: [new SpeciesEvolution(Species.PARASECT, 24, null, null, 0)],
  [Species.VENONAT]: [new SpeciesEvolution(Species.VENOMOTH, 31, null, null, 0)],
  [Species.DIGLETT]: [new SpeciesEvolution(Species.DUGTRIO, 26, null, null, 0)],
  [Species.MEOWTH]: [new SpeciesFormEvolution(Species.PERSIAN, "", "", 28, null, null, 0)],
  [Species.PSYDUCK]: [new SpeciesEvolution(Species.GOLDUCK, 33, null, null, 0)],
  [Species.MANKEY]: [new SpeciesEvolution(Species.PRIMEAPE, 28, null, null, 0)],
  [Species.POLIWAG]: [new SpeciesEvolution(Species.POLIWHIRL, 25, null, null, 0)],
  [Species.ABRA]: [new SpeciesEvolution(Species.KADABRA, 16, null, null, 0)],
  [Species.MACHOP]: [new SpeciesEvolution(Species.MACHOKE, 28, null, null, 0)],
  [Species.BELLSPROUT]: [new SpeciesEvolution(Species.WEEPINBELL, 21, null, null, 0)],
  [Species.TENTACOOL]: [new SpeciesEvolution(Species.TENTACRUEL, 30, null, null, 0)],
  [Species.GEODUDE]: [new SpeciesEvolution(Species.GRAVELER, 25, null, null, 0)],
  [Species.PONYTA]: [new SpeciesEvolution(Species.RAPIDASH, 40, null, null, 0)],
  [Species.SLOWPOKE]: [
    new SpeciesEvolution(Species.SLOWBRO, 37, null, null, 0),
    new SpeciesEvolution(Species.SLOWKING, 1, EvolutionItem.LINKING_CORD, null, 37),
  ],
  [Species.MAGNEMITE]: [new SpeciesEvolution(Species.MAGNETON, 30, null, null, 0)],
  [Species.DODUO]: [new SpeciesEvolution(Species.DODRIO, 31, null, null, 0)],
  [Species.SEEL]: [new SpeciesEvolution(Species.DEWGONG, 34, null, null, 0)],
  [Species.GRIMER]: [new SpeciesEvolution(Species.MUK, 38, null, null, 0)],
  [Species.GASTLY]: [new SpeciesEvolution(Species.HAUNTER, 25, null, null, 0)],
  [Species.DROWZEE]: [new SpeciesEvolution(Species.HYPNO, 26, null, null, 0)],
  [Species.KRABBY]: [new SpeciesEvolution(Species.KINGLER, 28, null, null, 0)],
  [Species.VOLTORB]: [new SpeciesEvolution(Species.ELECTRODE, 30, null, null, 0)],
  [Species.CUBONE]: [
    new SpeciesEvolution(
      Species.ALOLA_MAROWAK,
      28,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      28,
    ),
    new SpeciesEvolution(
      Species.MAROWAK,
      28,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      28,
    ),
  ],
  [Species.TYROGUE]: [
    /**
     * Custom: Evolves into Hitmonlee, Hitmonchan or Hitmontop at level 20
     * if it knows Low Sweep, Mach Punch, or Rapid Spin, respectively.
     * If Tyrogue knows multiple of these moves, its evolution is based on
     * the first qualifying move in its moveset.
     */
    new SpeciesEvolution(
      Species.HITMONLEE,
      20,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p
            .getMoveset(true)
            .find((move) => move && [MoveId.LOW_SWEEP, MoveId.MACH_PUNCH, MoveId.RAPID_SPIN].includes(move?.moveId))
            ?.moveId === MoveId.LOW_SWEEP,
      ),
      20,
    ),
    new SpeciesEvolution(
      Species.HITMONCHAN,
      20,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p
            .getMoveset(true)
            .find((move) => move && [MoveId.LOW_SWEEP, MoveId.MACH_PUNCH, MoveId.RAPID_SPIN].includes(move?.moveId))
            ?.moveId === MoveId.MACH_PUNCH,
      ),
      20,
    ),
    new SpeciesEvolution(
      Species.HITMONTOP,
      20,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p
            .getMoveset(true)
            .find((move) => move && [MoveId.LOW_SWEEP, MoveId.MACH_PUNCH, MoveId.RAPID_SPIN].includes(move?.moveId))
            ?.moveId === MoveId.RAPID_SPIN,
      ),
      20,
    ),
  ],
  [Species.KOFFING]: [
    new SpeciesEvolution(
      Species.GALAR_WEEZING,
      35,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      35,
    ),
    new SpeciesEvolution(
      Species.WEEZING,
      35,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      35,
    ),
  ],
  [Species.RHYHORN]: [new SpeciesEvolution(Species.RHYDON, 42, null, null, 0)],
  [Species.HORSEA]: [new SpeciesEvolution(Species.SEADRA, 32, null, null, 0)],
  [Species.GOLDEEN]: [new SpeciesEvolution(Species.SEAKING, 33, null, null, 0)],
  [Species.SMOOCHUM]: [new SpeciesEvolution(Species.JYNX, 30, null, null, 0)],
  [Species.ELEKID]: [new SpeciesEvolution(Species.ELECTABUZZ, 30, null, null, 0)],
  [Species.MAGBY]: [new SpeciesEvolution(Species.MAGMAR, 30, null, null, 0)],
  [Species.MAGIKARP]: [new SpeciesEvolution(Species.GYARADOS, 20, null, null, 0)],
  [Species.OMANYTE]: [new SpeciesEvolution(Species.OMASTAR, 40, null, null, 0)],
  [Species.KABUTO]: [new SpeciesEvolution(Species.KABUTOPS, 40, null, null, 0)],
  [Species.DRATINI]: [new SpeciesEvolution(Species.DRAGONAIR, 30, null, null, 0)],
  [Species.DRAGONAIR]: [new SpeciesEvolution(Species.DRAGONITE, 55, null, null, 0)],
  [Species.CHIKORITA]: [new SpeciesEvolution(Species.BAYLEEF, 16, null, null, 0)],
  [Species.BAYLEEF]: [new SpeciesEvolution(Species.MEGANIUM, 32, null, null, 0)],
  [Species.CYNDAQUIL]: [new SpeciesEvolution(Species.QUILAVA, 14, null, null, 0)],
  [Species.QUILAVA]: [
    new SpeciesEvolution(
      Species.HISUI_TYPHLOSION,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      36,
    ),
    new SpeciesEvolution(
      Species.TYPHLOSION,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      36,
    ),
  ],
  [Species.TOTODILE]: [new SpeciesEvolution(Species.CROCONAW, 18, null, null, 0)],
  [Species.CROCONAW]: [new SpeciesEvolution(Species.FERALIGATR, 30, null, null, 0)],
  [Species.SENTRET]: [new SpeciesEvolution(Species.FURRET, 15, null, null, 0)],
  [Species.HOOTHOOT]: [new SpeciesEvolution(Species.NOCTOWL, 20, null, null, 0)],
  [Species.LEDYBA]: [new SpeciesEvolution(Species.LEDIAN, 18, null, null, 0)],
  [Species.SPINARAK]: [new SpeciesEvolution(Species.ARIADOS, 22, null, null, 0)],
  [Species.CHINCHOU]: [new SpeciesEvolution(Species.LANTURN, 27, null, null, 0)],
  [Species.NATU]: [new SpeciesEvolution(Species.XATU, 25, null, null, 0)],
  [Species.MAREEP]: [new SpeciesEvolution(Species.FLAAFFY, 15, null, null, 0)],
  [Species.FLAAFFY]: [new SpeciesEvolution(Species.AMPHAROS, 30, null, null, 0)],
  [Species.MARILL]: [new SpeciesEvolution(Species.AZUMARILL, 18, null, null, 0)],
  [Species.HOPPIP]: [new SpeciesEvolution(Species.SKIPLOOM, 18, null, null, 0)],
  [Species.SKIPLOOM]: [new SpeciesEvolution(Species.JUMPLUFF, 27, null, null, 0)],
  [Species.WOOPER]: [new SpeciesEvolution(Species.QUAGSIRE, 20, null, null, 0)],
  [Species.WYNAUT]: [new SpeciesEvolution(Species.WOBBUFFET, 15, null, null, 0)],
  [Species.PINECO]: [new SpeciesEvolution(Species.FORRETRESS, 31, null, null, 0)],
  [Species.SNUBBULL]: [new SpeciesEvolution(Species.GRANBULL, 23, null, null, 0)],
  [Species.TEDDIURSA]: [new SpeciesEvolution(Species.URSARING, 30, null, null, 0)],
  [Species.SLUGMA]: [new SpeciesEvolution(Species.MAGCARGO, 38, null, null, 0)],
  [Species.SWINUB]: [new SpeciesEvolution(Species.PILOSWINE, 33, null, null, 0)],
  [Species.REMORAID]: [new SpeciesEvolution(Species.OCTILLERY, 25, null, null, 0)],
  [Species.HOUNDOUR]: [new SpeciesEvolution(Species.HOUNDOOM, 24, null, null, 0)],
  [Species.PHANPY]: [new SpeciesEvolution(Species.DONPHAN, 25, null, null, 0)],
  [Species.LARVITAR]: [new SpeciesEvolution(Species.PUPITAR, 30, null, null, 0)],
  [Species.PUPITAR]: [new SpeciesEvolution(Species.TYRANITAR, 55, null, null, 0)],
  [Species.TREECKO]: [new SpeciesEvolution(Species.GROVYLE, 16, null, null, 0)],
  [Species.GROVYLE]: [new SpeciesEvolution(Species.SCEPTILE, 36, null, null, 0)],
  [Species.TORCHIC]: [new SpeciesEvolution(Species.COMBUSKEN, 16, null, null, 0)],
  [Species.COMBUSKEN]: [new SpeciesEvolution(Species.BLAZIKEN, 36, null, null, 0)],
  [Species.MUDKIP]: [new SpeciesEvolution(Species.MARSHTOMP, 16, null, null, 0)],
  [Species.MARSHTOMP]: [new SpeciesEvolution(Species.SWAMPERT, 36, null, null, 0)],
  [Species.POOCHYENA]: [new SpeciesEvolution(Species.MIGHTYENA, 18, null, null, 0)],
  [Species.ZIGZAGOON]: [new SpeciesEvolution(Species.LINOONE, 20, null, null, 0)],
  [Species.WURMPLE]: [
    new SpeciesEvolution(
      Species.SILCOON,
      7,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      7,
    ),
    new SpeciesEvolution(
      Species.CASCOON,
      7,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      7,
    ),
  ],
  [Species.SILCOON]: [new SpeciesEvolution(Species.BEAUTIFLY, 10, null, null, 0)],
  [Species.CASCOON]: [new SpeciesEvolution(Species.DUSTOX, 10, null, null, 0)],
  [Species.LOTAD]: [new SpeciesEvolution(Species.LOMBRE, 14, null, null, 0)],
  [Species.SEEDOT]: [new SpeciesEvolution(Species.NUZLEAF, 14, null, null, 0)],
  [Species.TAILLOW]: [new SpeciesEvolution(Species.SWELLOW, 22, null, null, 0)],
  [Species.WINGULL]: [new SpeciesEvolution(Species.PELIPPER, 25, null, null, 0)],
  [Species.RALTS]: [new SpeciesEvolution(Species.KIRLIA, 20, null, null, 0)],
  [Species.KIRLIA]: [
    new SpeciesEvolution(
      Species.GARDEVOIR,
      30,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      30,
    ),
    new SpeciesEvolution(
      Species.GALLADE,
      30,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      30,
    ),
  ],
  [Species.SURSKIT]: [new SpeciesEvolution(Species.MASQUERAIN, 22, null, null, 0)],
  [Species.SHROOMISH]: [new SpeciesEvolution(Species.BRELOOM, 23, null, null, 0)],
  [Species.SLAKOTH]: [new SpeciesEvolution(Species.VIGOROTH, 18, null, null, 0)],
  [Species.VIGOROTH]: [new SpeciesEvolution(Species.SLAKING, 36, null, null, 0)],
  [Species.NINCADA]: [
    new SpeciesEvolution(Species.NINJASK, 20, null, null, 20),
    new SpeciesEvolution(
      Species.SHEDINJA,
      20,
      null,
      new SpeciesEvolutionCondition(
        (_p) => globalScene.getPlayerParty().length < 6 && globalScene.pokeballCounts[PokeballType.POKEBALL] > 0,
      ),
      20,
    ),
  ],
  [Species.WHISMUR]: [new SpeciesEvolution(Species.LOUDRED, 20, null, null, 0)],
  [Species.LOUDRED]: [new SpeciesEvolution(Species.EXPLOUD, 40, null, null, 0)],
  [Species.MAKUHITA]: [new SpeciesEvolution(Species.HARIYAMA, 24, null, null, 0)],
  [Species.ARON]: [new SpeciesEvolution(Species.LAIRON, 32, null, null, 0)],
  [Species.LAIRON]: [new SpeciesEvolution(Species.AGGRON, 42, null, null, 0)],
  [Species.MEDITITE]: [new SpeciesEvolution(Species.MEDICHAM, 37, null, null, 0)],
  [Species.ELECTRIKE]: [new SpeciesEvolution(Species.MANECTRIC, 26, null, null, 0)],
  [Species.GULPIN]: [new SpeciesEvolution(Species.SWALOT, 26, null, null, 0)],
  [Species.CARVANHA]: [new SpeciesEvolution(Species.SHARPEDO, 30, null, null, 0)],
  [Species.WAILMER]: [new SpeciesEvolution(Species.WAILORD, 40, null, null, 0)],
  [Species.NUMEL]: [new SpeciesEvolution(Species.CAMERUPT, 33, null, null, 0)],
  [Species.SPOINK]: [new SpeciesEvolution(Species.GRUMPIG, 32, null, null, 0)],
  [Species.TRAPINCH]: [new SpeciesEvolution(Species.VIBRAVA, 35, null, null, 0)],
  [Species.VIBRAVA]: [new SpeciesEvolution(Species.FLYGON, 45, null, null, 0)],
  [Species.CACNEA]: [new SpeciesEvolution(Species.CACTURNE, 32, null, null, 0)],
  [Species.SWABLU]: [new SpeciesEvolution(Species.ALTARIA, 35, null, null, 0)],
  [Species.BARBOACH]: [new SpeciesEvolution(Species.WHISCASH, 30, null, null, 0)],
  [Species.CORPHISH]: [new SpeciesEvolution(Species.CRAWDAUNT, 30, null, null, 0)],
  [Species.BALTOY]: [new SpeciesEvolution(Species.CLAYDOL, 36, null, null, 0)],
  [Species.LILEEP]: [new SpeciesEvolution(Species.CRADILY, 40, null, null, 0)],
  [Species.ANORITH]: [new SpeciesEvolution(Species.ARMALDO, 40, null, null, 0)],
  [Species.SHUPPET]: [new SpeciesEvolution(Species.BANETTE, 37, null, null, 0)],
  [Species.DUSKULL]: [new SpeciesEvolution(Species.DUSCLOPS, 37, null, null, 0)],
  [Species.SNORUNT]: [
    new SpeciesEvolution(
      Species.GLALIE,
      42,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      42,
    ),
    new SpeciesEvolution(
      Species.FROSLASS,
      42,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      42,
    ),
  ],
  [Species.SPHEAL]: [new SpeciesEvolution(Species.SEALEO, 32, null, null, 0)],
  [Species.SEALEO]: [new SpeciesEvolution(Species.WALREIN, 44, null, null, 0)],
  [Species.BAGON]: [new SpeciesEvolution(Species.SHELGON, 30, null, null, 0)],
  [Species.SHELGON]: [new SpeciesEvolution(Species.SALAMENCE, 50, null, null, 0)],
  [Species.BELDUM]: [new SpeciesEvolution(Species.METANG, 20, null, null, 0)],
  [Species.METANG]: [new SpeciesEvolution(Species.METAGROSS, 45, null, null, 0)],
  [Species.TURTWIG]: [new SpeciesEvolution(Species.GROTLE, 18, null, null, 0)],
  [Species.GROTLE]: [new SpeciesEvolution(Species.TORTERRA, 32, null, null, 0)],
  [Species.CHIMCHAR]: [new SpeciesEvolution(Species.MONFERNO, 14, null, null, 0)],
  [Species.MONFERNO]: [new SpeciesEvolution(Species.INFERNAPE, 36, null, null, 0)],
  [Species.PIPLUP]: [new SpeciesEvolution(Species.PRINPLUP, 16, null, null, 0)],
  [Species.PRINPLUP]: [new SpeciesEvolution(Species.EMPOLEON, 36, null, null, 0)],
  [Species.STARLY]: [new SpeciesEvolution(Species.STARAVIA, 14, null, null, 0)],
  [Species.STARAVIA]: [new SpeciesEvolution(Species.STARAPTOR, 34, null, null, 0)],
  [Species.BIDOOF]: [new SpeciesEvolution(Species.BIBAREL, 15, null, null, 0)],
  [Species.KRICKETOT]: [new SpeciesEvolution(Species.KRICKETUNE, 10, null, null, 0)],
  [Species.SHINX]: [new SpeciesEvolution(Species.LUXIO, 15, null, null, 0)],
  [Species.LUXIO]: [new SpeciesEvolution(Species.LUXRAY, 30, null, null, 0)],
  [Species.CRANIDOS]: [new SpeciesEvolution(Species.RAMPARDOS, 30, null, null, 0)],
  [Species.SHIELDON]: [new SpeciesEvolution(Species.BASTIODON, 30, null, null, 0)],
  [Species.BURMY]: [
    new SpeciesEvolution(
      Species.MOTHIM,
      20,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      20,
    ),
    new SpeciesEvolution(
      Species.WORMADAM,
      20,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      20,
    ),
  ],
  [Species.COMBEE]: [
    new SpeciesEvolution(
      Species.VESPIQUEN,
      21,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      20,
    ),
  ],
  [Species.BUIZEL]: [new SpeciesEvolution(Species.FLOATZEL, 26, null, null, 0)],
  [Species.CHERUBI]: [new SpeciesEvolution(Species.CHERRIM, 25, null, null, 0)],
  [Species.SHELLOS]: [new SpeciesEvolution(Species.GASTRODON, 30, null, null, 0)],
  [Species.DRIFLOON]: [new SpeciesEvolution(Species.DRIFBLIM, 28, null, null, 0)],
  [Species.GLAMEOW]: [new SpeciesEvolution(Species.PURUGLY, 38, null, null, 0)],
  [Species.STUNKY]: [new SpeciesEvolution(Species.SKUNTANK, 34, null, null, 0)],
  [Species.BRONZOR]: [new SpeciesEvolution(Species.BRONZONG, 33, null, null, 0)],
  [Species.GIBLE]: [new SpeciesEvolution(Species.GABITE, 24, null, null, 0)],
  [Species.GABITE]: [new SpeciesEvolution(Species.GARCHOMP, 48, null, null, 0)],
  [Species.HIPPOPOTAS]: [new SpeciesEvolution(Species.HIPPOWDON, 34, null, null, 0)],
  [Species.SKORUPI]: [new SpeciesEvolution(Species.DRAPION, 40, null, null, 0)],
  [Species.CROAGUNK]: [new SpeciesEvolution(Species.TOXICROAK, 37, null, null, 0)],
  [Species.FINNEON]: [new SpeciesEvolution(Species.LUMINEON, 31, null, null, 0)],
  [Species.MANTYKE]: [
    new SpeciesEvolution(
      Species.MANTINE,
      32,
      null,
      new SpeciesEvolutionCondition((_p) => !!globalScene.gameData.dexData[Species.REMORAID].caughtAttr),
      32,
    ),
  ],
  [Species.SNOVER]: [new SpeciesEvolution(Species.ABOMASNOW, 40, null, null, 0)],
  [Species.SNIVY]: [new SpeciesEvolution(Species.SERVINE, 17, null, null, 0)],
  [Species.SERVINE]: [new SpeciesEvolution(Species.SERPERIOR, 36, null, null, 0)],
  [Species.TEPIG]: [new SpeciesEvolution(Species.PIGNITE, 17, null, null, 0)],
  [Species.PIGNITE]: [new SpeciesEvolution(Species.EMBOAR, 36, null, null, 0)],
  [Species.OSHAWOTT]: [new SpeciesEvolution(Species.DEWOTT, 17, null, null, 0)],
  [Species.DEWOTT]: [
    new SpeciesEvolution(
      Species.HISUI_SAMUROTT,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      36,
    ),
    new SpeciesEvolution(
      Species.SAMUROTT,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      36,
    ),
  ],
  [Species.PATRAT]: [new SpeciesEvolution(Species.WATCHOG, 20, null, null, 0)],
  [Species.LILLIPUP]: [new SpeciesEvolution(Species.HERDIER, 16, null, null, 0)],
  [Species.HERDIER]: [new SpeciesEvolution(Species.STOUTLAND, 32, null, null, 0)],
  [Species.PURRLOIN]: [new SpeciesEvolution(Species.LIEPARD, 20, null, null, 0)],
  [Species.PIDOVE]: [new SpeciesEvolution(Species.TRANQUILL, 21, null, null, 0)],
  [Species.TRANQUILL]: [new SpeciesEvolution(Species.UNFEZANT, 32, null, null, 0)],
  [Species.BLITZLE]: [new SpeciesEvolution(Species.ZEBSTRIKA, 27, null, null, 0)],
  [Species.ROGGENROLA]: [new SpeciesEvolution(Species.BOLDORE, 25, null, null, 0)],
  [Species.DRILBUR]: [new SpeciesEvolution(Species.EXCADRILL, 31, null, null, 0)],
  [Species.TIMBURR]: [new SpeciesEvolution(Species.GURDURR, 25, null, null, 0)],
  [Species.TYMPOLE]: [new SpeciesEvolution(Species.PALPITOAD, 25, null, null, 0)],
  [Species.PALPITOAD]: [new SpeciesEvolution(Species.SEISMITOAD, 36, null, null, 0)],
  [Species.SEWADDLE]: [new SpeciesEvolution(Species.SWADLOON, 20, null, null, 0)],
  [Species.VENIPEDE]: [new SpeciesEvolution(Species.WHIRLIPEDE, 22, null, null, 0)],
  [Species.WHIRLIPEDE]: [new SpeciesEvolution(Species.SCOLIPEDE, 30, null, null, 0)],
  [Species.SANDILE]: [new SpeciesEvolution(Species.KROKOROK, 29, null, null, 0)],
  [Species.KROKOROK]: [new SpeciesEvolution(Species.KROOKODILE, 40, null, null, 0)],
  [Species.DARUMAKA]: [new SpeciesEvolution(Species.DARMANITAN, 35, null, null, 0)],
  [Species.DWEBBLE]: [new SpeciesEvolution(Species.CRUSTLE, 34, null, null, 0)],
  [Species.SCRAGGY]: [new SpeciesEvolution(Species.SCRAFTY, 39, null, null, 0)],
  [Species.YAMASK]: [new SpeciesEvolution(Species.COFAGRIGUS, 34, null, null, 0)],
  [Species.TIRTOUGA]: [new SpeciesEvolution(Species.CARRACOSTA, 37, null, null, 0)],
  [Species.ARCHEN]: [new SpeciesEvolution(Species.ARCHEOPS, 37, null, null, 0)],
  [Species.TRUBBISH]: [new SpeciesEvolution(Species.GARBODOR, 36, null, null, 0)],
  [Species.ZORUA]: [new SpeciesEvolution(Species.ZOROARK, 30, null, null, 0)],
  [Species.GOTHITA]: [new SpeciesEvolution(Species.GOTHORITA, 32, null, null, 0)],
  [Species.GOTHORITA]: [new SpeciesEvolution(Species.GOTHITELLE, 41, null, null, 0)],
  [Species.SOLOSIS]: [new SpeciesEvolution(Species.DUOSION, 32, null, null, 0)],
  [Species.DUOSION]: [new SpeciesEvolution(Species.REUNICLUS, 41, null, null, 0)],
  [Species.DUCKLETT]: [new SpeciesEvolution(Species.SWANNA, 35, null, null, 0)],
  [Species.VANILLITE]: [new SpeciesEvolution(Species.VANILLISH, 35, null, null, 0)],
  [Species.VANILLISH]: [new SpeciesEvolution(Species.VANILLUXE, 47, null, null, 0)],
  [Species.DEERLING]: [new SpeciesEvolution(Species.SAWSBUCK, 34, null, null, 0)],
  [Species.FOONGUS]: [new SpeciesEvolution(Species.AMOONGUSS, 39, null, null, 0)],
  [Species.FRILLISH]: [new SpeciesEvolution(Species.JELLICENT, 40, null, null, 0)],
  [Species.JOLTIK]: [new SpeciesEvolution(Species.GALVANTULA, 36, null, null, 0)],
  [Species.FERROSEED]: [new SpeciesEvolution(Species.FERROTHORN, 40, null, null, 0)],
  [Species.KLINK]: [new SpeciesEvolution(Species.KLANG, 38, null, null, 0)],
  [Species.KLANG]: [new SpeciesEvolution(Species.KLINKLANG, 49, null, null, 0)],
  [Species.TYNAMO]: [new SpeciesEvolution(Species.EELEKTRIK, 39, null, null, 0)],
  [Species.ELGYEM]: [new SpeciesEvolution(Species.BEHEEYEM, 42, null, null, 0)],
  [Species.LITWICK]: [new SpeciesEvolution(Species.LAMPENT, 41, null, null, 0)],
  [Species.AXEW]: [new SpeciesEvolution(Species.FRAXURE, 38, null, null, 0)],
  [Species.FRAXURE]: [new SpeciesEvolution(Species.HAXORUS, 48, null, null, 0)],
  [Species.CUBCHOO]: [new SpeciesEvolution(Species.BEARTIC, 37, null, null, 0)],
  [Species.MIENFOO]: [new SpeciesEvolution(Species.MIENSHAO, 50, null, null, 0)],
  [Species.GOLETT]: [new SpeciesEvolution(Species.GOLURK, 43, null, null, 0)],
  [Species.PAWNIARD]: [new SpeciesEvolution(Species.BISHARP, 52, null, null, 0)],
  [Species.BISHARP]: [
    new SpeciesEvolution(Species.KINGAMBIT, 1, EvolutionItem.LEADERS_CREST, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.RUFFLET]: [
    new SpeciesEvolution(
      Species.HISUI_BRAVIARY,
      54,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      54,
    ),
    new SpeciesEvolution(
      Species.BRAVIARY,
      54,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      54,
    ),
  ],
  [Species.VULLABY]: [new SpeciesEvolution(Species.MANDIBUZZ, 54, null, null, 0)],
  [Species.DEINO]: [new SpeciesEvolution(Species.ZWEILOUS, 50, null, null, 0)],
  [Species.ZWEILOUS]: [new SpeciesEvolution(Species.HYDREIGON, 64, null, null, 0)],
  [Species.LARVESTA]: [new SpeciesEvolution(Species.VOLCARONA, 59, null, null, 0)],
  [Species.CHESPIN]: [new SpeciesEvolution(Species.QUILLADIN, 16, null, null, 0)],
  [Species.QUILLADIN]: [new SpeciesEvolution(Species.CHESNAUGHT, 36, null, null, 0)],
  [Species.FENNEKIN]: [new SpeciesEvolution(Species.BRAIXEN, 16, null, null, 0)],
  [Species.BRAIXEN]: [new SpeciesEvolution(Species.DELPHOX, 36, null, null, 0)],
  [Species.FROAKIE]: [new SpeciesEvolution(Species.FROGADIER, 16, null, null, 0)],
  [Species.FROGADIER]: [new SpeciesEvolution(Species.GRENINJA, 36, null, null, 0)],
  [Species.BUNNELBY]: [new SpeciesEvolution(Species.DIGGERSBY, 20, null, null, 0)],
  [Species.FLETCHLING]: [new SpeciesEvolution(Species.FLETCHINDER, 17, null, null, 0)],
  [Species.FLETCHINDER]: [new SpeciesEvolution(Species.TALONFLAME, 35, null, null, 0)],
  [Species.SCATTERBUG]: [new SpeciesEvolution(Species.SPEWPA, 9, null, null, 0)],
  [Species.SPEWPA]: [new SpeciesEvolution(Species.VIVILLON, 12, null, null, 0)],
  [Species.LITLEO]: [new SpeciesEvolution(Species.PYROAR, 35, null, null, 0)],
  [Species.FLABEBE]: [new SpeciesEvolution(Species.FLOETTE, 19, null, null, 0)],
  [Species.SKIDDO]: [new SpeciesEvolution(Species.GOGOAT, 32, null, null, 0)],
  [Species.PANCHAM]: [
    new SpeciesEvolution(
      Species.PANGORO,
      32,
      null,
      new SpeciesEvolutionCondition(
        (_p) =>
          !!globalScene.getPlayerParty().find((p) => p.getTypes(false, false, true).indexOf(ElementalType.DARK) > -1),
      ),
      32,
    ),
  ],
  [Species.ESPURR]: [
    new SpeciesFormEvolution(
      Species.MEOWSTIC,
      "",
      "female",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      25,
    ),
    new SpeciesFormEvolution(
      Species.MEOWSTIC,
      "",
      "",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      25,
    ),
  ],
  [Species.HONEDGE]: [new SpeciesEvolution(Species.DOUBLADE, 35, null, null, 0)],
  [Species.INKAY]: [new SpeciesEvolution(Species.MALAMAR, 30, null, null, 0)],
  [Species.BINACLE]: [new SpeciesEvolution(Species.BARBARACLE, 39, null, null, 0)],
  [Species.SKRELP]: [new SpeciesEvolution(Species.DRAGALGE, 48, null, null, 0)],
  [Species.CLAUNCHER]: [new SpeciesEvolution(Species.CLAWITZER, 37, null, null, 0)],
  [Species.TYRUNT]: [
    new SpeciesEvolution(
      Species.TYRANTRUM,
      39,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      39,
    ),
  ],
  [Species.AMAURA]: [
    new SpeciesEvolution(
      Species.AURORUS,
      39,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      39,
    ),
  ],
  [Species.GOOMY]: [
    new SpeciesEvolution(
      Species.HISUI_SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      40,
    ),
    new SpeciesEvolution(
      Species.SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      40,
    ),
  ],
  [Species.SLIGGOO]: [
    new SpeciesEvolution(
      Species.GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
      50,
    ),
  ],
  [Species.BERGMITE]: [
    new SpeciesEvolution(
      Species.HISUI_AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      37,
    ),
    new SpeciesEvolution(
      Species.AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      37,
    ),
  ],
  [Species.NOIBAT]: [new SpeciesEvolution(Species.NOIVERN, 48, null, null, 0)],
  [Species.ROWLET]: [new SpeciesEvolution(Species.DARTRIX, 17, null, null, 0)],
  [Species.DARTRIX]: [
    new SpeciesEvolution(
      Species.HISUI_DECIDUEYE,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      36,
    ),
    new SpeciesEvolution(
      Species.DECIDUEYE,
      34,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      36,
    ),
  ],
  [Species.LITTEN]: [new SpeciesEvolution(Species.TORRACAT, 17, null, null, 0)],
  [Species.TORRACAT]: [new SpeciesEvolution(Species.INCINEROAR, 34, null, null, 0)],
  [Species.POPPLIO]: [new SpeciesEvolution(Species.BRIONNE, 17, null, null, 0)],
  [Species.BRIONNE]: [new SpeciesEvolution(Species.PRIMARINA, 34, null, null, 0)],
  [Species.PIKIPEK]: [new SpeciesEvolution(Species.TRUMBEAK, 14, null, null, 0)],
  [Species.TRUMBEAK]: [new SpeciesEvolution(Species.TOUCANNON, 28, null, null, 0)],
  [Species.YUNGOOS]: [
    new SpeciesEvolution(
      Species.GUMSHOOS,
      20,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      20,
    ),
  ],
  [Species.GRUBBIN]: [new SpeciesEvolution(Species.CHARJABUG, 20, null, null, 0)],
  [Species.CUTIEFLY]: [new SpeciesEvolution(Species.RIBOMBEE, 25, null, null, 0)],
  [Species.MAREANIE]: [new SpeciesEvolution(Species.TOXAPEX, 38, null, null, 0)],
  [Species.MUDBRAY]: [new SpeciesEvolution(Species.MUDSDALE, 30, null, null, 0)],
  [Species.DEWPIDER]: [new SpeciesEvolution(Species.ARAQUANID, 22, null, null, 0)],
  [Species.FOMANTIS]: [
    new SpeciesEvolution(
      Species.LURANTIS,
      34,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
      34,
    ),
  ],
  [Species.MORELULL]: [new SpeciesEvolution(Species.SHIINOTIC, 24, null, null, 0)],
  [Species.SALANDIT]: [
    new SpeciesEvolution(
      Species.SALAZZLE,
      33,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      33,
    ),
  ],
  [Species.STUFFUL]: [new SpeciesEvolution(Species.BEWEAR, 27, null, null, 0)],
  [Species.BOUNSWEET]: [new SpeciesEvolution(Species.STEENEE, 18, null, null, 0)],
  [Species.WIMPOD]: [new SpeciesEvolution(Species.GOLISOPOD, 30, null, null, 0)],
  [Species.SANDYGAST]: [new SpeciesEvolution(Species.PALOSSAND, 42, null, null, 0)],
  [Species.JANGMO_O]: [new SpeciesEvolution(Species.HAKAMO_O, 35, null, null, 0)],
  [Species.HAKAMO_O]: [new SpeciesEvolution(Species.KOMMO_O, 45, null, null, 0)],
  [Species.COSMOG]: [new SpeciesEvolution(Species.COSMOEM, 23, null, null, 0)],
  [Species.COSMOEM]: [
    new SpeciesEvolution(Species.SOLGALEO, 1, EvolutionItem.SUN_FLUTE, null, 53),
    new SpeciesEvolution(Species.LUNALA, 1, EvolutionItem.MOON_FLUTE, null, 53),
  ],
  [Species.MELTAN]: [new SpeciesEvolution(Species.MELMETAL, 48, null, null, 0)],
  [Species.ALOLA_RATTATA]: [
    new SpeciesEvolution(
      Species.ALOLA_RATICATE,
      20,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      20,
    ),
  ],
  [Species.ALOLA_DIGLETT]: [new SpeciesEvolution(Species.ALOLA_DUGTRIO, 26, null, null, 0)],
  [Species.ALOLA_GEODUDE]: [new SpeciesEvolution(Species.ALOLA_GRAVELER, 25, null, null, 0)],
  [Species.ALOLA_GRIMER]: [new SpeciesEvolution(Species.ALOLA_MUK, 38, null, null, 0)],
  [Species.GROOKEY]: [new SpeciesEvolution(Species.THWACKEY, 16, null, null, 0)],
  [Species.THWACKEY]: [new SpeciesEvolution(Species.RILLABOOM, 35, null, null, 0)],
  [Species.SCORBUNNY]: [new SpeciesEvolution(Species.RABOOT, 16, null, null, 0)],
  [Species.RABOOT]: [new SpeciesEvolution(Species.CINDERACE, 35, null, null, 0)],
  [Species.SOBBLE]: [new SpeciesEvolution(Species.DRIZZILE, 16, null, null, 0)],
  [Species.DRIZZILE]: [new SpeciesEvolution(Species.INTELEON, 35, null, null, 0)],
  [Species.SKWOVET]: [new SpeciesEvolution(Species.GREEDENT, 24, null, null, 0)],
  [Species.ROOKIDEE]: [new SpeciesEvolution(Species.CORVISQUIRE, 18, null, null, 0)],
  [Species.CORVISQUIRE]: [new SpeciesEvolution(Species.CORVIKNIGHT, 38, null, null, 0)],
  [Species.BLIPBUG]: [new SpeciesEvolution(Species.DOTTLER, 10, null, null, 0)],
  [Species.DOTTLER]: [new SpeciesEvolution(Species.ORBEETLE, 30, null, null, 0)],
  [Species.NICKIT]: [new SpeciesEvolution(Species.THIEVUL, 18, null, null, 0)],
  [Species.GOSSIFLEUR]: [new SpeciesEvolution(Species.ELDEGOSS, 20, null, null, 0)],
  [Species.WOOLOO]: [new SpeciesEvolution(Species.DUBWOOL, 24, null, null, 0)],
  [Species.CHEWTLE]: [new SpeciesEvolution(Species.DREDNAW, 22, null, null, 0)],
  [Species.YAMPER]: [new SpeciesEvolution(Species.BOLTUND, 25, null, null, 0)],
  [Species.ROLYCOLY]: [new SpeciesEvolution(Species.CARKOL, 18, null, null, 0)],
  [Species.CARKOL]: [new SpeciesEvolution(Species.COALOSSAL, 34, null, null, 0)],
  [Species.SILICOBRA]: [new SpeciesEvolution(Species.SANDACONDA, 36, null, null, 0)],
  [Species.ARROKUDA]: [new SpeciesEvolution(Species.BARRASKEWDA, 26, null, null, 0)],
  [Species.TOXEL]: [
    new SpeciesFormEvolution(
      Species.TOXTRICITY,
      "",
      "lowkey",
      30,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          [
            Nature.LONELY,
            Nature.BOLD,
            Nature.RELAXED,
            Nature.TIMID,
            Nature.SERIOUS,
            Nature.MODEST,
            Nature.MILD,
            Nature.QUIET,
            Nature.BASHFUL,
            Nature.CALM,
            Nature.GENTLE,
            Nature.CAREFUL,
          ].indexOf(p.getNature()) > -1,
      ),
      30,
    ),
    new SpeciesFormEvolution(Species.TOXTRICITY, "", "amped", 30, null, null, 30),
  ],
  [Species.SIZZLIPEDE]: [new SpeciesEvolution(Species.CENTISKORCH, 28, null, null, 0)],
  [Species.HATENNA]: [new SpeciesEvolution(Species.HATTREM, 32, null, null, 0)],
  [Species.HATTREM]: [new SpeciesEvolution(Species.HATTERENE, 42, null, null, 0)],
  [Species.IMPIDIMP]: [new SpeciesEvolution(Species.MORGREM, 32, null, null, 0)],
  [Species.MORGREM]: [new SpeciesEvolution(Species.GRIMMSNARL, 42, null, null, 0)],
  [Species.CUFANT]: [new SpeciesEvolution(Species.COPPERAJAH, 34, null, null, 0)],
  [Species.DREEPY]: [new SpeciesEvolution(Species.DRAKLOAK, 50, null, null, 0)],
  [Species.DRAKLOAK]: [new SpeciesEvolution(Species.DRAGAPULT, 60, null, null, 0)],
  [Species.GALAR_MEOWTH]: [new SpeciesEvolution(Species.PERRSERKER, 28, null, null, 0)],
  [Species.GALAR_PONYTA]: [new SpeciesEvolution(Species.GALAR_RAPIDASH, 40, null, null, 0)],
  /** Custom level */
  [Species.GALAR_FARFETCHD]: [new SpeciesEvolution(Species.SIRFETCHD, 30, null, null, 30)],
  [Species.GALAR_SLOWPOKE]: [
    new SpeciesEvolution(Species.GALAR_SLOWBRO, 1, EvolutionItem.GALARICA_CUFF, null, 37),
    new SpeciesEvolution(Species.GALAR_SLOWKING, 1, EvolutionItem.GALARICA_WREATH, null, 37),
  ],
  [Species.GALAR_MR_MIME]: [new SpeciesEvolution(Species.MR_RIME, 42, null, null, 0)],
  [Species.GALAR_CORSOLA]: [new SpeciesEvolution(Species.CURSOLA, 38, null, null, 0)],
  [Species.GALAR_ZIGZAGOON]: [new SpeciesEvolution(Species.GALAR_LINOONE, 20, null, null, 0)],
  [Species.GALAR_LINOONE]: [
    new SpeciesEvolution(
      Species.OBSTAGOON,
      35,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      35,
    ),
  ],
  [Species.GALAR_YAMASK]: [new SpeciesEvolution(Species.RUNERIGUS, 34, null, null, 0)],
  [Species.HISUI_ZORUA]: [new SpeciesEvolution(Species.HISUI_ZOROARK, 30, null, null, 0)],
  [Species.HISUI_SLIGGOO]: [
    new SpeciesEvolution(
      Species.HISUI_GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
      50,
    ),
  ],
  [Species.SPRIGATITO]: [new SpeciesEvolution(Species.FLORAGATO, 16, null, null, 0)],
  [Species.FLORAGATO]: [new SpeciesEvolution(Species.MEOWSCARADA, 36, null, null, 0)],
  [Species.FUECOCO]: [new SpeciesEvolution(Species.CROCALOR, 16, null, null, 0)],
  [Species.CROCALOR]: [new SpeciesEvolution(Species.SKELEDIRGE, 36, null, null, 0)],
  [Species.QUAXLY]: [new SpeciesEvolution(Species.QUAXWELL, 16, null, null, 0)],
  [Species.QUAXWELL]: [new SpeciesEvolution(Species.QUAQUAVAL, 36, null, null, 0)],
  [Species.LECHONK]: [
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "female",
      18,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      18,
    ),
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "",
      18,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      18,
    ),
  ],
  [Species.TAROUNTULA]: [new SpeciesEvolution(Species.SPIDOPS, 15, null, null, 0)],
  [Species.NYMBLE]: [new SpeciesEvolution(Species.LOKIX, 24, null, null, 0)],
  [Species.PAWMI]: [new SpeciesEvolution(Species.PAWMO, 18, null, null, 0)],
  [Species.PAWMO]: [new SpeciesEvolution(Species.PAWMOT, 32, null, null, 0)],
  [Species.TANDEMAUS]: [
    new SpeciesFormEvolution(
      Species.MAUSHOLD,
      "",
      "three",
      25,
      null,
      new SpeciesEvolutionCondition((p) => {
        let ret = false;
        globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(4)), p.id);
        return ret;
      }),
      25,
    ),
    new SpeciesEvolution(Species.MAUSHOLD, 25, null, null, 0),
  ],
  [Species.FIDOUGH]: [new SpeciesEvolution(Species.DACHSBUN, 26, null, null, 0)],
  [Species.SMOLIV]: [new SpeciesEvolution(Species.DOLLIV, 25, null, null, 0)],
  [Species.DOLLIV]: [new SpeciesEvolution(Species.ARBOLIVA, 35, null, null, 0)],
  [Species.NACLI]: [new SpeciesEvolution(Species.NACLSTACK, 24, null, null, 0)],
  [Species.NACLSTACK]: [new SpeciesEvolution(Species.GARGANACL, 38, null, null, 0)],
  [Species.WATTREL]: [new SpeciesEvolution(Species.KILOWATTREL, 25, null, null, 0)],
  [Species.MASCHIFF]: [new SpeciesEvolution(Species.MABOSSTIFF, 30, null, null, 0)],
  [Species.SHROODLE]: [new SpeciesEvolution(Species.GRAFAIAI, 28, null, null, 0)],
  [Species.BRAMBLIN]: [new SpeciesEvolution(Species.BRAMBLEGHAST, 30, null, null, 0)],
  [Species.TOEDSCOOL]: [new SpeciesEvolution(Species.TOEDSCRUEL, 30, null, null, 0)],
  [Species.RELLOR]: [new SpeciesEvolution(Species.RABSCA, 29, null, null, 0)],
  [Species.FLITTLE]: [new SpeciesEvolution(Species.ESPATHRA, 35, null, null, 0)],
  [Species.TINKATINK]: [new SpeciesEvolution(Species.TINKATUFF, 24, null, null, 0)],
  [Species.TINKATUFF]: [new SpeciesEvolution(Species.TINKATON, 38, null, null, 0)],
  [Species.WIGLETT]: [new SpeciesEvolution(Species.WUGTRIO, 26, null, null, 0)],
  [Species.FINIZEN]: [new SpeciesEvolution(Species.PALAFIN, 38, null, null, 0)],
  [Species.VAROOM]: [new SpeciesEvolution(Species.REVAVROOM, 40, null, null, 0)],
  [Species.GLIMMET]: [new SpeciesEvolution(Species.GLIMMORA, 35, null, null, 0)],
  [Species.GREAVARD]: [
    new SpeciesEvolution(
      Species.HOUNDSTONE,
      30,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
      30,
    ),
  ],
  [Species.FRIGIBAX]: [new SpeciesEvolution(Species.ARCTIBAX, 35, null, null, 0)],
  [Species.ARCTIBAX]: [new SpeciesEvolution(Species.BAXCALIBUR, 54, null, null, 0)],
  [Species.PALDEA_WOOPER]: [new SpeciesEvolution(Species.CLODSIRE, 20, null, null, 0)],
  [Species.PIKACHU]: [
    new SpeciesFormEvolution(Species.ALOLA_RAICHU, "", "", 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.ALOLA_RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.SHINY_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.RAICHU, "", "", 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.NIDORINA]: [
    new SpeciesEvolution(Species.NIDOQUEEN, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.NIDORINO]: [
    new SpeciesEvolution(Species.NIDOKING, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CLEFAIRY]: [
    new SpeciesEvolution(Species.CLEFABLE, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.VULPIX]: [
    new SpeciesEvolution(Species.NINETALES, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.JIGGLYPUFF]: [
    new SpeciesEvolution(Species.WIGGLYTUFF, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GLOOM]: [
    new SpeciesEvolution(Species.VILEPLUME, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.BELLOSSOM, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GROWLITHE]: [
    new SpeciesEvolution(Species.ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.POLIWHIRL]: [
    new SpeciesEvolution(Species.POLIWRATH, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.POLITOED, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.WEEPINBELL]: [
    new SpeciesEvolution(Species.VICTREEBEL, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MAGNETON]: [
    new SpeciesEvolution(Species.MAGNEZONE, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SHELLDER]: [
    new SpeciesEvolution(Species.CLOYSTER, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.EXEGGCUTE]: [
    new SpeciesEvolution(Species.ALOLA_EXEGGUTOR, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.EXEGGUTOR, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TANGELA]: [
    new SpeciesEvolution(
      Species.TANGROWTH,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ANCIENT_POWER).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.LICKITUNG]: [
    new SpeciesEvolution(
      Species.LICKILICKY,
      32,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ROLLOUT).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.STARYU]: [new SpeciesEvolution(Species.STARMIE, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.EEVEE]: [
    new SpeciesFormEvolution(
      Species.SYLVEON,
      "",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(
        120,
        (p) => !!p.getMoveset().find((m) => m.getMove().type === ElementalType.FAIRY),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.SYLVEON,
      "partner",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(
        120,
        (p) => !!p.getMoveset().find((m) => m.getMove().type === ElementalType.FAIRY),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ESPEON,
      "",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120, (_p) => globalScene.arena.isTimeOfDay(TimeOfDay.DAY)),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ESPEON,
      "partner",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120, (_p) => globalScene.arena.isTimeOfDay(TimeOfDay.DAY)),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.UMBREON,
      "",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120, (_p) => globalScene.arena.isTimeOfDay(TimeOfDay.NIGHT)),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.UMBREON,
      "partner",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120, (_p) => globalScene.arena.isTimeOfDay(TimeOfDay.NIGHT)),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.VAPOREON, "", "", 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.VAPOREON,
      "partner",
      "",
      1,
      EvolutionItem.WATER_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.JOLTEON, "", "", 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.JOLTEON,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.FLAREON, "", "", 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(Species.FLAREON, "partner", "", 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(Species.LEAFEON, "", "", 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(Species.LEAFEON, "partner", "", 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(Species.GLACEON, "", "", 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(Species.GLACEON, "partner", "", 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TOGETIC]: [new SpeciesEvolution(Species.TOGEKISS, 1, EvolutionItem.SHINY_STONE, null, HAPPINESS_EVO_LEVEL)],
  [Species.AIPOM]: [
    new SpeciesEvolution(
      Species.AMBIPOM,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DOUBLE_HIT).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.SUNKERN]: [new SpeciesEvolution(Species.SUNFLORA, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.YANMA]: [
    new SpeciesEvolution(
      Species.YANMEGA,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ANCIENT_POWER).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.MURKROW]: [
    new SpeciesEvolution(Species.HONCHKROW, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MISDREAVUS]: [
    new SpeciesEvolution(Species.MISMAGIUS, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GIRAFARIG]: [
    new SpeciesEvolution(
      Species.FARIGIRAF,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.TWIN_BEAM).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.DUNSPARCE]: [
    new SpeciesFormEvolution(
      Species.DUDUNSPARCE,
      "",
      "three-segment",
      1,
      null,
      new SpeciesEvolutionCondition((p) => {
        let ret = false;
        if (p.moveset.filter((m) => m.moveId === MoveId.HYPER_DRILL).length > 0) {
          globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(4)), p.id);
        }
        return ret;
      }),
      KNOW_MOVE_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.DUDUNSPARCE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.HYPER_DRILL).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.GLIGAR]: [
    new SpeciesEvolution(
      Species.GLISCOR,
      1,
      EvolutionItem.RAZOR_FANG,
      new SpeciesEvolutionCondition(
        (_p) => globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK]) /* Razor fang at night*/,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SNEASEL]: [
    new SpeciesEvolution(
      Species.WEAVILE,
      1,
      EvolutionItem.RAZOR_CLAW,
      new SpeciesEvolutionCondition(
        (_p) => globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK]) /* Razor claw at night*/,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.URSARING]: [
    new SpeciesEvolution(Species.URSALUNA, 1, EvolutionItem.PEAT_BLOCK, null, GENERIC_ITEM_EVO_LEVEL), //Ursaring does not evolve into Bloodmoon Ursaluna
  ],
  [Species.PILOSWINE]: [
    new SpeciesEvolution(
      Species.MAMOSWINE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ANCIENT_POWER).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.STANTLER]: [
    new SpeciesEvolution(
      Species.WYRDEER,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.PSYSHIELD_BASH).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.LOMBRE]: [
    new SpeciesEvolution(Species.LUDICOLO, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.NUZLEAF]: [new SpeciesEvolution(Species.SHIFTRY, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.NOSEPASS]: [
    new SpeciesEvolution(Species.PROBOPASS, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SKITTY]: [new SpeciesEvolution(Species.DELCATTY, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.ROSELIA]: [
    new SpeciesEvolution(Species.ROSERADE, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.BONSLY]: [
    new SpeciesEvolution(
      Species.SUDOWOODO,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.MIME_JR]: [
    new SpeciesEvolution(
      Species.GALAR_MR_MIME,
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0
          && globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK]),
      ),
      KNOW_MOVE_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.MR_MIME,
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0
          && globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]),
      ),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.PANSAGE]: [
    new SpeciesEvolution(Species.SIMISAGE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PANSEAR]: [
    new SpeciesEvolution(Species.SIMISEAR, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PANPOUR]: [
    new SpeciesEvolution(Species.SIMIPOUR, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MUNNA]: [new SpeciesEvolution(Species.MUSHARNA, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.COTTONEE]: [
    new SpeciesEvolution(Species.WHIMSICOTT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PETILIL]: [
    new SpeciesEvolution(Species.HISUI_LILLIGANT, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.LILLIGANT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.BASCULIN]: [
    new SpeciesFormEvolution(
      Species.BASCULEGION,
      "white-striped",
      "female",
      40,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      40,
    ),
    new SpeciesFormEvolution(
      Species.BASCULEGION,
      "white-striped",
      "male",
      40,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      40,
    ),
  ],
  [Species.MINCCINO]: [
    new SpeciesEvolution(Species.CINCCINO, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.EELEKTRIK]: [
    new SpeciesEvolution(Species.EELEKTROSS, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.LAMPENT]: [
    new SpeciesEvolution(Species.CHANDELURE, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.FLOETTE]: [
    new SpeciesEvolution(Species.FLORGES, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.DOUBLADE]: [
    new SpeciesEvolution(Species.AEGISLASH, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HELIOPTILE]: [
    new SpeciesEvolution(Species.HELIOLISK, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CHARJABUG]: [
    new SpeciesEvolution(Species.VIKAVOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CRABRAWLER]: [
    new SpeciesEvolution(Species.CRABOMINABLE, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ROCKRUFF]: [
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "",
      "midday",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]) && p.formIndex === 0,
      ),
      25,
    ),
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "own-tempo",
      "dusk",
      25,
      null,
      new SpeciesEvolutionCondition((p) => p.formIndex === 1),
      25,
    ),
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "",
      "midnight",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]) && p.formIndex === 0,
      ),
      25,
    ),
  ],
  [Species.STEENEE]: [
    new SpeciesEvolution(
      Species.TSAREENA,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.STOMP).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.POIPOLE]: [
    new SpeciesEvolution(
      Species.NAGANADEL,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DRAGON_PULSE).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.ALOLA_SANDSHREW]: [
    new SpeciesEvolution(Species.ALOLA_SANDSLASH, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_VULPIX]: [
    new SpeciesEvolution(Species.ALOLA_NINETALES, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.APPLIN]: [
    new SpeciesEvolution(Species.DIPPLIN, 1, EvolutionItem.SYRUPY_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.FLAPPLE, 1, EvolutionItem.TART_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.APPLETUN, 1, EvolutionItem.SWEET_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CLOBBOPUS]: [
    new SpeciesEvolution(
      Species.GRAPPLOCT,
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.moveset.filter((m) => m.moveId === MoveId.TAUNT).length > 0,
      ) /*Once Taunt is implemented, change evo level to 1 and delay to LONG*/,
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.SINISTEA]: [
    new SpeciesFormEvolution(
      Species.POLTEAGEIST,
      "phony",
      "phony",
      1,
      EvolutionItem.CRACKED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.POLTEAGEIST,
      "antique",
      "antique",
      1,
      EvolutionItem.CHIPPED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.MILCERY]: [
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "vanilla-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.TOWN, Biome.PLAINS, Biome.GRASS, Biome.TALL_GRASS, Biome.METROPOLIS]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.BADLANDS, Biome.VOLCANO, Biome.GRAVEYARD, Biome.FACTORY, Biome.SLUM]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "matcha-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.FOREST, Biome.SWAMP, Biome.MEADOW, Biome.JUNGLE]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "mint-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.SEA, Biome.BEACH, Biome.LAKE, Biome.SEABED]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "lemon-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([
          Biome.DESERT,
          Biome.POWER_PLANT,
          Biome.DOJO,
          Biome.RUINS,
          Biome.CONSTRUCTION_SITE,
        ]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "salted-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.MOUNTAIN, Biome.CAVE, Biome.ICE_CAVE, Biome.FAIRY_CAVE, Biome.SNOWY_FOREST]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.WASTELAND, Biome.LABORATORY])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "caramel-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.TEMPLE, Biome.ISLAND])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "rainbow-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.SPACE, Biome.ABYSS, Biome.END])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.DURALUDON]: [
    new SpeciesFormEvolution(Species.ARCHALUDON, "", "", 1, EvolutionItem.METAL_ALLOY, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.KUBFU]: [
    new SpeciesFormEvolution(
      Species.URSHIFU,
      "",
      "single-strike",
      1,
      EvolutionItem.SCROLL_OF_DARKNESS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.URSHIFU,
      "",
      "rapid-strike",
      1,
      EvolutionItem.SCROLL_OF_WATERS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.GALAR_DARUMAKA]: [
    new SpeciesEvolution(Species.GALAR_DARMANITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HISUI_GROWLITHE]: [
    new SpeciesEvolution(Species.HISUI_ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HISUI_VOLTORB]: [
    new SpeciesEvolution(Species.HISUI_ELECTRODE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HISUI_QWILFISH]: [
    new SpeciesEvolution(
      Species.OVERQWIL,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.BARB_BARRAGE).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.HISUI_SNEASEL]: [
    new SpeciesEvolution(
      Species.SNEASLER,
      1,
      EvolutionItem.RAZOR_CLAW,
      new SpeciesEvolutionCondition(
        (_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]) /* Razor claw at day */,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.CHARCADET]: [
    new SpeciesEvolution(Species.ARMAROUGE, 1, EvolutionItem.AUSPICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.CERULEDGE, 1, EvolutionItem.MALICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TADBULB]: [
    new SpeciesEvolution(Species.BELLIBOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CAPSAKID]: [
    new SpeciesEvolution(Species.SCOVILLAIN, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CETODDLE]: [new SpeciesEvolution(Species.CETITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.POLTCHAGEIST]: [
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "counterfeit",
      "unremarkable",
      1,
      EvolutionItem.UNREMARKABLE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "artisan",
      "masterpiece",
      1,
      EvolutionItem.MASTERPIECE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.DIPPLIN]: [
    new SpeciesEvolution(
      Species.HYDRAPPLE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DRAGON_CHEER).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.KADABRA]: [
    new SpeciesEvolution(Species.ALAKAZAM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MACHOKE]: [
    new SpeciesEvolution(Species.MACHAMP, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GRAVELER]: [
    new SpeciesEvolution(Species.GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HAUNTER]: [
    new SpeciesEvolution(Species.GENGAR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ONIX]: [new SpeciesEvolution(Species.STEELIX, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.RHYDON]: [new SpeciesEvolution(Species.RHYPERIOR, 1, EvolutionItem.PROTECTOR, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.SEADRA]: [
    new SpeciesEvolution(Species.KINGDRA, 1, EvolutionItem.DRAGON_SCALE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SCYTHER]: [
    new SpeciesEvolution(Species.SCIZOR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.KLEAVOR, 1, EvolutionItem.BLACK_AUGURITE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ELECTABUZZ]: [
    new SpeciesEvolution(Species.ELECTIVIRE, 1, EvolutionItem.ELECTIRIZER, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MAGMAR]: [
    new SpeciesEvolution(Species.MAGMORTAR, 1, EvolutionItem.MAGMARIZER, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PORYGON]: [new SpeciesEvolution(Species.PORYGON2, 1, EvolutionItem.UPGRADE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.PORYGON2]: [
    new SpeciesEvolution(Species.PORYGON_Z, 1, EvolutionItem.DUBIOUS_DISC, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.FEEBAS]: [new SpeciesEvolution(Species.MILOTIC, 1, EvolutionItem.PRISM_SCALE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.DUSCLOPS]: [
    new SpeciesEvolution(Species.DUSKNOIR, 1, EvolutionItem.REAPER_CLOTH, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CLAMPERL]: [
    new SpeciesEvolution(
      Species.HUNTAIL,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE) /* Deep Sea Tooth */,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.GOREBYSS,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE) /* Deep Sea Scale */,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.BOLDORE]: [
    new SpeciesEvolution(Species.GIGALITH, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GURDURR]: [
    new SpeciesEvolution(Species.CONKELDURR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.KARRABLAST]: [
    new SpeciesEvolution(
      Species.ESCAVALIER,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition((_p) => !!globalScene.gameData.dexData[Species.SHELMET].caughtAttr),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SHELMET]: [
    new SpeciesEvolution(
      Species.ACCELGOR,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition((_p) => !!globalScene.gameData.dexData[Species.KARRABLAST].caughtAttr),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SPRITZEE]: [new SpeciesEvolution(Species.AROMATISSE, 1, EvolutionItem.SACHET, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.SWIRLIX]: [
    new SpeciesEvolution(Species.SLURPUFF, 1, EvolutionItem.WHIPPED_DREAM, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PHANTUMP]: [
    new SpeciesEvolution(Species.TREVENANT, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PUMPKABOO]: [
    new SpeciesEvolution(Species.GOURGEIST, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_GRAVELER]: [
    new SpeciesEvolution(Species.ALOLA_GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PRIMEAPE]: [
    new SpeciesEvolution(
      Species.ANNIHILAPE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.RAGE_FIST).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.GOLBAT]: [
    new SpeciesEvolution(Species.CROBAT, 1, null, new SpeciesFriendshipEvolutionCondition(120), HAPPINESS_EVO_LEVEL),
  ],
  [Species.CHANSEY]: [
    new SpeciesEvolution(Species.BLISSEY, 1, null, new SpeciesFriendshipEvolutionCondition(200), HAPPINESS_EVO_LEVEL),
  ],
  [Species.PICHU]: [
    new SpeciesFormEvolution(
      Species.PIKACHU,
      "spiky",
      "partner",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(90),
      HAPPINESS_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.PIKACHU,
      "",
      "",
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(90),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.CLEFFA]: [
    new SpeciesEvolution(Species.CLEFAIRY, 1, null, new SpeciesFriendshipEvolutionCondition(160), HAPPINESS_EVO_LEVEL),
  ],
  [Species.IGGLYBUFF]: [
    new SpeciesEvolution(Species.JIGGLYPUFF, 1, null, new SpeciesFriendshipEvolutionCondition(70), HAPPINESS_EVO_LEVEL),
  ],
  [Species.TOGEPI]: [
    new SpeciesEvolution(Species.TOGETIC, 1, null, new SpeciesFriendshipEvolutionCondition(70), HAPPINESS_EVO_LEVEL),
  ],
  [Species.AZURILL]: [
    new SpeciesEvolution(Species.MARILL, 1, null, new SpeciesFriendshipEvolutionCondition(70), HAPPINESS_EVO_LEVEL),
  ],
  [Species.BUDEW]: [
    new SpeciesEvolution(
      Species.ROSELIA,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(70, (_p) =>
        globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]),
      ),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.BUNEARY]: [
    new SpeciesEvolution(Species.LOPUNNY, 1, null, new SpeciesFriendshipEvolutionCondition(70), HAPPINESS_EVO_LEVEL),
  ],
  [Species.CHINGLING]: [
    new SpeciesEvolution(
      Species.CHIMECHO,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(90, (_p) =>
        globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]),
      ),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.HAPPINY]: [
    new SpeciesEvolution(Species.CHANSEY, 1, null, new SpeciesFriendshipEvolutionCondition(160), HAPPINESS_EVO_LEVEL),
  ],
  [Species.MUNCHLAX]: [
    new SpeciesEvolution(Species.SNORLAX, 1, null, new SpeciesFriendshipEvolutionCondition(120), HAPPINESS_EVO_LEVEL),
  ],
  [Species.RIOLU]: [
    new SpeciesEvolution(
      Species.LUCARIO,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120, (_p) =>
        globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]),
      ),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.WOOBAT]: [
    new SpeciesEvolution(Species.SWOOBAT, 1, null, new SpeciesFriendshipEvolutionCondition(90), HAPPINESS_EVO_LEVEL),
  ],
  [Species.SWADLOON]: [
    new SpeciesEvolution(Species.LEAVANNY, 1, null, new SpeciesFriendshipEvolutionCondition(120), HAPPINESS_EVO_LEVEL),
  ],
  [Species.TYPE_NULL]: [
    new SpeciesEvolution(Species.SILVALLY, 1, null, new SpeciesFriendshipEvolutionCondition(100), HAPPINESS_EVO_LEVEL),
  ],
  [Species.ALOLA_MEOWTH]: [
    new SpeciesEvolution(
      Species.ALOLA_PERSIAN,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.SNOM]: [
    new SpeciesEvolution(
      Species.FROSMOTH,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(90, (_p) =>
        globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]),
      ),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.GIMMIGHOUL]: [
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "chest",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "roaming",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
};

interface PokemonPrevolutions {
  [key: string]: Species;
}

export const pokemonPrevolutions: PokemonPrevolutions = {};

export function initPokemonPrevolutions(): void {
  const megaFormKeys = [SpeciesFormKey.MEGA, "", SpeciesFormKey.MEGA_X, "", SpeciesFormKey.MEGA_Y].map(
    (sfk) => sfk as string,
  );
  const prevolutionKeys = Object.keys(pokemonEvolutions);
  prevolutionKeys.forEach((pk) => {
    const evolutions = pokemonEvolutions[pk];
    for (const ev of evolutions) {
      if (ev.evoFormKey && megaFormKeys.indexOf(ev.evoFormKey) > -1) {
        continue;
      }
      pokemonPrevolutions[ev.speciesId] = parseInt(pk) as Species;
    }
  });
}
