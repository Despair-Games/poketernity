import { PokeballType } from "#app/enums/pokeball";
import { Species } from "#app/enums/species";
import { TrainerType } from "#enums/trainer-type";
import {
  TrainerConfig,
  getRandomPartyMemberFunc,
  TrainerSlot,
  TrainerPartyCompoundTemplate,
  TrainerPartyTemplate,
  trainerPartyTemplates,
  TrainerConfigs,
} from "../../trainer-config";
import { PartyMemberStrength } from "#app/enums/party-member-strength";

let t = TrainerType.BUCK;
export const mysteryEncounterTrainerConfigs: TrainerConfigs = {
  [TrainerType.BUCK]: new TrainerConfig(t)
    .setName("Buck")
    .initForStatTrainer([], true)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.CLAYDOL], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.VENUSAUR, Species.COALOSSAL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        if (p.species.speciesId === Species.VENUSAUR) {
          p.formIndex = 2; // Gmax
          p.abilityIndex = 2; // Venusaur gets Chlorophyll
        } else {
          p.formIndex = 1; // Gmax
        }
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.AGGRON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      3,
      getRandomPartyMemberFunc([Species.TORKOAL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.abilityIndex = 1; // Drought
      }),
    )
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.GREAT_TUSK], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.HEATRAN], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.CHERYL]: new TrainerConfig(++t)
    .setName("Cheryl")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.BLISSEY], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.SNORLAX, Species.LAPRAS], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.AUDINO], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.GOODRA], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.IRON_HANDS], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.CRESSELIA, Species.ENAMORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        if (p.species.speciesId === Species.ENAMORUS) {
          p.formIndex = 1; // Therian
          p.generateName();
        }
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MARLEY]: new TrainerConfig(++t)
    .setName("Marley")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ARCANINE], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 3);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.ULTRA_BALL;
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.CINDERACE, Species.INTELEON], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      2,
      getRandomPartyMemberFunc([Species.AERODACTYL], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.formIndex = 1; // Mega
        p.generateName();
      }),
    )
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.DRAGAPULT], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.IRON_BUNDLE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.REGIELEKI], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.MIRA]: new TrainerConfig(++t)
    .setName("Mira")
    .initForStatTrainer([], false)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.ALAKAZAM], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1;
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.GENGAR, Species.HATTERENE], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = p.species.speciesId === Species.GENGAR ? 2 : 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.FLUTTER_MANE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.HYDREIGON], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.MAGNEZONE], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.LATIOS, Species.LATIAS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.RILEY]: new TrainerConfig(++t)
    .setName("Riley")
    .initForStatTrainer([], true)
    .setPartyMemberFunc(
      0,
      getRandomPartyMemberFunc([Species.LUCARIO], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        p.formIndex = 1;
        p.pokeball = PokeballType.ULTRA_BALL;
        p.generateName();
      }),
    )
    .setPartyMemberFunc(
      1,
      getRandomPartyMemberFunc([Species.RILLABOOM, Species.CENTISKORCH], TrainerSlot.TRAINER, true, (p) => {
        p.generateAndPopulateMoveset();
        p.pokeball = PokeballType.GREAT_BALL;
        p.formIndex = 1; // Gmax
        p.generateName();
      }),
    )
    .setPartyMemberFunc(2, getRandomPartyMemberFunc([Species.TYRANITAR], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(3, getRandomPartyMemberFunc([Species.ROARING_MOON], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(4, getRandomPartyMemberFunc([Species.URSALUNA], TrainerSlot.TRAINER, true))
    .setPartyMemberFunc(
      5,
      getRandomPartyMemberFunc([Species.REGIGIGAS, Species.LANDORUS], TrainerSlot.TRAINER, true, (p) => {
        p.setBoss(true, 2);
        p.generateAndPopulateMoveset();
        if (p.species.speciesId === Species.LANDORUS) {
          p.formIndex = 1; // Therian
          p.generateName();
        }
        p.pokeball = PokeballType.MASTER_BALL;
      }),
    ),
  [TrainerType.VICTOR]: new TrainerConfig(++t)
    .setTitle("The Winstrates")
    .setLocalizedName("Victor")
    .setMoneyMultiplier(1) // The Winstrate trainers have total money multiplier of 6
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG_ONE_STRONG),
  [TrainerType.VICTORIA]: new TrainerConfig(++t)
    .setTitle("The Winstrates")
    .setLocalizedName("Victoria")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG_ONE_STRONG),
  [TrainerType.VIVI]: new TrainerConfig(++t)
    .setTitle("The Winstrates")
    .setLocalizedName("Vivi")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.TWO_AVG_ONE_STRONG),
  [TrainerType.VICKY]: new TrainerConfig(++t)
    .setTitle("The Winstrates")
    .setLocalizedName("Vicky")
    .setMoneyMultiplier(1)
    .setPartyTemplates(trainerPartyTemplates.ONE_AVG),
  [TrainerType.VITO]: new TrainerConfig(++t)
    .setTitle("The Winstrates")
    .setLocalizedName("Vito")
    .setMoneyMultiplier(2)
    .setPartyTemplates(
      new TrainerPartyCompoundTemplate(
        new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
        new TrainerPartyTemplate(2, PartyMemberStrength.STRONG),
      ),
    ),
  [TrainerType.BUG_TYPE_SUPERFAN]: new TrainerConfig(++t)
    .setMoneyMultiplier(2.25)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setPartyTemplates(new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE)),
  [TrainerType.EXPERT_POKEMON_BREEDER]: new TrainerConfig(++t)
    .setMoneyMultiplier(3)
    .setEncounterBgm(TrainerType.ACE_TRAINER)
    .setLocalizedName("Expert Pokemon Breeder")
    .setPartyTemplates(new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE)),
  [TrainerType.FUTURE_SELF_M]: new TrainerConfig(++t)
    .setMoneyMultiplier(0)
    .setEncounterBgm("mystery_encounter_weird_dream")
    .setBattleBgm("mystery_encounter_weird_dream")
    .setMixedBattleBgm("mystery_encounter_weird_dream")
    .setVictoryBgm("mystery_encounter_weird_dream")
    .setLocalizedName("Future Self M")
    .setPartyTemplates(new TrainerPartyTemplate(6, PartyMemberStrength.STRONG)),
  [TrainerType.FUTURE_SELF_F]: new TrainerConfig(++t)
    .setMoneyMultiplier(0)
    .setEncounterBgm("mystery_encounter_weird_dream")
    .setBattleBgm("mystery_encounter_weird_dream")
    .setMixedBattleBgm("mystery_encounter_weird_dream")
    .setVictoryBgm("mystery_encounter_weird_dream")
    .setLocalizedName("Future Self F")
    .setPartyTemplates(new TrainerPartyTemplate(6, PartyMemberStrength.STRONG)),
};
