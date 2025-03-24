import { getVariantTint } from "#app/data/variant";
import type BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { globalScene } from "#app/global-scene";
import { getGenderSymbol, getGenderTextStyle } from "#app/data/gender";
import { Gender } from "#enums/gender";
import { getNatureName } from "../../data/nature";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "../../field/pokemon";
import i18next from "i18next";
import { DexAttr } from "#app/data/dex-attributes";
import type { DexEntry } from "#app/@types/DexData";
import type { StarterDataEntry } from "#app/@types/StarterData";
import { capitalizeString, fixedNumber } from "#app/utils";
import { IVGraph } from "./iv-graph";
import { addBBCodeTextObject, addTextObject, setTextColor } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import { addWindow } from "../ui-theme";
import { SpeciesId } from "#enums/species-id";
import { DEFAULT_LANGUAGE_KEY } from "#app/system/settings/supported-languages";

interface LanguageSetting {
  infoContainerTextSize: string;
  infoContainerLabelXPos?: number;
  infoContainerTextXPos?: number;
}

const languageSettings: { [key: string]: LanguageSetting } = {
  pt: {
    infoContainerTextSize: "60px",
    infoContainerLabelXPos: -15,
    infoContainerTextXPos: -12,
  },
};

export class PokemonInfoContainer extends Phaser.GameObjects.Container {
  private readonly infoWindowWidth = 104;

  private pokemonFormLabelText: Phaser.GameObjects.Text;
  private pokemonFormText: Phaser.GameObjects.Text;
  private pokemonGenderText: Phaser.GameObjects.Text;
  private pokemonGenderNewText: Phaser.GameObjects.Text;
  private pokemonAbilityLabelText: Phaser.GameObjects.Text;
  private pokemonAbilityText: Phaser.GameObjects.Text;
  private pokemonNatureLabelText: Phaser.GameObjects.Text;
  private pokemonNatureText: BBCodeText;
  private pokemonShinyIcon: Phaser.GameObjects.Image;
  private pokemonShinyNewIcon: Phaser.GameObjects.Text;
  private pokemonMovesContainer: Phaser.GameObjects.Container;
  private pokemonMovesContainers: Phaser.GameObjects.Container[];
  private pokemonMoveBgs: Phaser.GameObjects.NineSlice[];
  private pokemonMoveLabels: Phaser.GameObjects.Text[];
  private infoBg;

  private numCharsBeforeCutoff = 16;

  private initialX: number;
  private movesContainerInitialX: number;

  protected defaultTextStyle: TextStyle;

  public statsContainer: IVGraph;

  public shown: boolean;

  constructor(x: number = 372, y: number = 66, defaultTextStyle: TextStyle = TextStyle.CATCH_PANEL_LABEL) {
    super(globalScene, x, y);
    this.initialX = x;
    this.defaultTextStyle = defaultTextStyle;
  }

