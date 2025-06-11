import { globalScene } from "#app/global-scene";
import type PokemonSpecies from "#data/pokemon-species";
import { Gender } from "#enums/gender";
import { TextStyle } from "#enums/text-style";
import { addTextObject } from "#ui/text-utils";

export class StarterContainer extends Phaser.GameObjects.Container {
  public species: PokemonSpecies;
  public icon: Phaser.GameObjects.Sprite;
  public shinyIcons: Phaser.GameObjects.Image[] = [];
  public label: Phaser.GameObjects.Text;
  public starterPassiveBg: Phaser.GameObjects.Image;
  public hiddenAbilityIcon: Phaser.GameObjects.Image;
  public favoriteIcon: Phaser.GameObjects.Image;
  public classicWinIcon: Phaser.GameObjects.Image;
  public cost: number = 0;

  constructor(species: PokemonSpecies) {
    super(globalScene, 0, 0);

    this.species = species;

    const defaultDexAttr = globalScene.gameData.getSpeciesDefaultDexAttr(species, false, true);
    const defaultProps = globalScene.gameData.getSpeciesDexAttrProps(species, defaultDexAttr);
    const { formIndex, shiny, variant } = defaultProps;
    const isFemale = defaultProps.gender === Gender.FEMALE;

    // starter passive bg
    this.starterPassiveBg = globalScene.add.image(2, 5, "passive_bg").setOrigin(0, 0).setScale(0.75).setVisible(false);
    this.add(this.starterPassiveBg);

    // pokemon icon
    this.icon = globalScene.add
      .sprite(-2, 2, species.getIconAtlasKey(formIndex, shiny, variant))
      .setScale(0.5)
      .setOrigin(0, 0)
      .setTint(0)
      .setFrame(species.getIconId(isFemale, formIndex, shiny, variant));
    this.checkIconId(isFemale, formIndex, shiny, variant);
    this.add(this.icon);

    // shiny icons
    for (let i = 0; i < 3; i++) {
      const shinyIcon = globalScene.add
        .image(i * -3 + 12, 2, "shiny_star_small")
        .setScale(0.5)
        .setOrigin(0, 0)
        .setVisible(false);
      this.shinyIcons.push(shinyIcon);
    }
    this.add(this.shinyIcons);

    // value label
    this.label = addTextObject(1, 2, "0", TextStyle.STARTER_COST)
      .setShadowOffset(2, 2)
      .setOrigin(0, 0)
      .setVisible(false);
    this.add(this.label);

    // hidden ability icon
    this.hiddenAbilityIcon = globalScene.add
      .image(12, 7, "icon_ha_capsule")
      .setOrigin(0, 0)
      .setScale(0.5)
      .setVisible(false);
    this.add(this.hiddenAbilityIcon);

    // favorite icon
    this.favoriteIcon = globalScene.add.image(0, 7, "icon_favorite").setOrigin(0, 0).setScale(0.5).setVisible(false);
    this.add(this.favoriteIcon);

    // classic win icon
    this.classicWinIcon = globalScene.add
      .image(0, 12, "icon_champion_ribbon")
      .setOrigin(0, 0)
      .setScale(0.5)
      .setVisible(false);
    this.add(this.classicWinIcon);
  }

  checkIconId(female: boolean, formIndex?: number, shiny?: boolean, variant?: number) {
    if (this.icon.frame.name !== this.species.getIconId(female, formIndex, shiny, variant)) {
      console.log(`${this.species.name}'s variant icon does not exist. Replacing with default.`);
      const textureKey = this.species.getIconAtlasKey(formIndex, false, variant);
      const frameKey = this.species.getIconId(female, formIndex, false, variant);
      this.icon.setTexture(textureKey, frameKey);
    }
  }
}
