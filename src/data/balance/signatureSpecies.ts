import { Species } from "#enums/species";

type SignatureSpecies = {
  [key in string]: (Species | Species[])[];
};

/*
 * The signature species for each Gym Leader, Elite Four member, and Champion.
 * The key is the trainer type, and the value is an array of Species or Species arrays.
 * This is in a separate const so it can be accessed from other places and not just the trainerConfigs
 *
 * When these are loaded into trainer-config it's loaded in backwards so the first pokemon in the list
 * are loaded into the last slots of the trainer which are usually the strongest slots
 */
export const signatureSpecies: SignatureSpecies = {
  // Kanto gym leaders
  BROCK: [Species.ONIX, Species.GEODUDE, [Species.OMANYTE, Species.KABUTO], Species.AERODACTYL],
  MISTY: [Species.STARYU, Species.PSYDUCK, Species.WOOPER, [Species.MAGIKARP, Species.FEEBAS]],
  LT_SURGE: [Species.PICHU, Species.ELEKID, Species.VOLTORB],
  ERIKA: [Species.ODDISH, Species.BELLSPROUT, Species.TANGELA, Species.HOPPIP],
  JANINE: [Species.VENONAT, Species.SPINARAK, Species.ZUBAT, Species.KOFFING],
  SABRINA: [Species.ABRA, Species.MIME_JR, Species.SMOOCHUM, Species.ESPEON],
  BLAINE: [Species.GROWLITHE, Species.PONYTA, Species.MAGBY, Species.SLUGMA],
  GIOVANNI: [Species.RHYHORN, Species.DIGLETT, [Species.NIDORAN_M, Species.NIDORAN_F], Species.SANDILE],

  // Johto gym leaders
  FALKNER: [Species.PIDGEY, Species.HOOTHOOT, Species.NATU, Species.MURKROW],
  BUGSY: [Species.SCYTHER, [Species.CATERPIE, Species.WEEDLE], Species.HERACROSS, Species.SHUCKLE],
  WHITNEY: [Species.MILTANK, Species.CLEFFA, Species.GIRAFARIG, Species.TEDDIURSA],
  MORTY: [Species.GASTLY, Species.MISDREAVUS, Species.SABLEYE],
  CHUCK: [Species.POLIWAG, Species.MANKEY, Species.HITMONTOP],
  JASMINE: [Species.STEELIX, Species.MAGNEMITE, Species.SKARMORY],
  PRYCE: [Species.SWINUB, Species.SEEL, Species.SNEASEL],
  CLAIR: [Species.HORSEA, Species.DRATINI, Species.MAGIKARP],

  // Hoenn gym leaders
  ROXANNE: [Species.NOSEPASS, Species.GEODUDE, [Species.LILEEP, Species.ANORITH], Species.RELICANTH],
  BRAWLY: [Species.MAKUHITA, Species.MACHOP, Species.MEDITITE],
  WATTSON: [Species.ELECTRIKE, Species.MAGNEMITE, Species.VOLTORB, [Species.PLUSLE, Species.MINUN]],
  FLANNERY: [Species.TORKOAL, Species.NUMEL, Species.SLUGMA],
  NORMAN: [Species.SLAKOTH, Species.SPINDA, Species.ZIGZAGOON, Species.KECLEON],
  WINONA: [Species.SWABLU, Species.WINGULL, Species.TAILLOW, Species.TROPIUS],
  TATE: [Species.SOLROCK, Species.NATU, Species.SPOINK, Species.GALLADE],
  LIZA: [Species.LUNATONE, Species.BALTOY, Species.CHINGLING, Species.GARDEVOIR],
  JUAN: [Species.HORSEA, Species.CORPHISH, Species.SPHEAL, Species.BARBOACH],

  // Sinnoh gym leaders
  ROARK: [Species.CRANIDOS, Species.LARVITAR, Species.BONSLY],
  GARDENIA: [Species.BUDEW, Species.TURTWIG, Species.CHERUBI],
  MAYLENE: [Species.RIOLU, Species.MEDITITE, Species.CHIMCHAR],
  CRASHER_WAKE: [Species.BUIZEL, Species.WOOPER, Species.MAGIKARP, Species.LOTAD],
  FANTINA: [Species.MISDREAVUS, Species.DRIFLOON, Species.SPIRITOMB],
  BYRON: [Species.SHIELDON, Species.BRONZOR, Species.ARON],
  CANDICE: [Species.SNOVER, Species.FROSLASS, Species.SNEASEL, Species.GLACEON],
  VOLKNER: [Species.SHINX, Species.CHINCHOU, Species.ROTOM, Species.ELEKID],

  // Unova gym leaders
  CILAN: [Species.PANSAGE, Species.FERROSEED, Species.MARACTUS],
  CHILI: [Species.PANSEAR, Species.DARUMAKA, Species.HEATMOR],
  CRESS: [Species.PANPOUR, Species.SLOWKING, Species.BASCULIN],
  CHEREN: [Species.LILLIPUP, Species.PIDOVE, Species.MINCCINO],
  LENORA: [Species.PATRAT, Species.DEERLING, Species.RUFFLET],
  ROXIE: [Species.VENIPEDE, Species.KOFFING, Species.TRUBBISH],
  BURGH: [Species.SEWADDLE, Species.DWEBBLE, Species.KARRABLAST, Species.SHELMET],
  ELESA: [Species.BLITZLE, Species.EMOLGA, Species.JOLTIK],
  CLAY: [Species.DRILBUR, Species.SANDILE, Species.TYMPOLE],
  SKYLA: [Species.DUCKLETT, Species.WOOBAT, Species.SIGILYPH],
  BRYCEN: [Species.CUBCHOO, Species.CRYOGONAL, Species.VANILLITE],
  DRAYDEN: [Species.AXEW, Species.DRUDDIGON, Species.DEINO],
  MARLON: [Species.FRILLISH, Species.TIRTOUGA, Species.WAILMER, Species.MANTYKE],

  // Kalos gym leaders
  VIOLA: [Species.SCATTERBUG, Species.SURSKIT, Species.DEWPIDER],
  GRANT: [Species.AMAURA, Species.TYRUNT, Species.BINACLE, Species.CARBINK],
  KORRINA: [Species.HAWLUCHA, Species.RIOLU, Species.PANCHAM, Species.MIENFOO],
  RAMOS: [Species.SKIDDO, Species.HOPPIP, Species.BELLSPROUT, [Species.PHANTUMP, Species.PUMPKABOO]],
  CLEMONT: [Species.HELIOPTILE, Species.MAGNEMITE, Species.EMOLGA, Species.DEDENNE],
  VALERIE: [Species.SYLVEON, Species.MAWILE, Species.MIME_JR, [Species.SPRITZEE, Species.SWIRLIX]],
  OLYMPIA: [Species.ESPURR, Species.SIGILYPH, Species.SLOWKING],
  WULFRIC: [Species.BERGMITE, Species.CRYOGONAL, Species.SNOVER],

  // Galar gym leaders
  MILO: [Species.GOSSIFLEUR, Species.APPLIN, Species.BOUNSWEET],
  NESSA: [Species.CHEWTLE, Species.ARROKUDA, Species.WIMPOD],
  KABU: [Species.SIZZLIPEDE, Species.VULPIX, Species.TORKOAL],
  BEA: [Species.GALAR_FARFETCHD, Species.MACHOP, Species.CLOBBOPUS],
  ALLISTER: [Species.GALAR_YAMASK, Species.GALAR_CORSOLA, Species.GASTLY],
  OPAL: [Species.MILCERY, Species.TOGETIC, Species.GALAR_WEEZING],
  BEDE: [Species.HATENNA, Species.GALAR_PONYTA, Species.GARDEVOIR],
  GORDIE: [Species.ROLYCOLY, Species.STONJOURNER, Species.BINACLE],
  MELONY: [Species.SNOM, Species.GALAR_DARUMAKA, Species.GALAR_MR_MIME],
  PIERS: [Species.GALAR_ZIGZAGOON, Species.SCRAGGY, Species.INKAY],
  MARNIE: [Species.IMPIDIMP, Species.PURRLOIN, Species.MORPEKO],
  RAIHAN: [Species.DURALUDON, Species.TURTONATOR, Species.GOOMY],

  // Paldea gym leaders
  KATY: [Species.TEDDIURSA, Species.NYMBLE, Species.TAROUNTULA, Species.HERACROSS],
  BRASSIUS: [Species.BONSLY, Species.SMOLIV, [Species.PETILIL, Species.ODDISH], Species.SUNKERN],
  IONO: [Species.MISDREAVUS, Species.TADBULB, Species.WATTREL, [Species.SHINX, Species.VOLTORB]],
  KOFU: [Species.CRABRAWLER, Species.VELUZA, Species.WIGLETT, Species.WINGULL, [Species.TOTODILE, Species.CLAUNCHER]],
  LARRY: [Species.STARLY, Species.DUNSPARCE, Species.KOMALA, Species.LECHONK],
  RYME: [Species.TOXEL, Species.GREAVARD, Species.SHUPPET, Species.MIMIKYU],
  TULIP: [Species.FLABEBE, Species.FLITTLE, Species.GIRAFARIG, Species.RALTS],
  GRUSHA: [Species.SWABLU, Species.CETODDLE, Species.SNOM, Species.ALOLA_VULPIX],

  // Kanto E4
  LORELEI: [
    Species.LAPRAS,
    Species.JYNX,
    [Species.SLOWBRO, Species.GALAR_SLOWBRO],
    [Species.ALOLA_SANDSLASH, Species.CLOYSTER],
  ],
  BRUNO: [Species.MACHAMP, Species.HITMONCHAN, Species.HITMONLEE, [Species.ALOLA_GOLEM, Species.GOLEM]],
  AGATHA: [Species.GENGAR, [Species.ARBOK, Species.WEEZING], Species.CROBAT, Species.ALOLA_MAROWAK],
  LANCE: [Species.DRAGONITE, Species.GYARADOS, Species.AERODACTYL, Species.ALOLA_EXEGGUTOR],

  // Johto E4
  WILL: [Species.XATU, Species.JYNX, [Species.SLOWBRO, Species.SLOWKING], Species.EXEGGUTOR],
  KOGA: [Species.CROBAT, [Species.WEEZING, Species.MUK], [Species.VENOMOTH, Species.ARIADOS], Species.TENTACRUEL],
  KAREN: [Species.UMBREON, Species.HONCHKROW, Species.HOUNDOOM, Species.WEAVILE],

  // Hoenn E4
  SIDNEY: [
    Species.ABSOL,
    [Species.SHIFTRY, Species.CACTURNE],
    [Species.SHARPEDO, Species.CRAWDAUNT],
    Species.MIGHTYENA,
  ],
  PHOEBE: [Species.SABLEYE, Species.DUSKNOIR, Species.BANETTE, [Species.MISMAGIUS, Species.DRIFBLIM]],
  GLACIA: [Species.GLALIE, Species.WALREIN, Species.FROSLASS, Species.ABOMASNOW],
  DRAKE: [Species.SALAMENCE, Species.ALTARIA, Species.FLYGON, Species.KINGDRA],

  // Sinnoh E4
  AARON: [Species.DRAPION, [Species.SCIZOR, Species.KLEAVOR], Species.HERACROSS, [Species.VESPIQUEN, Species.YANMEGA]],
  BERTHA: [Species.RHYPERIOR, Species.WHISCASH, Species.HIPPOWDON, Species.GLISCOR],
  FLINT: [
    Species.MAGMORTAR,
    [Species.FLAREON, Species.RAPIDASH],
    [Species.STEELIX, Species.LOPUNNY],
    Species.INFERNAPE,
  ],
  LUCIAN: [Species.GALLADE, Species.MR_MIME, Species.BRONZONG, [Species.ALAKAZAM, Species.ESPEON]],

  // Unova E4
  SHAUNTAL: [Species.CHANDELURE, Species.COFAGRIGUS, Species.GOLURK, Species.JELLICENT],
  MARSHAL: [Species.CONKELDURR, Species.MIENSHAO, Species.THROH, Species.SAWK],
  GRIMSLEY: [Species.KINGAMBIT, Species.LIEPARD, Species.SCRAFTY, Species.KROOKODILE],
  CAITLIN: [Species.GOTHITELLE, Species.MUSHARNA, Species.SIGILYPH, Species.REUNICLUS],

  // Kalos E4
  MALVA: [Species.TALONFLAME, Species.PYROAR, Species.TORKOAL, Species.CHANDELURE],
  SIEBOLD: [Species.BARBARACLE, Species.CLAWITZER, Species.GYARADOS, Species.STARMIE],
  WIKSTROM: [Species.AEGISLASH, Species.KLEFKI, Species.PROBOPASS, Species.SCIZOR],
  DRASNA: [Species.NOIVERN, Species.DRAGALGE, Species.DRUDDIGON, Species.ALTARIA],

  // Alola E4
  HALA: [Species.CRABOMINABLE, Species.HARIYAMA, Species.BEWEAR, [Species.POLIWRATH, Species.ANNIHILAPE]],
  MOLAYNE: [Species.ALOLA_DUGTRIO, Species.KLEFKI, Species.MAGNEZONE, Species.METAGROSS],
  OLIVIA: [Species.LYCANROC, Species.RELICANTH, Species.CARBINK, Species.ALOLA_GOLEM],
  ACEROLA: [Species.PALOSSAND, [Species.BANETTE, Species.DRIFBLIM], Species.MIMIKYU, Species.DHELMISE],
  KAHILI: [Species.TOUCANNON, [Species.BRAVIARY, Species.MANDIBUZZ], Species.HAWLUCHA, Species.ORICORIO],

  // Galar E4
  MARNIE_ELITE: [Species.GRIMMSNARL, Species.MORPEKO, Species.LIEPARD, [Species.TOXICROAK, Species.SCRAFTY]],
  NESSA_ELITE: [Species.DREDNAW, Species.GOLISOPOD, [Species.PELIPPER, Species.QUAGSIRE], Species.TOXAPEX],
  BEA_ELITE: [Species.MACHAMP, Species.HAWLUCHA, [Species.GRAPPLOCT, Species.SIRFETCHD], Species.FALINKS],
  ALLISTER_ELITE: [Species.GENGAR, Species.DUSKNOIR, [Species.POLTEAGEIST, Species.RUNERIGUS], Species.CURSOLA],
  RAIHAN_ELITE: [Species.ARCHALUDON, Species.GOODRA, [Species.TORKOAL, Species.TURTONATOR], Species.FLYGON],

  // Paldea E4
  RIKA: [Species.CLODSIRE, Species.WHISCASH, [Species.DONPHAN, Species.DUGTRIO], Species.CAMERUPT],
  POPPY: [Species.TINKATON, Species.COPPERAJAH, Species.BRONZONG, Species.CORVIKNIGHT],
  LARRY_ELITE: [Species.FLAMIGO, Species.STARAPTOR, Species.ALTARIA, Species.TROPIUS],
  HASSEL: [Species.BAXCALIBUR, Species.NOIVERN, [Species.FLAPPLE, Species.APPLETUN], Species.DRAGALGE],

  // Blueberry Academy E4
  CRISPIN: [Species.BLAZIKEN, Species.TALONFLAME, Species.CAMERUPT, Species.MAGMORTAR],
  AMARYS: [Species.METAGROSS, Species.SKARMORY, Species.EMPOLEON, Species.SCIZOR],
  LACEY: [Species.EXCADRILL, Species.PRIMARINA, [Species.ALCREMIE, Species.GRANBULL], Species.WHIMSICOTT],
  DRAYTON: [Species.ARCHALUDON, Species.DRAGONITE, Species.HAXORUS, Species.SCEPTILE],
};
