import { Species } from "#enums/species";

type SignatureSpecies = {
  [key in string]: (Species | Species[])[];
};

/*
 * The signature species for each Gym Leader, Elite Four member, and Champion.
 * The key is the trainer type, and the value is an array of Species or Species arrays.
 * This is in a separate const so it can be accessed from other places and not just the trainerConfigs
 */
export const signatureSpecies: SignatureSpecies = {
  // Kanto gyms
  BROCK: [Species.GEODUDE, Species.ONIX],
  MISTY: [Species.STARYU, Species.PSYDUCK],
  LT_SURGE: [Species.VOLTORB, Species.PIKACHU, Species.ELECTABUZZ],
  ERIKA: [Species.ODDISH, Species.BELLSPROUT, Species.TANGELA, Species.HOPPIP],
  JANINE: [Species.VENONAT, Species.SPINARAK, Species.ZUBAT],
  SABRINA: [Species.ABRA, Species.MR_MIME, Species.ESPEON],
  BLAINE: [Species.GROWLITHE, Species.PONYTA, Species.MAGMAR],
  GIOVANNI: [Species.SANDILE, Species.MURKROW, Species.NIDORAN_M, Species.NIDORAN_F],

  //Johto gyms
  FALKNER: [Species.PIDGEY, Species.HOOTHOOT, Species.DODUO],
  BUGSY: [Species.SCYTHER, Species.HERACROSS, Species.SHUCKLE, Species.PINSIR],
  WHITNEY: [Species.GIRAFARIG, Species.MILTANK],
  MORTY: [Species.GASTLY, Species.MISDREAVUS, Species.SABLEYE],
  CHUCK: [Species.POLIWRATH, Species.MANKEY],
  JASMINE: [Species.MAGNEMITE, Species.STEELIX],
  PRYCE: [Species.SEEL, Species.SWINUB],
  CLAIR: [Species.DRATINI, Species.HORSEA, Species.GYARADOS],

  // Hoenn gyms
  ROXANNE: [Species.GEODUDE, Species.NOSEPASS],
  BRAWLY: [Species.MACHOP, Species.MAKUHITA],
  WATTSON: [Species.MAGNEMITE, Species.VOLTORB, Species.ELECTRIKE],
  FLANNERY: [Species.SLUGMA, Species.TORKOAL, Species.NUMEL],
  NORMAN: [Species.SLAKOTH, Species.SPINDA, Species.CHANSEY, Species.KANGASKHAN],
  WINONA: [Species.SWABLU, Species.WINGULL, Species.TROPIUS, Species.SKARMORY],
  TATE: [Species.SOLROCK, Species.NATU, Species.CHIMECHO, Species.GALLADE],
  LIZA: [Species.LUNATONE, Species.SPOINK, Species.BALTOY, Species.GARDEVOIR],
  JUAN: [Species.HORSEA, Species.BARBOACH, Species.SPHEAL, Species.RELICANTH],

  // Sinnoh gyms
  ROARK: [Species.CRANIDOS, Species.LARVITAR, Species.GEODUDE],
  GARDENIA: [Species.ROSELIA, Species.TANGELA, Species.TURTWIG],
  MAYLENE: [Species.LUCARIO, Species.MEDITITE, Species.CHIMCHAR],
  CRASHER_WAKE: [Species.BUIZEL, Species.MAGIKARP, Species.PIPLUP],
  FANTINA: [Species.MISDREAVUS, Species.DRIFLOON, Species.SPIRITOMB],
  BYRON: [Species.SHIELDON, Species.BRONZOR, Species.AGGRON],
  CANDICE: [Species.SNEASEL, Species.SNOVER, Species.SNORUNT],
  VOLKNER: [Species.SHINX, Species.CHINCHOU, Species.ROTOM],

  // Unova gyms
  CILAN: [Species.PANSAGE, Species.COTTONEE, Species.PETILIL],
  CHILI: [Species.PANSEAR, Species.DARUMAKA, Species.HEATMOR],
  CRESS: [Species.PANPOUR, Species.BASCULIN, Species.TYMPOLE],
  CHEREN: [Species.LILLIPUP, Species.MINCCINO, Species.PATRAT],
  LENORA: [Species.KANGASKHAN, Species.DEERLING, Species.AUDINO],
  ROXIE: [Species.VENIPEDE, Species.TRUBBISH, Species.SKORUPI],
  BURGH: [Species.SEWADDLE, Species.SHELMET, Species.KARRABLAST],
  ELESA: [Species.EMOLGA, Species.BLITZLE, Species.JOLTIK],
  CLAY: [Species.DRILBUR, Species.SANDILE, Species.GOLETT],
  SKYLA: [Species.DUCKLETT, Species.WOOBAT, Species.RUFFLET],
  BRYCEN: [Species.CRYOGONAL, Species.VANILLITE, Species.CUBCHOO],
  DRAYDEN: [Species.DRUDDIGON, Species.AXEW, Species.DEINO],
  MARLON: [Species.WAILMER, Species.FRILLISH, Species.TIRTOUGA],

  // Kalos gyms
  VIOLA: [Species.SURSKIT, Species.SCATTERBUG],
  GRANT: [Species.AMAURA, Species.TYRUNT],
  KORRINA: [Species.HAWLUCHA, Species.LUCARIO, Species.MIENFOO],
  RAMOS: [Species.SKIDDO, Species.HOPPIP, Species.BELLSPROUT],
  CLEMONT: [Species.HELIOPTILE, Species.MAGNEMITE, Species.EMOLGA],
  VALERIE: [Species.SYLVEON, Species.MAWILE, Species.MR_MIME],
  OLYMPIA: [Species.ESPURR, Species.SIGILYPH, Species.SLOWKING],
  WULFRIC: [Species.BERGMITE, Species.SNOVER, Species.CRYOGONAL],

  // Galar gyms
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

  // Paldea gyms
  KATY: [Species.NYMBLE, Species.TAROUNTULA, Species.HERACROSS],
  BRASSIUS: [Species.SMOLIV, Species.SHROOMISH, Species.ODDISH],
  IONO: [Species.TADBULB, Species.WATTREL, Species.VOLTORB],
  KOFU: [Species.VELUZA, Species.WIGLETT, Species.WINGULL],
  LARRY: [Species.STARLY, Species.DUNSPARCE, Species.KOMALA],
  RYME: [Species.GREAVARD, Species.SHUPPET, Species.MIMIKYU],
  TULIP: [Species.GIRAFARIG, Species.FLITTLE, Species.RALTS],
  GRUSHA: [Species.CETODDLE, Species.ALOLA_VULPIX, Species.CUBCHOO],

  // Kanto E4
  LORELEI: [
    Species.JYNX,
    [Species.SLOWBRO, Species.GALAR_SLOWBRO],
    Species.LAPRAS,
    [Species.ALOLA_SANDSLASH, Species.CLOYSTER],
  ],
  BRUNO: [Species.MACHAMP, Species.HITMONCHAN, Species.HITMONLEE, [Species.ALOLA_GOLEM, Species.GOLEM]],
  AGATHA: [Species.GENGAR, [Species.ARBOK, Species.WEEZING], Species.CROBAT, Species.ALOLA_MAROWAK],
  LANCE: [Species.DRAGONITE, Species.GYARADOS, Species.AERODACTYL, Species.ALOLA_EXEGGUTOR],

  // Johto E4
  WILL: [Species.XATU, Species.JYNX, [Species.SLOWBRO, Species.SLOWKING], Species.EXEGGUTOR],
  KOGA: [[Species.WEEZING, Species.MUK], [Species.VENOMOTH, Species.ARIADOS], Species.CROBAT, Species.TENTACRUEL],
  KAREN: [Species.UMBREON, Species.HONCHKROW, Species.HOUNDOOM, Species.WEAVILE],

  // Hoenn E4
  SIDNEY: [
    [Species.SHIFTRY, Species.CACTURNE],
    [Species.SHARPEDO, Species.CRAWDAUNT],
    Species.ABSOL,
    Species.MIGHTYENA,
  ],
  PHOEBE: [Species.SABLEYE, Species.DUSKNOIR, Species.BANETTE, [Species.MISMAGIUS, Species.DRIFBLIM]],
  GLACIA: [Species.GLALIE, Species.WALREIN, Species.FROSLASS, Species.ABOMASNOW],
  DRAKE: [Species.ALTARIA, Species.SALAMENCE, Species.FLYGON, Species.KINGDRA],

  // Sinnoh E4
  AARON: [[Species.SCIZOR, Species.KLEAVOR], Species.HERACROSS, [Species.VESPIQUEN, Species.YANMEGA], Species.DRAPION],
  BERTHA: [Species.WHISCASH, Species.HIPPOWDON, Species.GLISCOR, Species.RHYPERIOR],
  FLINT: [
    [Species.FLAREON, Species.RAPIDASH],
    Species.MAGMORTAR,
    [Species.STEELIX, Species.LOPUNNY],
    Species.INFERNAPE,
  ],
  LUCIAN: [Species.MR_MIME, Species.GALLADE, Species.BRONZONG, [Species.ALAKAZAM, Species.ESPEON]],

  // Unova E4
  SHAUNTAL: [Species.COFAGRIGUS, Species.CHANDELURE, Species.GOLURK, Species.JELLICENT],
  MARSHAL: [Species.CONKELDURR, Species.MIENSHAO, Species.THROH, Species.SAWK],
  GRIMSLEY: [Species.LIEPARD, Species.KINGAMBIT, Species.SCRAFTY, Species.KROOKODILE],
  CAITLIN: [Species.MUSHARNA, Species.GOTHITELLE, Species.SIGILYPH, Species.REUNICLUS],

  // Kalos E4
  MALVA: [Species.PYROAR, Species.TORKOAL, Species.CHANDELURE, Species.TALONFLAME],
  SIEBOLD: [Species.CLAWITZER, Species.GYARADOS, Species.BARBARACLE, Species.STARMIE],
  WIKSTROM: [Species.KLEFKI, Species.PROBOPASS, Species.SCIZOR, Species.AEGISLASH],
  DRASNA: [Species.DRAGALGE, Species.DRUDDIGON, Species.ALTARIA, Species.NOIVERN],

  // Alola E4
  HALA: [Species.HARIYAMA, Species.BEWEAR, Species.CRABOMINABLE, [Species.POLIWRATH, Species.ANNIHILAPE]],
  MOLAYNE: [Species.KLEFKI, Species.MAGNEZONE, Species.METAGROSS, Species.ALOLA_DUGTRIO],
  OLIVIA: [Species.RELICANTH, Species.CARBINK, Species.ALOLA_GOLEM, Species.LYCANROC],
  ACEROLA: [[Species.BANETTE, Species.DRIFBLIM], Species.MIMIKYU, Species.DHELMISE, Species.PALOSSAND],
  KAHILI: [[Species.BRAVIARY, Species.MANDIBUZZ], Species.HAWLUCHA, Species.ORICORIO, Species.TOUCANNON],

  // Galar E4
  MARNIE_ELITE: [Species.MORPEKO, Species.LIEPARD, [Species.TOXICROAK, Species.SCRAFTY], Species.GRIMMSNARL],
  NESSA_ELITE: [Species.GOLISOPOD, [Species.PELIPPER, Species.QUAGSIRE], Species.TOXAPEX, Species.DREDNAW],
  BEA_ELITE: [Species.HAWLUCHA, [Species.GRAPPLOCT, Species.SIRFETCHD], Species.FALINKS, Species.MACHAMP],
  ALLISTER_ELITE: [Species.DUSKNOIR, [Species.POLTEAGEIST, Species.RUNERIGUS], Species.CURSOLA, Species.GENGAR],
  RAIHAN_ELITE: [Species.GOODRA, [Species.TORKOAL, Species.TURTONATOR], Species.FLYGON, Species.ARCHALUDON],

  // Paldea E4
  RIKA: [Species.WHISCASH, [Species.DONPHAN, Species.DUGTRIO], Species.CAMERUPT, Species.CLODSIRE],
  POPPY: [Species.COPPERAJAH, Species.BRONZONG, Species.CORVIKNIGHT, Species.TINKATON],
  LARRY_ELITE: [Species.STARAPTOR, Species.FLAMIGO, Species.ALTARIA, Species.TROPIUS],
  HASSEL: [Species.NOIVERN, [Species.FLAPPLE, Species.APPLETUN], Species.DRAGALGE, Species.BAXCALIBUR],

  // Blueberry Academy E4
  CRISPIN: [Species.TALONFLAME, Species.CAMERUPT, Species.MAGMORTAR, Species.BLAZIKEN],
  AMARYS: [Species.SKARMORY, Species.EMPOLEON, Species.SCIZOR, Species.METAGROSS],
  LACEY: [Species.EXCADRILL, Species.PRIMARINA, [Species.ALCREMIE, Species.GRANBULL], Species.WHIMSICOTT],
  DRAYTON: [Species.DRAGONITE, Species.ARCHALUDON, Species.HAXORUS, Species.SCEPTILE],

  // Champions
  BLUE: [
    [Species.GYARADOS, Species.EXEGGUTOR, Species.ARCANINE],
    Species.HO_OH,
    [Species.RHYPERIOR, Species.MAGNEZONE],
  ], // Alakazam lead, Mega Pidgeot
  RED: [Species.LUGIA, Species.SNORLAX, [Species.ESPEON, Species.UMBREON, Species.SYLVEON]], // GMax Pikachu lead, Mega gen 1 starter
  LANCE_CHAMPION: [Species.DRAGONITE, Species.KINGDRA, Species.ALOLA_EXEGGUTOR], // Aerodactyl lead, Mega Latias/Latios
  STEVEN: [Species.AGGRON, [Species.ARMALDO, Species.CRADILY], Species.DIALGA], // Skarmory lead, Mega Metagross
  WALLACE: [Species.MILOTIC, Species.PALKIA, Species.LUDICOLO], // Pelipper lead, Mega Swampert
  CYNTHIA: [Species.GIRATINA, Species.LUCARIO, Species.TOGEKISS], // Spiritomb lead, Mega Garchomp
  ALDER: [Species.VOLCARONA, Species.ZEKROM, [Species.ACCELGOR, Species.ESCAVALIER], Species.KELDEO], // Bouffalant/Braviary lead
  IRIS: [Species.HAXORUS, Species.RESHIRAM, Species.ARCHEOPS], // Druddigon lead, Gmax Lapras
  DIANTHA: [Species.HAWLUCHA, Species.XERNEAS, Species.GOODRA], // Gourgeist lead, Mega Gardevoir
  HAU: [
    [Species.SOLGALEO, Species.LUNALA],
    Species.NOIVERN,
    [Species.DECIDUEYE, Species.INCINEROAR, Species.PRIMARINA],
    [Species.TAPU_BULU, Species.TAPU_FINI, Species.TAPU_KOKO, Species.TAPU_LELE],
  ], // Alola Raichu lead
  LEON: [Species.DRAGAPULT, Species.ZACIAN, Species.AEGISLASH], // Rillaboom/Cinderace/Inteleon lead, GMax Charizard
  GEETA: [
    Species.MIRAIDON,
    [Species.ESPATHRA, Species.VELUZA],
    [Species.AVALUGG, Species.HISUI_AVALUGG],
    Species.KINGAMBIT,
  ], // Glimmora lead
  NEMONA: [
    Species.KORAIDON,
    Species.PAWMOT,
    [Species.DUDUNSPARCE, Species.ORTHWORM],
    [Species.MEOWSCARADA, Species.SKELEDIRGE, Species.QUAQUAVAL],
  ], // Lycanroc lead
  KIERAN: [
    [Species.GRIMMSNARL, Species.INCINEROAR, Species.PORYGON_Z],
    Species.OGERPON,
    Species.TERAPAGOS,
    Species.HYDRAPPLE,
  ], // Poliwrath/Politoed lead
};