  setup(): void {
    this.setName("pkmn-info");
    const currentLanguage = i18next.resolvedLanguage ?? DEFAULT_LANGUAGE_KEY;
    const langSettingKey = Object.keys(languageSettings).find((lang) => currentLanguage?.includes(lang))!; // TODO: is this bang correct?
    const textSettings = languageSettings[langSettingKey];
    this.infoBg = addWindow(0, 0, this.infoWindowWidth, 132);
    this.infoBg.setOrigin(0.5, 0.5);
    this.infoBg.setName("window-info-bg");

    this.pokemonMovesContainer = globalScene.add.container(6, 14);
    this.pokemonMovesContainer.setName("pkmn-moves");

    this.movesContainerInitialX = this.pokemonMovesContainer.x;

    this.pokemonMovesContainers = [];
    this.pokemonMoveBgs = [];
    this.pokemonMoveLabels = [];

    const movesBg = addWindow(0, 0, 58, 52);
    movesBg.setOrigin(1, 0);
    movesBg.setName("window-moves-bg");
    this.pokemonMovesContainer.add(movesBg);

    const movesLabel = addTextObject(
      -movesBg.width / 2,
      6,
      i18next.t("pokemonInfoContainer:moveset"),
      TextStyle.CATCH_PANEL_HEADER,
    );
    movesLabel.setOrigin(0.5, 0);
    movesLabel.setName("text-moves");
    this.pokemonMovesContainer.add(movesLabel);

    for (let m = 0; m < 4; m++) {
      const moveContainer = globalScene.add.container(-6, 18 + 7 * m);
      moveContainer.setScale(0.5);
      moveContainer.setName("move");

      const moveBg = globalScene.add.nineslice(0, 0, "type_bgs", "unknown", 92, 14, 2, 2, 2, 2);
      moveBg.setOrigin(1, 0);
      moveBg.setName("nineslice-move-bg");

      const moveLabel = addTextObject(-moveBg.width / 2, 0, "-", TextStyle.PARTY);
      moveLabel.setOrigin(0.5, 0);
      moveLabel.setName("text-move-label");

      this.pokemonMoveBgs.push(moveBg);
      this.pokemonMoveLabels.push(moveLabel);

      moveContainer.add(moveBg);
      moveContainer.add(moveLabel);

      this.pokemonMovesContainers.push(moveContainer);
      this.pokemonMovesContainer.add(moveContainer);
    }

    this.add(this.pokemonMovesContainer);

    this.statsContainer = new IVGraph(-48, -64, true, this.defaultTextStyle);

    this.add(this.infoBg);
    this.add(this.statsContainer);

    // The position should be set per language
    const infoContainerLabelXPos = textSettings?.infoContainerLabelXPos || -18;
    const infoContainerTextXPos = textSettings?.infoContainerTextXPos || -14;

    this.pokemonFormLabelText = addTextObject(
      infoContainerLabelXPos,
      19,
      i18next.t("pokemonInfoContainer:form"),
      this.defaultTextStyle,
    );
    this.pokemonFormLabelText.setOrigin(1, 0);
    this.pokemonFormLabelText.setVisible(false);
    this.add(this.pokemonFormLabelText);

    this.pokemonFormText = addTextObject(infoContainerTextXPos, 19, "", this.defaultTextStyle);
    this.pokemonFormText.setOrigin(0, 0);
    this.pokemonFormText.setVisible(false);
    this.add(this.pokemonFormText);

    this.pokemonGenderText = addTextObject(-42, -61, "", this.defaultTextStyle);
    this.pokemonGenderText.setOrigin(0, 0);
    this.pokemonGenderText.setVisible(false);
    this.pokemonGenderText.setName("text-pkmn-gender");
    this.add(this.pokemonGenderText);

    this.pokemonGenderNewText = addTextObject(-36, -61, "", this.defaultTextStyle);
    this.pokemonGenderNewText.setOrigin(0, 0);
    this.pokemonGenderNewText.setVisible(false);
    this.pokemonGenderNewText.setName("text-pkmn-new-gender");
    this.add(this.pokemonGenderNewText);

    this.pokemonAbilityLabelText = addTextObject(
      infoContainerLabelXPos,
      29,
      i18next.t("pokemonInfoContainer:ability"),
      this.defaultTextStyle,
    );
    this.pokemonAbilityLabelText.setOrigin(1, 0);
    this.pokemonAbilityLabelText.setName("text-pkmn-ability-label");
    this.add(this.pokemonAbilityLabelText);

    this.pokemonAbilityText = addTextObject(infoContainerTextXPos, 29, "", this.defaultTextStyle);
    this.pokemonAbilityText.setOrigin(0, 0);
    this.pokemonAbilityText.setName("text-pkmn-ability");
    this.add(this.pokemonAbilityText);

    this.pokemonNatureLabelText = addTextObject(
      infoContainerLabelXPos,
      39,
      i18next.t("pokemonInfoContainer:nature"),
      this.defaultTextStyle,
    );
    this.pokemonNatureLabelText.setOrigin(1, 0);
    this.pokemonNatureLabelText.setName("text-pkmn-nature-label");
    this.add(this.pokemonNatureLabelText);

    this.pokemonNatureText = addBBCodeTextObject(infoContainerTextXPos, 39, "", this.defaultTextStyle, {
      lineSpacing: 3,
      maxLines: 2,
    });
    this.pokemonNatureText.setOrigin(0, 0);
    this.pokemonNatureText.setName("text-pkmn-nature");
    this.add(this.pokemonNatureText);

    this.pokemonShinyIcon = globalScene.add.image(-43.5, 48.5, "shiny_star");
    this.pokemonShinyIcon.setOrigin(0, 0);
    this.pokemonShinyIcon.setScale(0.75);
    this.pokemonShinyIcon.setInteractive(new Phaser.Geom.Rectangle(0, 0, 12, 15), Phaser.Geom.Rectangle.Contains);
    this.pokemonShinyIcon.setName("img-pkmn-shiny-icon");
    this.add(this.pokemonShinyIcon);

    this.pokemonShinyNewIcon = addTextObject(
      this.pokemonShinyIcon.x + 12,
      this.pokemonShinyIcon.y,
      "",
      this.defaultTextStyle,
    );
    this.pokemonShinyNewIcon.setOrigin(0, 0);
    this.pokemonShinyNewIcon.setName("text-pkmn-shiny-new-icon");
    this.add(this.pokemonShinyNewIcon);
    this.pokemonShinyNewIcon.setVisible(false);

    this.setVisible(false);
  }

