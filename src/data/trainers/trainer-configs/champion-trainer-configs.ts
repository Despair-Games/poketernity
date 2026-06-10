import {
  ALOLA_CHAMPION_THEME,
  DEFAULT_CHAMPION_THEME,
  GALAR_CHAMPION_THEME,
  GEETA_CHAMPION_THEME,
  HOENN5_CHAMPION_THEME,
  HOENN6_CHAMPION_THEME,
  IRIS_CHAMPION_THEME,
  JOHTO_CHAMPION_THEME,
  KALOS_CHAMPION_THEME,
  KANTO_CHAMPION_THEME,
  KIERAN_CHAMPION_THEME,
  NEMONA_CHAMPION_THEME,
  SINNOH_CHAMPION_THEME,
} from "#constants/music-constants";
import { ElementalType } from "#enums/elemental-type";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { PokeballType } from "#enums/pokeball-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import { TrainerVariant } from "#enums/trainer-variant";
import type { TrainerConfigMap } from "#trainers/new-trainer-config";
import { getRandomPartyMemberFunc, TrainerConfig, type TrainerConfigs } from "#trainers/trainer-config";
import { levelByStrength, TrainerConfigBuilder } from "#trainers/trainer-config-builder";

export const championTrainerConfigs: TrainerConfigs = {
  [TrainerType.BLUE]: new TrainerConfig(TrainerType.BLUE)
    .initForChampion(TrainerVariant.DEFAULT, [KANTO_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [SpeciesId.EXEGGUTOR, SpeciesId.ARCANINE, SpeciesId.GYARADOS],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.UMBREON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ALAKAZAM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.RHYPERIOR, SpeciesId.MAGNEZONE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.MACHAMP], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // G-Max Machamp
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PIDGEOT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pigeot
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.RED]: new TrainerConfig(TrainerType.RED)
    .initForChampion(TrainerVariant.DEFAULT, [JOHTO_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.PIKACHU], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 8; // G-Max Pikachu
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ESPEON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.LAPRAS]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.AERODACTYL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.SNORLAX], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc(
        [SpeciesId.VENUSAUR, SpeciesId.CHARIZARD, SpeciesId.BLASTOISE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          if (p.species.speciesId === SpeciesId.CHARIZARD) {
            p.formIndex = 2; // Mega Charizard Y
          } else {
            p.formIndex = 1; // Mega Venusaur or Mega Blastoise
          }
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
          p.generateName();
        },
      ),
    ),
  [TrainerType.LANCE_CHAMPION]: new TrainerConfig(TrainerType.LANCE_CHAMPION)
    .setName("Lance")
    .initForChampion(TrainerVariant.DEFAULT, [JOHTO_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GYARADOS]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.SALAMENCE, SpeciesId.GARCHOMP]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.KINGDRA]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Charizard X
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.DRAGONITE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.HO_OH, SpeciesId.LUGIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.STEVEN]: new TrainerConfig(TrainerType.STEVEN)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN5_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.SKARMORY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.AGGRON]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ARMALDO, SpeciesId.CRADILY]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.CLAYDOL]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Metagross
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.DIALGA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.WALLACE]: new TrainerConfig(TrainerType.WALLACE)
    .initForChampion(TrainerVariant.DEFAULT, [HOENN6_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 1; // Drizzle
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([SpeciesId.SWAMPERT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Swampert
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.LUDICOLO]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.WAILORD, SpeciesId.WALREIN]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.MILOTIC], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.PALKIA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CYNTHIA]: new TrainerConfig(TrainerType.CYNTHIA)
    .initForChampion(TrainerVariant.FEMALE, [SINNOH_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.SPIRITOMB]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.TOGEKISS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ROSERADE, SpeciesId.GASTRODON]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.LUCARIO]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Garchomp
        p.generateAndPopulateMoveset();
        p.generateName();
        p.setBoss(true, 2);
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.GIRATINA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.setBoss(true, 2);
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.ALDER]: new TrainerConfig(TrainerType.ALDER)
    .initForChampion(TrainerVariant.DEFAULT, [DEFAULT_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.BOUFFALANT, SpeciesId.BRAVIARY]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.VANILLUXE]))
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([SpeciesId.CONKELDURR, SpeciesId.REUNICLUS, SpeciesId.KROOKODILE, SpeciesId.CHANDELURE]),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.ACCELGOR, SpeciesId.ESCAVALIER]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.VOLCARONA], TrainerSlot.TRAINER, true, (p) => {
        p.teraType = ElementalType.FIRE;
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZEKROM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setInstantTera(4),
  [TrainerType.IRIS]: new TrainerConfig(TrainerType.IRIS)
    .initForChampion(TrainerVariant.FEMALE, [IRIS_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.HYDREIGON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ARCHEOPS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRUDDIGON]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.LAPRAS, SpeciesId.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Lapras or Mega Aggron
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HAXORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.RESHIRAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.DIANTHA]: new TrainerConfig(TrainerType.DIANTHA)
    .initForChampion(TrainerVariant.FEMALE, [KALOS_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GOURGEIST]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.TYRANTRUM, SpeciesId.AURORUS]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.GOODRA]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.HAWLUCHA]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.GARDEVOIR], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 1; // Mega Gardevoir
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.XERNEAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.HAU]: new TrainerConfig(TrainerType.HAU)
    .initForChampion(TrainerVariant.DEFAULT, [ALOLA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.ALOLA_RAICHU]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.NOIVERN]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.CRABOMINABLE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.TAPU_BULU, SpeciesId.TAPU_FINI, SpeciesId.TAPU_KOKO, SpeciesId.TAPU_LELE]),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [SpeciesId.DECIDUEYE, SpeciesId.INCINEROAR, SpeciesId.PRIMARINA],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.teraType = p.species.type1; // Tera Grass/Fire/Water
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.BLACEPHALON, SpeciesId.STAKATAKA], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setInstantTera(4),
  [TrainerType.LEON]: new TrainerConfig(TrainerType.LEON)
    .initForChampion(TrainerVariant.DEFAULT, [GALAR_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.RILLABOOM, SpeciesId.CINDERACE, SpeciesId.INTELEON]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.MR_RIME]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRAGAPULT]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.AEGISLASH]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.formIndex = 3; // G-Max Charizard
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.ZACIAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.GEETA]: new TrainerConfig(TrainerType.GEETA)
    .initForChampion(TrainerVariant.FEMALE, [GEETA_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.GLIMMORA]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.ESPATHRA, SpeciesId.VELUZA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.AVALUGG, SpeciesId.HISUI_AVALUGG]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.GOGOAT, SpeciesId.CHESNAUGHT]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.KINGAMBIT], TrainerSlot.TRAINER, true, (p) => {
        p.teraType = ElementalType.FLYING;
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.MIRAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setInstantTera(4),
  [TrainerType.NEMONA]: new TrainerConfig(TrainerType.NEMONA)
    .initForChampion(TrainerVariant.FEMALE, [NEMONA_CHAMPION_THEME])
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([SpeciesId.LYCANROC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 0; // Midday form
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.PAWMOT]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.ORTHWORM]))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([SpeciesId.DUDUNSPARCE]))
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc(
        [SpeciesId.MEOWSCARADA, SpeciesId.SKELEDIRGE, SpeciesId.QUAQUAVAL],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.teraType = p.species.type1; // Tera Grass/Fire/Water
          p.setBoss(true, 2);
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.KORAIDON], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setInstantTera(4),
  [TrainerType.KIERAN]: new TrainerConfig(TrainerType.KIERAN)
    .initForChampion(TrainerVariant.DEFAULT, [KIERAN_CHAMPION_THEME])
    .setPartyMemberFunc(0, getRandomPartyMemberFunc([SpeciesId.POLIWRATH, SpeciesId.POLITOED]))
    .setPartyMemberFunc(1, getRandomPartyMemberFunc([SpeciesId.PORYGON_Z, SpeciesId.YANMEGA]))
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([SpeciesId.DRAGONITE]))
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([SpeciesId.GRIMMSNARL], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Grimmsnarl
        p.generateName();
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      4,
      getRandomPartyMemberFunc([SpeciesId.HYDRAPPLE], TrainerSlot.TRAINER, true, (p) => {
        p.teraType = ElementalType.FIGHTING;
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([SpeciesId.TERAPAGOS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    )
    .setInstantTera(4),
};

export const newChampionTrainerConfigs: TrainerConfigMap = {
  [TrainerType.BLUE]: new TrainerConfigBuilder(TrainerType.BLUE)
    .withChampionAssets("BLUE", TrainerGender.MALE, KANTO_CHAMPION_THEME)
    .withPokemonFromPool([SpeciesId.EXEGGUTOR, SpeciesId.ARCANINE, SpeciesId.GYARADOS], {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.UMBREON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.ALAKAZAM, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.RHYPERIOR, SpeciesId.MAGNEZONE], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.MACHAMP, {
      formIndex: 2, // G-Max Machamp
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.PIDGEOT, {
      formIndex: 1, // Mega Pidgeot
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.RED]: new TrainerConfigBuilder(TrainerType.RED)
    .withChampionAssets("RED", TrainerGender.MALE, JOHTO_CHAMPION_THEME)
    .withPokemon(SpeciesId.PIKACHU, {
      formIndex: 8, // G-Max Pikachu
      ignoreEvolution: true,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.ESPEON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.LAPRAS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.AERODACTYL, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.SNORLAX, {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.VENUSAUR, SpeciesId.CHARIZARD, SpeciesId.BLASTOISE], {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
      postProcess: (p) => {
        if (p.species.speciesId === SpeciesId.CHARIZARD) {
          p.formIndex = 2; // Mega Charizard Y
        } else {
          p.formIndex = 1; // Mega Venusaur/Blastoise
        }
      },
    })
    .build(),
  [TrainerType.LANCE_CHAMPION]: new TrainerConfigBuilder(TrainerType.LANCE_CHAMPION)
    .withChampionAssets("LANCE", TrainerGender.MALE, JOHTO_CHAMPION_THEME)
    .withPokemon(SpeciesId.GYARADOS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.SALAMENCE, SpeciesId.GARCHOMP], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.KINGDRA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.CHARIZARD, {
      formIndex: 1, // Mega Charizard X
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DRAGONITE, {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.HO_OH, SpeciesId.LUGIA], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.STEVEN]: new TrainerConfigBuilder(TrainerType.STEVEN)
    .withChampionAssets("STEVEN", TrainerGender.MALE, HOENN5_CHAMPION_THEME)
    .withPokemon(SpeciesId.SKARMORY, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.AGGRON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.ARMALDO, SpeciesId.CRADILY], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.CLAYDOL, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.METAGROSS, {
      formIndex: 1, // Mega Metagross
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.DIALGA, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.WALLACE]: new TrainerConfigBuilder(TrainerType.WALLACE)
    .withChampionAssets("WALLACE", TrainerGender.MALE, HOENN6_CHAMPION_THEME)
    .withPokemon(SpeciesId.PELIPPER, {
      abilityIndex: 1, // Drizzle
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.SWAMPERT, {
      formIndex: 1, // Mega Swampert
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.LUDICOLO, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.WAILORD, SpeciesId.WALREIN], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.MILOTIC, {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.PALKIA, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.CYNTHIA]: new TrainerConfigBuilder(TrainerType.CYNTHIA)
    .withChampionAssets("CYNTHIA", TrainerGender.FEMALE, SINNOH_CHAMPION_THEME)
    .withPokemon(SpeciesId.SPIRITOMB, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.TOGEKISS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.ROSERADE, SpeciesId.GASTRODON], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.LUCARIO, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GARCHOMP, {
      formIndex: 1, // Mega Garchomp
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.GIRATINA, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.ALDER]: new TrainerConfigBuilder(TrainerType.ALDER)
    .withChampionAssets("ALDER", TrainerGender.MALE, DEFAULT_CHAMPION_THEME)
    .withPokemonFromPool([SpeciesId.BOUFFALANT, SpeciesId.BRAVIARY], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.VANILLUXE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.CONKELDURR, SpeciesId.REUNICLUS, SpeciesId.KROOKODILE, SpeciesId.CHANDELURE], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.ACCELGOR, SpeciesId.ESCAVALIER], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.VOLCARONA, {
      instantTera: true,
      teraType: ElementalType.FIRE,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.ZEKROM, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.IRIS]: new TrainerConfigBuilder(TrainerType.IRIS)
    .withChampionAssets("IRIS", TrainerGender.FEMALE, IRIS_CHAMPION_THEME)
    .withPokemon(SpeciesId.HYDREIGON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.ARCHEOPS, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DRUDDIGON, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.LAPRAS, SpeciesId.AGGRON], {
      formIndex: 1, // G-Max Lapras or Mega Aggron
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HAXORUS, {
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.RESHIRAM, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.DIANTHA]: new TrainerConfigBuilder(TrainerType.DIANTHA)
    .withChampionAssets("DIANTHA", TrainerGender.FEMALE, KALOS_CHAMPION_THEME)
    .withPokemon(SpeciesId.GOURGEIST, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.TYRANTRUM, SpeciesId.AURORUS], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GOODRA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HAWLUCHA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GARDEVOIR, {
      formIndex: 1, // Mega Gardevoir
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.XERNEAS, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.HAU]: new TrainerConfigBuilder(TrainerType.HAU)
    .withChampionAssets("HAU", TrainerGender.MALE, ALOLA_CHAMPION_THEME)
    .withPokemon(SpeciesId.ALOLA_RAICHU, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.NOIVERN, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.CRABOMINABLE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.TAPU_BULU, SpeciesId.TAPU_FINI, SpeciesId.TAPU_KOKO, SpeciesId.TAPU_LELE], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.DECIDUEYE, SpeciesId.INCINEROAR, SpeciesId.PRIMARINA], {
      instantTera: true,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
      postProcess: (p) => (p.teraType = p.species.type1),
    })
    .withPokemonFromPool([SpeciesId.BLACEPHALON, SpeciesId.STAKATAKA], {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.LEON]: new TrainerConfigBuilder(TrainerType.LEON)
    .withChampionAssets("LEON", TrainerGender.MALE, GALAR_CHAMPION_THEME)
    .withPokemonFromPool([SpeciesId.RILLABOOM, SpeciesId.CINDERACE, SpeciesId.INTELEON], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.MR_RIME, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DRAGAPULT, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.AEGISLASH, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.CHARIZARD, {
      formIndex: 3, // G-Max Charizard
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.ZACIAN, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.GEETA]: new TrainerConfigBuilder(TrainerType.GEETA)
    .withChampionAssets("GEETA", TrainerGender.FEMALE, GEETA_CHAMPION_THEME)
    .withPokemon(SpeciesId.GLIMMORA, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.ESPATHRA, SpeciesId.VELUZA], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.AVALUGG, SpeciesId.HISUI_AVALUGG], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.GOGOAT, SpeciesId.CHESNAUGHT], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.KINGAMBIT, {
      instantTera: true,
      teraType: ElementalType.FLYING,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.MIRAIDON, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.NEMONA]: new TrainerConfigBuilder(TrainerType.NEMONA)
    .withChampionAssets("NEMONA", TrainerGender.FEMALE, NEMONA_CHAMPION_THEME)
    .withPokemon(SpeciesId.LYCANROC, {
      formIndex: 0, // Midday form
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.PAWMOT, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.ORTHWORM, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DUDUNSPARCE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemonFromPool([SpeciesId.MEOWSCARADA, SpeciesId.SKELEDIRGE, SpeciesId.QUAQUAVAL], {
      instantTera: true,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
      postProcess: (p) => (p.teraType = p.species.type1),
    })
    .withPokemon(SpeciesId.KORAIDON, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
  [TrainerType.KIERAN]: new TrainerConfigBuilder(TrainerType.KIERAN)
    .withChampionAssets("KIERAN", TrainerGender.MALE, KIERAN_CHAMPION_THEME)
    .withPokemonFromPool([SpeciesId.POLIWRATH, SpeciesId.POLITOED], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemonFromPool([SpeciesId.PORYGON_Z, SpeciesId.YANMEGA], {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.DRAGONITE, {
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.GRIMMSNARL, {
      formIndex: 2, // G-Max Grimmsnarl
      levelFunc: levelByStrength(PartyMemberStrength.STRONG),
    })
    .withPokemon(SpeciesId.HYDRAPPLE, {
      instantTera: true,
      teraType: ElementalType.FLYING,
      boss: true,
      bossSegments: 2,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .withPokemon(SpeciesId.TERAPAGOS, {
      boss: true,
      bossSegments: 2,
      pokeball: PokeballType.MASTER_BALL,
      levelFunc: levelByStrength(PartyMemberStrength.STRONGER),
    })
    .build(),
};
