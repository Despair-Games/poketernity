import type { PlayerPokemon } from "#app/field/pokemon";
import type PokemonIconAnimHandler from "../../pokemon-icon-anim-handler";
import { PartyUiMode } from "../definitions";
import type { Moves } from "#enums/moves";
import { globalScene } from "#app/global-scene";
import { PokemonIconAnimMode } from "../../pokemon-icon-anim-handler";
import { addTextObject, TextStyle } from "../../text";
import { getGenderColor, getGenderShadowColor, getGenderSymbol } from "#app/data/gender";
import { getVariantTint } from "#app/data/variant";
import { getLocalizedSpriteKey } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";

export class PartySlot extends Phaser.GameObjects.Container {
  private selected: boolean;
  private transfer: boolean;
  private slotIndex: number;
  private pokemon: PlayerPokemon;

  private slotBg: Phaser.GameObjects.Image;
  private slotPb: Phaser.GameObjects.Sprite;
  public slotName: Phaser.GameObjects.Text;
  public slotHpBar: Phaser.GameObjects.Image;
  public slotHpOverlay: Phaser.GameObjects.Sprite;
  public slotHpText: Phaser.GameObjects.Text;
  public slotDescriptionLabel: Phaser.GameObjects.Text; // this is used to show text instead of the HP bar i.e. for showing "Able"/"Not Able" for TMs when you try to learn them

  private pokemonIcon: Phaser.GameObjects.Container;
  private iconAnimHandler: PokemonIconAnimHandler;

  constructor(
    slotIndex: number,
    pokemon: PlayerPokemon,
    iconAnimHandler: PokemonIconAnimHandler,
    partyUiMode: PartyUiMode,
    tmMoveId: Moves,
  ) {
    super(
      globalScene,
      slotIndex >= globalScene.currentBattle.getBattlerCount() ? 230.5 : 64,
      slotIndex >= globalScene.currentBattle.getBattlerCount()
        ? -184
            + (globalScene.currentBattle.double ? -40 : 0)
            + (28 + (globalScene.currentBattle.double ? 8 : 0)) * slotIndex
        : -124 + (globalScene.currentBattle.double ? -8 : 0) + slotIndex * 64,
    );

    this.slotIndex = slotIndex;
    this.pokemon = pokemon;
    this.iconAnimHandler = iconAnimHandler;

    this.setup(partyUiMode, tmMoveId);
  }

  getPokemon(): PlayerPokemon {
    return this.pokemon;
  }