  show(
    pokemon: Pokemon,
    showMoves: boolean = false,
    speedMultiplier: number = 1,
    dexEntry?: DexEntry,
    starterEntry?: StarterDataEntry,
    eggInfo = false,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!dexEntry) {
        dexEntry = globalScene.gameData.dexData[pokemon.species.speciesId];
      }
      if (!starterEntry) {
        starterEntry = globalScene.gameData.starterData[pokemon.species.getRootSpeciesId()];
      }

      const caughtAttr = BigInt(dexEntry.caughtAttr);
      if (pokemon.gender > Gender.GENDERLESS) {
        this.pokemonGenderText.setText(getGenderSymbol(pokemon.gender));
        this.pokemonGenderText.setVisible(true);
        setTextColor(this.pokemonGenderText, getGenderTextStyle(pokemon.gender));

        const newGender = BigInt(1 << pokemon.gender) * DexAttr.MALE;
        this.pokemonGenderNewText.setText("(+)");
        this.pokemonGenderNewText.setVisible((newGender & caughtAttr) === BigInt(0));
        setTextColor(this.pokemonGenderNewText, TextStyle.SUMMARY_BLUE);
      } else {
        this.pokemonGenderNewText.setVisible(false);
        this.pokemonGenderText.setVisible(false);
      }

      const formKey = pokemon.species?.forms?.[pokemon.formIndex!]?.formKey;
      const formText = capitalizeString(formKey, "-", false, false) || "";
      const speciesName = capitalizeString(SpeciesId[pokemon.species.speciesId], "_", true, false);

      let formName = "";
      if (pokemon.species.speciesId === SpeciesId.ARCEUS) {
        formName = i18next.t(`pokemonInfo:Type.${formText?.toUpperCase()}`);
      } else {
        const i18key = `pokemonForm:${speciesName}${formText}`;
        if (i18next.exists(i18key)) {
          formName = i18next.t(i18key);
        } else {
          const rootSpeciesName = capitalizeString(SpeciesId[pokemon.species.getRootSpeciesId()], "_", true, false);
          const i18RootKey = `pokemonForm:${rootSpeciesName}${formText}`;
          formName = i18next.exists(i18RootKey) ? i18next.t(i18RootKey) : formText;
        }
      }

