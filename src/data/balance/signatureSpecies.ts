import { SpeciesId } from "#enums/species-id";

type SignatureSpecies = {
  [key in string]: (SpeciesId | SpeciesId[])[];
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
  BROCK: [SpeciesId.ONIX, SpeciesId.GEODUDE, [SpeciesId.OMANYTE, SpeciesId.KABUTO], SpeciesId.AERODACTYL],
  MISTY: [SpeciesId.STARYU, SpeciesId.PSYDUCK, SpeciesId.WOOPER, [SpeciesId.MAGIKARP, SpeciesId.FEEBAS]],
  LT_SURGE: [SpeciesId.PICHU, SpeciesId.ELEKID, SpeciesId.VOLTORB],
  ERIKA: [SpeciesId.ODDISH, SpeciesId.BELLSPROUT, SpeciesId.TANGELA, SpeciesId.HOPPIP],
  JANINE: [SpeciesId.VENONAT, SpeciesId.SPINARAK, SpeciesId.ZUBAT, SpeciesId.KOFFING],
  SABRINA: [SpeciesId.ABRA, SpeciesId.MIME_JR, SpeciesId.SMOOCHUM, SpeciesId.ESPEON],
  BLAINE: [SpeciesId.GROWLITHE, SpeciesId.PONYTA, SpeciesId.MAGBY, SpeciesId.SLUGMA],
  GIOVANNI: [SpeciesId.RHYHORN, SpeciesId.DIGLETT, [SpeciesId.NIDORAN_M, SpeciesId.NIDORAN_F], SpeciesId.SANDILE],

  // Johto gym leaders
  FALKNER: [SpeciesId.PIDGEY, SpeciesId.HOOTHOOT, SpeciesId.NATU, SpeciesId.MURKROW],
  BUGSY: [SpeciesId.SCYTHER, [SpeciesId.CATERPIE, SpeciesId.WEEDLE], SpeciesId.HERACROSS, SpeciesId.SHUCKLE],
  WHITNEY: [SpeciesId.MILTANK, SpeciesId.CLEFFA, SpeciesId.GIRAFARIG, SpeciesId.TEDDIURSA],
  MORTY: [SpeciesId.GASTLY, SpeciesId.MISDREAVUS, SpeciesId.SABLEYE],
  CHUCK: [SpeciesId.POLIWAG, SpeciesId.MANKEY, SpeciesId.HITMONTOP],
  JASMINE: [SpeciesId.STEELIX, SpeciesId.MAGNEMITE, SpeciesId.SKARMORY],
  PRYCE: [SpeciesId.SWINUB, SpeciesId.SEEL, SpeciesId.SNEASEL],
  CLAIR: [SpeciesId.HORSEA, SpeciesId.DRATINI, SpeciesId.MAGIKARP],

  // Hoenn gym leaders
  ROXANNE: [SpeciesId.NOSEPASS, SpeciesId.GEODUDE, [SpeciesId.LILEEP, SpeciesId.ANORITH], SpeciesId.RELICANTH],
  BRAWLY: [SpeciesId.MAKUHITA, SpeciesId.MACHOP, SpeciesId.MEDITITE],
  WATTSON: [SpeciesId.ELECTRIKE, SpeciesId.MAGNEMITE, SpeciesId.VOLTORB, [SpeciesId.PLUSLE, SpeciesId.MINUN]],
  FLANNERY: [SpeciesId.TORKOAL, SpeciesId.NUMEL, SpeciesId.SLUGMA],
  NORMAN: [SpeciesId.SLAKOTH, SpeciesId.SPINDA, SpeciesId.ZIGZAGOON, SpeciesId.KECLEON],
  WINONA: [SpeciesId.SWABLU, SpeciesId.WINGULL, SpeciesId.TAILLOW, SpeciesId.TROPIUS],
  TATE: [SpeciesId.SOLROCK, SpeciesId.NATU, SpeciesId.SPOINK, SpeciesId.GALLADE],
  LIZA: [SpeciesId.LUNATONE, SpeciesId.BALTOY, SpeciesId.CHINGLING, SpeciesId.GARDEVOIR],
  JUAN: [SpeciesId.HORSEA, SpeciesId.CORPHISH, SpeciesId.SPHEAL, SpeciesId.BARBOACH],

  // Sinnoh gym leaders
  ROARK: [SpeciesId.CRANIDOS, SpeciesId.LARVITAR, SpeciesId.BONSLY],
  GARDENIA: [SpeciesId.BUDEW, SpeciesId.TURTWIG, SpeciesId.CHERUBI],
  MAYLENE: [SpeciesId.RIOLU, SpeciesId.MEDITITE, SpeciesId.CHIMCHAR],
  CRASHER_WAKE: [SpeciesId.BUIZEL, SpeciesId.WOOPER, SpeciesId.MAGIKARP, SpeciesId.LOTAD],
  FANTINA: [SpeciesId.MISDREAVUS, SpeciesId.DRIFLOON, SpeciesId.SPIRITOMB],
  BYRON: [SpeciesId.SHIELDON, SpeciesId.BRONZOR, SpeciesId.ARON],
  CANDICE: [SpeciesId.SNOVER, SpeciesId.FROSLASS, SpeciesId.SNEASEL, SpeciesId.GLACEON],
  VOLKNER: [SpeciesId.SHINX, SpeciesId.CHINCHOU, SpeciesId.ROTOM, SpeciesId.ELEKID],

  // Unova gym leaders
  CILAN: [SpeciesId.PANSAGE, SpeciesId.FERROSEED, SpeciesId.MARACTUS],
  CHILI: [SpeciesId.PANSEAR, SpeciesId.DARUMAKA, SpeciesId.HEATMOR],
  CRESS: [SpeciesId.PANPOUR, SpeciesId.SLOWKING, SpeciesId.BASCULIN],
  CHEREN: [SpeciesId.LILLIPUP, SpeciesId.PIDOVE, SpeciesId.MINCCINO],
  LENORA: [SpeciesId.PATRAT, SpeciesId.DEERLING, SpeciesId.RUFFLET],
  ROXIE: [SpeciesId.VENIPEDE, SpeciesId.KOFFING, SpeciesId.TRUBBISH],
  BURGH: [SpeciesId.SEWADDLE, SpeciesId.DWEBBLE, SpeciesId.KARRABLAST, SpeciesId.SHELMET],
  ELESA: [SpeciesId.BLITZLE, SpeciesId.EMOLGA, SpeciesId.JOLTIK],
  CLAY: [SpeciesId.DRILBUR, SpeciesId.SANDILE, SpeciesId.TYMPOLE],
  SKYLA: [SpeciesId.DUCKLETT, SpeciesId.WOOBAT, SpeciesId.SIGILYPH],
  BRYCEN: [SpeciesId.CUBCHOO, SpeciesId.CRYOGONAL, SpeciesId.VANILLITE],
  DRAYDEN: [SpeciesId.AXEW, SpeciesId.DRUDDIGON, SpeciesId.DEINO],
  MARLON: [SpeciesId.FRILLISH, SpeciesId.TIRTOUGA, SpeciesId.WAILMER, SpeciesId.MANTYKE],

  // Kalos gym leaders
  VIOLA: [SpeciesId.SCATTERBUG, SpeciesId.SURSKIT, SpeciesId.DEWPIDER],
  GRANT: [SpeciesId.AMAURA, SpeciesId.TYRUNT, SpeciesId.BINACLE, SpeciesId.CARBINK],
  KORRINA: [SpeciesId.HAWLUCHA, SpeciesId.RIOLU, SpeciesId.PANCHAM, SpeciesId.MIENFOO],
  RAMOS: [SpeciesId.SKIDDO, SpeciesId.HOPPIP, SpeciesId.BELLSPROUT, [SpeciesId.PHANTUMP, SpeciesId.PUMPKABOO]],
  CLEMONT: [SpeciesId.HELIOPTILE, SpeciesId.MAGNEMITE, SpeciesId.EMOLGA, SpeciesId.DEDENNE],
  VALERIE: [SpeciesId.SYLVEON, SpeciesId.MAWILE, SpeciesId.MIME_JR, [SpeciesId.SPRITZEE, SpeciesId.SWIRLIX]],
  OLYMPIA: [SpeciesId.ESPURR, SpeciesId.SIGILYPH, SpeciesId.SLOWKING],
  WULFRIC: [SpeciesId.BERGMITE, SpeciesId.CRYOGONAL, SpeciesId.SNOVER],

  // Galar gym leaders
  MILO: [SpeciesId.GOSSIFLEUR, SpeciesId.APPLIN, SpeciesId.BOUNSWEET],
  NESSA: [SpeciesId.CHEWTLE, SpeciesId.ARROKUDA, SpeciesId.WIMPOD],
  KABU: [SpeciesId.SIZZLIPEDE, SpeciesId.VULPIX, SpeciesId.TORKOAL],
  BEA: [SpeciesId.GALAR_FARFETCHD, SpeciesId.MACHOP, SpeciesId.CLOBBOPUS],
  ALLISTER: [SpeciesId.GALAR_YAMASK, SpeciesId.GALAR_CORSOLA, SpeciesId.GASTLY],
  OPAL: [SpeciesId.MILCERY, SpeciesId.TOGETIC, SpeciesId.GALAR_WEEZING],
  BEDE: [SpeciesId.HATENNA, SpeciesId.GALAR_PONYTA, SpeciesId.GARDEVOIR],
  GORDIE: [SpeciesId.ROLYCOLY, SpeciesId.STONJOURNER, SpeciesId.BINACLE],
  MELONY: [SpeciesId.SNOM, SpeciesId.GALAR_DARUMAKA, SpeciesId.GALAR_MR_MIME],
  PIERS: [SpeciesId.GALAR_ZIGZAGOON, SpeciesId.SCRAGGY, SpeciesId.INKAY],
  MARNIE: [SpeciesId.IMPIDIMP, SpeciesId.PURRLOIN, SpeciesId.MORPEKO],
  RAIHAN: [SpeciesId.DURALUDON, SpeciesId.TURTONATOR, SpeciesId.GOOMY],

  // Paldea gym leaders
  KATY: [SpeciesId.TEDDIURSA, SpeciesId.NYMBLE, SpeciesId.TAROUNTULA, SpeciesId.HERACROSS],
  BRASSIUS: [SpeciesId.BONSLY, SpeciesId.SMOLIV, [SpeciesId.PETILIL, SpeciesId.ODDISH], SpeciesId.SUNKERN],
  IONO: [SpeciesId.MISDREAVUS, SpeciesId.TADBULB, SpeciesId.WATTREL, [SpeciesId.SHINX, SpeciesId.VOLTORB]],
  KOFU: [
    SpeciesId.CRABRAWLER,
    SpeciesId.VELUZA,
    SpeciesId.WIGLETT,
    SpeciesId.WINGULL,
    [SpeciesId.TOTODILE, SpeciesId.CLAUNCHER],
  ],
  LARRY: [SpeciesId.STARLY, SpeciesId.DUNSPARCE, SpeciesId.KOMALA, SpeciesId.LECHONK],
  RYME: [SpeciesId.TOXEL, SpeciesId.GREAVARD, SpeciesId.SHUPPET, SpeciesId.MIMIKYU],
  TULIP: [SpeciesId.FLABEBE, SpeciesId.FLITTLE, SpeciesId.GIRAFARIG, SpeciesId.RALTS],
  GRUSHA: [SpeciesId.SWABLU, SpeciesId.CETODDLE, SpeciesId.SNOM, SpeciesId.ALOLA_VULPIX],

  // Kanto E4
  LORELEI: [
    SpeciesId.LAPRAS,
    SpeciesId.JYNX,
    [SpeciesId.SLOWBRO, SpeciesId.GALAR_SLOWBRO],
    [SpeciesId.ALOLA_SANDSLASH, SpeciesId.CLOYSTER],
  ],
  BRUNO: [SpeciesId.MACHAMP, SpeciesId.HITMONCHAN, SpeciesId.HITMONLEE, [SpeciesId.ALOLA_GOLEM, SpeciesId.GOLEM]],
  AGATHA: [SpeciesId.GENGAR, [SpeciesId.ARBOK, SpeciesId.WEEZING], SpeciesId.CROBAT, SpeciesId.ALOLA_MAROWAK],
  LANCE: [SpeciesId.DRAGONITE, SpeciesId.GYARADOS, SpeciesId.AERODACTYL, SpeciesId.ALOLA_EXEGGUTOR],

  // Johto E4
  WILL: [SpeciesId.XATU, SpeciesId.JYNX, [SpeciesId.SLOWBRO, SpeciesId.SLOWKING], SpeciesId.EXEGGUTOR],
  KOGA: [
    SpeciesId.CROBAT,
    [SpeciesId.WEEZING, SpeciesId.MUK],
    [SpeciesId.VENOMOTH, SpeciesId.ARIADOS],
    SpeciesId.TENTACRUEL,
  ],
  KAREN: [SpeciesId.UMBREON, SpeciesId.HONCHKROW, SpeciesId.HOUNDOOM, SpeciesId.WEAVILE],

  // Hoenn E4
  SIDNEY: [
    SpeciesId.ABSOL,
    [SpeciesId.SHIFTRY, SpeciesId.CACTURNE],
    [SpeciesId.SHARPEDO, SpeciesId.CRAWDAUNT],
    SpeciesId.MIGHTYENA,
  ],
  PHOEBE: [SpeciesId.SABLEYE, SpeciesId.DUSKNOIR, SpeciesId.BANETTE, [SpeciesId.MISMAGIUS, SpeciesId.DRIFBLIM]],
  GLACIA: [SpeciesId.GLALIE, SpeciesId.WALREIN, SpeciesId.FROSLASS, SpeciesId.ABOMASNOW],
  DRAKE: [SpeciesId.SALAMENCE, SpeciesId.ALTARIA, SpeciesId.FLYGON, SpeciesId.KINGDRA],

  // Sinnoh E4
  AARON: [
    SpeciesId.DRAPION,
    [SpeciesId.SCIZOR, SpeciesId.KLEAVOR],
    SpeciesId.HERACROSS,
    [SpeciesId.VESPIQUEN, SpeciesId.YANMEGA],
  ],
  BERTHA: [SpeciesId.RHYPERIOR, SpeciesId.WHISCASH, SpeciesId.HIPPOWDON, SpeciesId.GLISCOR],
  FLINT: [
    SpeciesId.MAGMORTAR,
    [SpeciesId.FLAREON, SpeciesId.RAPIDASH],
    [SpeciesId.STEELIX, SpeciesId.LOPUNNY],
    SpeciesId.INFERNAPE,
  ],
  LUCIAN: [SpeciesId.GALLADE, SpeciesId.MR_MIME, SpeciesId.BRONZONG, [SpeciesId.ALAKAZAM, SpeciesId.ESPEON]],

  // Unova E4
  SHAUNTAL: [SpeciesId.CHANDELURE, SpeciesId.COFAGRIGUS, SpeciesId.GOLURK, SpeciesId.JELLICENT],
  MARSHAL: [SpeciesId.CONKELDURR, SpeciesId.MIENSHAO, SpeciesId.THROH, SpeciesId.SAWK],
  GRIMSLEY: [SpeciesId.KINGAMBIT, SpeciesId.LIEPARD, SpeciesId.SCRAFTY, SpeciesId.KROOKODILE],
  CAITLIN: [SpeciesId.GOTHITELLE, SpeciesId.MUSHARNA, SpeciesId.SIGILYPH, SpeciesId.REUNICLUS],

  // Kalos E4
  MALVA: [SpeciesId.TALONFLAME, SpeciesId.PYROAR, SpeciesId.TORKOAL, SpeciesId.CHANDELURE],
  SIEBOLD: [SpeciesId.BARBARACLE, SpeciesId.CLAWITZER, SpeciesId.GYARADOS, SpeciesId.STARMIE],
  WIKSTROM: [SpeciesId.AEGISLASH, SpeciesId.KLEFKI, SpeciesId.PROBOPASS, SpeciesId.SCIZOR],
  DRASNA: [SpeciesId.NOIVERN, SpeciesId.DRAGALGE, SpeciesId.DRUDDIGON, SpeciesId.ALTARIA],

  // Alola E4
  HALA: [SpeciesId.CRABOMINABLE, SpeciesId.HARIYAMA, SpeciesId.BEWEAR, [SpeciesId.POLIWRATH, SpeciesId.ANNIHILAPE]],
  MOLAYNE: [SpeciesId.ALOLA_DUGTRIO, SpeciesId.KLEFKI, SpeciesId.MAGNEZONE, SpeciesId.METAGROSS],
  OLIVIA: [SpeciesId.LYCANROC, SpeciesId.RELICANTH, SpeciesId.CARBINK, SpeciesId.ALOLA_GOLEM],
  ACEROLA: [SpeciesId.PALOSSAND, [SpeciesId.BANETTE, SpeciesId.DRIFBLIM], SpeciesId.MIMIKYU, SpeciesId.DHELMISE],
  KAHILI: [SpeciesId.TOUCANNON, [SpeciesId.BRAVIARY, SpeciesId.MANDIBUZZ], SpeciesId.HAWLUCHA, SpeciesId.ORICORIO],

  // Galar E4
  MARNIE_ELITE: [SpeciesId.GRIMMSNARL, SpeciesId.MORPEKO, SpeciesId.LIEPARD, [SpeciesId.TOXICROAK, SpeciesId.SCRAFTY]],
  NESSA_ELITE: [SpeciesId.DREDNAW, SpeciesId.GOLISOPOD, [SpeciesId.PELIPPER, SpeciesId.QUAGSIRE], SpeciesId.TOXAPEX],
  BEA_ELITE: [SpeciesId.MACHAMP, SpeciesId.HAWLUCHA, [SpeciesId.GRAPPLOCT, SpeciesId.SIRFETCHD], SpeciesId.FALINKS],
  ALLISTER_ELITE: [
    SpeciesId.GENGAR,
    SpeciesId.DUSKNOIR,
    [SpeciesId.POLTEAGEIST, SpeciesId.RUNERIGUS],
    SpeciesId.CURSOLA,
  ],
  RAIHAN_ELITE: [SpeciesId.ARCHALUDON, SpeciesId.GOODRA, [SpeciesId.TORKOAL, SpeciesId.TURTONATOR], SpeciesId.FLYGON],

  // Paldea E4
  RIKA: [SpeciesId.CLODSIRE, SpeciesId.WHISCASH, [SpeciesId.DONPHAN, SpeciesId.DUGTRIO], SpeciesId.CAMERUPT],
  POPPY: [SpeciesId.TINKATON, SpeciesId.COPPERAJAH, SpeciesId.BRONZONG, SpeciesId.CORVIKNIGHT],
  LARRY_ELITE: [SpeciesId.FLAMIGO, SpeciesId.STARAPTOR, SpeciesId.ALTARIA, SpeciesId.TROPIUS],
  HASSEL: [SpeciesId.BAXCALIBUR, SpeciesId.NOIVERN, [SpeciesId.FLAPPLE, SpeciesId.APPLETUN], SpeciesId.DRAGALGE],

  // Blueberry Academy E4
  CRISPIN: [SpeciesId.BLAZIKEN, SpeciesId.TALONFLAME, SpeciesId.CAMERUPT, SpeciesId.MAGMORTAR],
  AMARYS: [SpeciesId.METAGROSS, SpeciesId.SKARMORY, SpeciesId.EMPOLEON, SpeciesId.SCIZOR],
  LACEY: [SpeciesId.EXCADRILL, SpeciesId.PRIMARINA, [SpeciesId.ALCREMIE, SpeciesId.GRANBULL], SpeciesId.WHIMSICOTT],
  DRAYTON: [SpeciesId.ARCHALUDON, SpeciesId.DRAGONITE, SpeciesId.HAXORUS, SpeciesId.SCEPTILE],
};