  setup(partyUiMode: PartyUiMode, tmMoveId: Moves) {
    const battlerCount = globalScene.currentBattle.getBattlerCount();

    const slotKey = `party_slot${this.slotIndex >= battlerCount ? "" : "_main"}`;

    const slotBg = globalScene.add.sprite(0, 0, slotKey, `${slotKey}${this.pokemon.hp ? "" : "_fnt"}`);
    this.slotBg = slotBg;

    this.add(slotBg);

    const slotPb = globalScene.add.sprite(
      this.slotIndex >= battlerCount ? -85.5 : -51,
      this.slotIndex >= battlerCount ? 0 : -20.5,
      "party_pb",
    );
    this.slotPb = slotPb;

    this.add(slotPb);

    this.pokemonIcon = globalScene.addPokemonIcon(this.pokemon, slotPb.x, slotPb.y, 0.5, 0.5, true);

    this.add(this.pokemonIcon);

    this.iconAnimHandler.addOrUpdate(this.pokemonIcon, PokemonIconAnimMode.PASSIVE);

    const slotInfoContainer = globalScene.add.container(0, 0);
    this.add(slotInfoContainer);

    let displayName = this.pokemon.getNameToRender();
    let nameTextWidth: number;

    const nameSizeTest = addTextObject(0, 0, displayName, TextStyle.PARTY);
    nameTextWidth = nameSizeTest.displayWidth;

    while (nameTextWidth > (this.slotIndex >= battlerCount ? 52 : 76 - (this.pokemon.fusionSpecies ? 8 : 0))) {
      displayName = `${displayName.slice(0, displayName.endsWith(".") ? -2 : -1).trimEnd()}.`;
      nameSizeTest.setText(displayName);
      nameTextWidth = nameSizeTest.displayWidth;
    }

    nameSizeTest.destroy();

    this.slotName = addTextObject(0, 0, displayName, TextStyle.PARTY);
    this.slotName.setPositionRelative(
      slotBg,
      this.slotIndex >= battlerCount ? 21 : 24,
      this.slotIndex >= battlerCount ? 2 : 10,
    );
    this.slotName.setOrigin(0, 0);

    const slotLevelLabel = globalScene.add.image(0, 0, "party_slot_overlay_lv");
    slotLevelLabel.setPositionRelative(this.slotName, 8, 12);
    slotLevelLabel.setOrigin(0, 0);

    const slotLevelText = addTextObject(
      0,
      0,
      this.pokemon.level.toString(),
      this.pokemon.level < globalScene.getMaxExpLevel() ? TextStyle.PARTY : TextStyle.PARTY_RED,
    );
    slotLevelText.setPositionRelative(slotLevelLabel, 9, 0);
    slotLevelText.setOrigin(0, 0.25);

    slotInfoContainer.add([this.slotName, slotLevelLabel, slotLevelText]);

    const genderSymbol = getGenderSymbol(this.pokemon.getGender(true));

    if (genderSymbol) {
      const slotGenderText = addTextObject(0, 0, genderSymbol, TextStyle.PARTY);
      slotGenderText.setColor(getGenderColor(this.pokemon.getGender(true)));
      slotGenderText.setShadowColor(getGenderShadowColor(this.pokemon.getGender(true)));
      if (this.slotIndex >= battlerCount) {
        slotGenderText.setPositionRelative(slotLevelLabel, 36, 0);
      } else {
        slotGenderText.setPositionRelative(this.slotName, 76 - (this.pokemon.fusionSpecies ? 8 : 0), 3);
      }
      slotGenderText.setOrigin(0, 0.25);

      slotInfoContainer.add(slotGenderText);
    }

    if (this.pokemon.fusionSpecies) {
      const splicedIcon = globalScene.add.image(0, 0, "icon_spliced");
      splicedIcon.setScale(0.5);
      splicedIcon.setOrigin(0, 0);
      if (this.slotIndex >= battlerCount) {
        splicedIcon.setPositionRelative(slotLevelLabel, 36 + (genderSymbol ? 8 : 0), 0.5);
      } else {
        splicedIcon.setPositionRelative(this.slotName, 76, 3.5);
      }

      slotInfoContainer.add(splicedIcon);
    }

    if (this.pokemon.status) {
      const statusIndicator = globalScene.add.sprite(0, 0, getLocalizedSpriteKey("statuses"));
      statusIndicator.setFrame(StatusEffect[this.pokemon.status?.effect].toLowerCase());
      statusIndicator.setOrigin(0, 0);
      statusIndicator.setPositionRelative(slotLevelLabel, this.slotIndex >= battlerCount ? 43 : 55, 0);

      slotInfoContainer.add(statusIndicator);
    }

    if (this.pokemon.isShiny()) {
      const doubleShiny = this.pokemon.isFusion() && this.pokemon.shiny && this.pokemon.fusionShiny;

      const shinyStar = globalScene.add.image(0, 0, `shiny_star_small${doubleShiny ? "_1" : ""}`);
      shinyStar.setOrigin(0, 0);
      shinyStar.setPositionRelative(this.slotName, -9, 3);
      shinyStar.setTint(getVariantTint(!doubleShiny ? this.pokemon.getVariant() : this.pokemon.variant));

      slotInfoContainer.add(shinyStar);

      if (doubleShiny) {
        const fusionShinyStar = globalScene.add.image(0, 0, "shiny_star_small_2");
        fusionShinyStar.setOrigin(0, 0);
        fusionShinyStar.setPosition(shinyStar.x, shinyStar.y);
        fusionShinyStar.setTint(getVariantTint(this.pokemon.fusionVariant));

        slotInfoContainer.add(fusionShinyStar);
      }
    }

    this.slotHpBar = globalScene.add.image(0, 0, "party_slot_hp_bar");
    this.slotHpBar.setPositionRelative(
      slotBg,
      this.slotIndex >= battlerCount ? 72 : 8,
      this.slotIndex >= battlerCount ? 6 : 31,
    );
    this.slotHpBar.setOrigin(0, 0);
    this.slotHpBar.setVisible(false);

    const hpRatio = this.pokemon.getHpRatio();

    this.slotHpOverlay = globalScene.add.sprite(
      0,
      0,
      "party_slot_hp_overlay",
      hpRatio > 0.5 ? "high" : hpRatio > 0.25 ? "medium" : "low",
    );
    this.slotHpOverlay.setPositionRelative(this.slotHpBar, 16, 2);
    this.slotHpOverlay.setOrigin(0, 0);
    this.slotHpOverlay.setScale(hpRatio, 1);
    this.slotHpOverlay.setVisible(false);

    this.slotHpText = addTextObject(0, 0, `${this.pokemon.hp}/${this.pokemon.getMaxHp()}`, TextStyle.PARTY);
    this.slotHpText.setPositionRelative(this.slotHpBar, this.slotHpBar.width - 3, this.slotHpBar.height - 2);
    this.slotHpText.setOrigin(1, 0);
    this.slotHpText.setVisible(false);

    this.slotDescriptionLabel = addTextObject(0, 0, "", TextStyle.MESSAGE);
    this.slotDescriptionLabel.setPositionRelative(
      slotBg,
      this.slotIndex >= battlerCount ? 94 : 32,
      this.slotIndex >= battlerCount ? 16 : 46,
    );
    this.slotDescriptionLabel.setOrigin(0, 1);
    this.slotDescriptionLabel.setVisible(false);

    slotInfoContainer.add([this.slotHpBar, this.slotHpOverlay, this.slotHpText, this.slotDescriptionLabel]);

    if (partyUiMode !== PartyUiMode.TM_MODIFIER) {
      this.slotDescriptionLabel.setVisible(false);
      this.slotHpBar.setVisible(true);
      this.slotHpOverlay.setVisible(true);
      this.slotHpText.setVisible(true);
    } else {
      this.slotHpBar.setVisible(false);
      this.slotHpOverlay.setVisible(false);
      this.slotHpText.setVisible(false);
      let slotTmText: string;

      if (this.pokemon.getMoveset().filter((m) => m.moveId === tmMoveId).length > 0) {
        slotTmText = i18next.t("partyUiHandler:learned");
      } else if (this.pokemon.compatibleTms.indexOf(tmMoveId) === -1) {
        slotTmText = i18next.t("partyUiHandler:notAble");
      } else {
        slotTmText = i18next.t("partyUiHandler:able");
      }

      this.slotDescriptionLabel.setText(slotTmText);
      this.slotDescriptionLabel.setVisible(true);
    }
  }

  select(): void {
    if (this.selected) {
      return;
    }

    this.selected = true;
    this.iconAnimHandler.addOrUpdate(this.pokemonIcon, PokemonIconAnimMode.ACTIVE);

    this.updateSlotTexture();
    this.slotPb.setFrame("party_pb_sel");
  }

  deselect(): void {
    if (!this.selected) {
      return;
    }

    this.selected = false;
    this.iconAnimHandler.addOrUpdate(this.pokemonIcon, PokemonIconAnimMode.PASSIVE);

    this.updateSlotTexture();
    this.slotPb.setFrame("party_pb");
  }

  setTransfer(transfer: boolean): void {
    if (this.transfer === transfer) {
      return;
    }

    this.transfer = transfer;
    this.updateSlotTexture();
  }

  private updateSlotTexture(): void {
    const battlerCount = globalScene.currentBattle.getBattlerCount();
    this.slotBg.setTexture(
      `party_slot${this.slotIndex >= battlerCount ? "" : "_main"}`,
      `party_slot${this.slotIndex >= battlerCount ? "" : "_main"}${this.transfer ? "_swap" : this.pokemon.hp ? "" : "_fnt"}${this.selected ? "_sel" : ""}`,
    );
  }
}