      if (formName) {
        this.pokemonFormLabelText.setVisible(true);
        this.pokemonFormText.setVisible(true);
        const newForm = BigInt(1 << pokemon.getSelectableFormIndex()) * DexAttr.DEFAULT_FORM;

        if ((newForm & caughtAttr) === BigInt(0)) {
          setTextColor(this.pokemonFormLabelText, TextStyle.SUMMARY_BLUE);
        } else {
          setTextColor(this.pokemonFormLabelText, this.defaultTextStyle);
        }

        this.pokemonFormText.setText(
          formName.length > this.numCharsBeforeCutoff
            ? formName.substring(0, this.numCharsBeforeCutoff - 3) + "..."
            : formName,
        );
        if (formName.length > this.numCharsBeforeCutoff) {
          this.pokemonFormText.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.pokemonFormText.width, this.pokemonFormText.height),
            Phaser.Geom.Rectangle.Contains,
          );
          this.pokemonFormText.on("pointerover", () => globalScene.ui.showTooltip("", formName, true));
          this.pokemonFormText.on("pointerout", () => globalScene.ui.hideTooltip());
        } else {
          this.pokemonFormText.disableInteractive();
        }
      } else {
        this.pokemonFormLabelText.setVisible(false);
        this.pokemonFormText.setVisible(false);
        this.pokemonFormText.disableInteractive();
      }

      const abilityTextStyle = pokemon.abilityIndex === 2 ? TextStyle.MONEY : this.defaultTextStyle;
      this.pokemonAbilityText.setText(pokemon.getAbility(true).name);
      setTextColor(this.pokemonAbilityText, abilityTextStyle);

      // Check if the player owns ability for the root form
      const playerOwnsThisAbility = pokemon.checkIfPlayerHasAbilityOfStarter(starterEntry.abilityAttr);
      if (!playerOwnsThisAbility) {
        setTextColor(this.pokemonAbilityLabelText, TextStyle.SUMMARY_BLUE);
      } else {
        setTextColor(this.pokemonAbilityLabelText, this.defaultTextStyle);
      }

      this.pokemonNatureText.setText(getNatureName(pokemon.getNature(), true, false, false, this.defaultTextStyle));
      const dexNatures = dexEntry.natureAttr;
      const newNature = 1 << (pokemon.nature + 1);
      if (!(dexNatures & newNature)) {
        setTextColor(this.pokemonNatureLabelText, TextStyle.SUMMARY_BLUE);
      } else {
        setTextColor(this.pokemonNatureLabelText, this.defaultTextStyle);
      }

      const baseVariant = pokemon.getVariant();

      this.pokemonShinyIcon.setTexture(`shiny_star`);
      this.pokemonShinyIcon.setVisible(pokemon.isShiny());
      this.pokemonShinyIcon.setTint(getVariantTint(baseVariant));
      if (this.pokemonShinyIcon.visible) {
        const shinyDescriptor = baseVariant
          ? `${baseVariant === 2 ? i18next.t("common:epicShiny") : baseVariant === 1 ? i18next.t("common:rareShiny") : i18next.t("common:commonShiny")}`
          : "";
        this.pokemonShinyIcon.on("pointerover", () =>
          globalScene.ui.showTooltip(
            "",
            `${i18next.t("common:shinyOnHover")}${shinyDescriptor ? ` (${shinyDescriptor})` : ""}`,
            true,
          ),
        );
        this.pokemonShinyIcon.on("pointerout", () => globalScene.ui.hideTooltip());

        const newShiny = BigInt(1 << (pokemon.shiny ? 1 : 0));
        const newVariant = BigInt(1 << (pokemon.variant + 4));

        this.pokemonShinyNewIcon.setText("(+)");
        setTextColor(this.pokemonShinyNewIcon, TextStyle.SUMMARY_BLUE);
        const newShinyOrVariant = (newShiny & caughtAttr) === BigInt(0) || (newVariant & caughtAttr) === BigInt(0);
        this.pokemonShinyNewIcon.setVisible(!!newShinyOrVariant);
      } else if ((caughtAttr & DexAttr.NON_SHINY) === BigInt(0) && (caughtAttr & DexAttr.SHINY) === DexAttr.SHINY) {
        //If the player has *only* caught any shiny variant of this species, not a non-shiny
        this.pokemonShinyNewIcon.setVisible(true);
        this.pokemonShinyNewIcon.setText("(+)");
        setTextColor(this.pokemonShinyNewIcon, TextStyle.SUMMARY_BLUE);
      } else {
        this.pokemonShinyNewIcon.setVisible(false);
      }

      const starterSpeciesId = pokemon.species.getRootSpeciesId();
      const originalIvs: number[] | null = eggInfo
        ? dexEntry.caughtAttr
          ? dexEntry.ivs
          : null
        : globalScene.gameData.dexData[starterSpeciesId].caughtAttr
          ? globalScene.gameData.dexData[starterSpeciesId].ivs
          : null;

      this.statsContainer.updateIvs(pokemon.ivs, originalIvs!); // TODO: is this bang correct?
      if (!eggInfo) {
        globalScene.tweens.add({
          targets: this,
          duration: fixedNumber(Math.floor(750 / speedMultiplier)),
          ease: "Cubic.easeInOut",
          x: this.initialX - this.infoWindowWidth,
          onComplete: () => {
            resolve();
          },
        });

        if (showMoves) {
          globalScene.tweens.add({
            delay: fixedNumber(Math.floor(325 / speedMultiplier)),
            targets: this.pokemonMovesContainer,
            duration: fixedNumber(Math.floor(325 / speedMultiplier)),
            ease: "Cubic.easeInOut",
            x: this.movesContainerInitialX - 57,
            onComplete: () => resolve(),
          });
        }
      }

      for (let m = 0; m < 4; m++) {
        const move = m < pokemon.moveset.length && pokemon.moveset[m] ? pokemon.moveset[m]!.getMove() : null;
        this.pokemonMoveBgs[m].setFrame(
          ElementalType[move ? move.type : ElementalType.UNKNOWN].toString().toLowerCase(),
        );
        this.pokemonMoveLabels[m].setText(move ? move.name : "-");
        this.pokemonMovesContainers[m].setVisible(!!move);
      }

      this.setVisible(true);
      this.shown = true;
      globalScene.hideEnemyModifierBar();
    });
  }

  changeToEggSummaryLayout() {
    // The position should be set per language (and shifted for new layout)
    const currentLanguage = i18next.resolvedLanguage!; // TODO: is this bang correct?
    const langSettingKey = Object.keys(languageSettings).find((lang) => currentLanguage?.includes(lang))!; // TODO: is this bang correct?
    const textSettings = languageSettings[langSettingKey];

    const eggLabelTextOffset = 43;
    const infoContainerLabelXPos = (textSettings?.infoContainerLabelXPos || -18) + eggLabelTextOffset;
    const infoContainerTextXPos = (textSettings?.infoContainerTextXPos || -14) + eggLabelTextOffset;

    this.x = this.initialX - this.infoWindowWidth;

    this.pokemonGenderText.setPosition(89, -2);
    this.pokemonGenderNewText.setPosition(79, -2);
    this.pokemonShinyIcon.setPosition(82, 87);
    this.pokemonShinyNewIcon.setPosition(72, 87);

    this.pokemonFormLabelText.setPosition(infoContainerLabelXPos, 152);
    this.pokemonFormText.setPosition(infoContainerTextXPos, 152);
    this.pokemonAbilityLabelText.setPosition(infoContainerLabelXPos, 110);
    this.pokemonAbilityText.setPosition(infoContainerTextXPos, 110);
    this.pokemonNatureLabelText.setPosition(infoContainerLabelXPos, 125);
    this.pokemonNatureText.setPosition(infoContainerTextXPos, 125);

    this.statsContainer.setScale(0.7);
    this.statsContainer.setPosition(30, -3);
    this.infoBg.setVisible(false);
    this.pokemonMovesContainer.setVisible(false);
  }

  makeRoomForOptionSelectUi(requiredSpace: number): Promise<void> {
    return new Promise<void>((resolve) => {
      globalScene.tweens.add({
        targets: this,
        duration: fixedNumber(150),
        ease: "Cubic.easeInOut",
        x: this.initialX - this.infoWindowWidth - requiredSpace,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  hide(speedMultiplier: number = 1): Promise<void> {
    return new Promise((resolve) => {
      if (!this.shown) {
        globalScene.showEnemyModifierBar();
        return resolve();
      }

      globalScene.tweens.add({
        targets: this.pokemonMovesContainer,
        duration: fixedNumber(Math.floor(750 / speedMultiplier)),
        ease: "Cubic.easeInOut",
        x: this.movesContainerInitialX,
      });

      globalScene.tweens.add({
        targets: this,
        duration: fixedNumber(Math.floor(750 / speedMultiplier)),
        ease: "Cubic.easeInOut",
        x: this.initialX,
        onComplete: () => {
          this.setVisible(false);
          this.pokemonShinyIcon.off("pointerover");
          this.pokemonShinyIcon.off("pointerout");
          globalScene.ui.hideTooltip();
          globalScene.showEnemyModifierBar();
          resolve();
        },
      });

      this.shown = false;
    });
  }
}
