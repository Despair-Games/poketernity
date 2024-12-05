import { Species } from "#app/enums/species";
import { TrainerType } from "#enums/trainer-type";
import { TrainerConfig, getRandomPartyMemberFunc, TrainerSlot, TrainerConfigs } from "../../trainer-config";
import { signatureSpecies } from "./signature-species";

let t = TrainerType.BLUE;
export const championTrainerConfigs: TrainerConfigs = {
  [TrainerType.BLUE]: new TrainerConfig(t)
    .initForChampion(signatureSpecies["BLUE"], true)
    .setBattleBgm("battle_kanto_champion")
    .setMixedBattleBgm("battle_kanto_champion")
    .setHasDouble("blue_red_double")
    .setDoubleTrainerType(TrainerType.RED)
    .setDoubleTitle("champion_double")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ALAKAZAM], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.PIDGEOT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Pidgeot
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.RED]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["RED"], true)
    .setBattleBgm("battle_johto_champion")
    .setMixedBattleBgm("battle_johto_champion")
    .setHasDouble("red_blue_double")
    .setDoubleTrainerType(TrainerType.BLUE)
    .setDoubleTitle("champion_double")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PIKACHU], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 8; // G-Max Pikachu
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc(
        [Species.VENUSAUR, Species.CHARIZARD, Species.BLASTOISE],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.formIndex = 1; // Mega Venusaur, Mega Charizard X, or Mega Blastoise
          p.generateAndPopulateMoveset();
          p.generateName();
        },
      ),
    ),
  [TrainerType.LANCE_CHAMPION]: new TrainerConfig(++t)
    .setName("Lance")
    .initForChampion(signatureSpecies["LANCE_CHAMPION"], true)
    .setBattleBgm("battle_johto_champion")
    .setMixedBattleBgm("battle_johto_champion")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.AERODACTYL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.LATIAS, Species.LATIOS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Latias or Mega Latios
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.STEVEN]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["STEVEN"], true)
    .setBattleBgm("battle_hoenn_champion_g5")
    .setMixedBattleBgm("battle_hoenn_champion_g6")
    .setHasDouble("steven_wallace_double")
    .setDoubleTrainerType(TrainerType.WALLACE)
    .setDoubleTitle("champion_double")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SKARMORY], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.METAGROSS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Metagross
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.WALLACE]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["WALLACE"], true)
    .setBattleBgm("battle_hoenn_champion_g5")
    .setMixedBattleBgm("battle_hoenn_champion_g6")
    .setHasDouble("wallace_steven_double")
    .setDoubleTrainerType(TrainerType.STEVEN)
    .setDoubleTitle("champion_double")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.PELIPPER], TrainerSlot.TRAINER, true, (p) => {
        p.abilityIndex = 1; // Drizzle
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.SWAMPERT], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Swampert
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.CYNTHIA]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["CYNTHIA"], false)
    .setBattleBgm("battle_sinnoh_champion")
    .setMixedBattleBgm("battle_sinnoh_champion")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.SPIRITOMB], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.GARCHOMP], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Garchomp
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.ALDER]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["ALDER"], true)
    .setHasDouble("alder_iris_double")
    .setDoubleTrainerType(TrainerType.IRIS)
    .setDoubleTitle("champion_double")
    .setBattleBgm("battle_champion_alder")
    .setMixedBattleBgm("battle_champion_alder")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.BOUFFALANT, Species.BRAVIARY], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    ),
  [TrainerType.IRIS]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["IRIS"], false)
    .setBattleBgm("battle_champion_iris")
    .setMixedBattleBgm("battle_champion_iris")
    .setHasDouble("iris_alder_double")
    .setDoubleTrainerType(TrainerType.ALDER)
    .setDoubleTitle("champion_double")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.DRUDDIGON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.LAPRAS], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // G-Max Lapras
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.DIANTHA]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["DIANTHA"], false)
    .setMixedBattleBgm("battle_kalos_champion")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GOURGEIST], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.GARDEVOIR], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 1; // Mega Gardevoir
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.HAU]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["HAU"], true)
    .setMixedBattleBgm("battle_alola_champion")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ALOLA_RAICHU], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    ),
  [TrainerType.LEON]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["LEON"], true)
    .setMixedBattleBgm("battle_galar_champion")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc(
        [Species.RILLABOOM, Species.CINDERACE, Species.INTELEON],
        TrainerSlot.TRAINER,
        true,
        (p) => {
          p.generateAndPopulateMoveset();
        },
      ),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.CHARIZARD], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 3; // G-Max Charizard
        p.generateAndPopulateMoveset();
        p.generateName();
      }),
    ),
  [TrainerType.GEETA]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["GEETA"], false)
    .setMixedBattleBgm("battle_champion_geeta")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.GLIMMORA], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    ),
  [TrainerType.NEMONA]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["NEMONA"], false)
    .setMixedBattleBgm("battle_champion_nemona")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.LYCANROC], TrainerSlot.TRAINER, true, (p) => {
        p.formIndex = 0; // Midday form
        p.generateAndPopulateMoveset();
      }),
    ),
  [TrainerType.KIERAN]: new TrainerConfig(++t)
    .initForChampion(signatureSpecies["KIERAN"], true)
    .setMixedBattleBgm("battle_champion_kieran")
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.POLIWRATH, Species.POLITOED], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
      }),
    ),
};
