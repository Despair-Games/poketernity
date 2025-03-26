import { getTypeRgb } from "#app/data/type";
import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GAME_HEIGHT, GAME_WIDTH } from "#app/ui-constants";
import type { FormChangeSceneUiHandler } from "#app/ui/handlers/form-change-scene-ui-handler";
import { UiMode } from "#enums/ui-mode";

/**
 * A base phase for handling Pokemon form changes, including evolutions
 * @extends Phase
 */
export abstract class FormChangeBasePhase extends Phase {
  protected pokemon: PlayerPokemon;

  protected handler: FormChangeSceneUiHandler;

  protected container: Phaser.GameObjects.Container;
  protected baseBgImg: Phaser.GameObjects.Image;
  protected bgVideo: Phaser.GameObjects.Video;
  protected bgOverlay: Phaser.GameObjects.Rectangle;
  protected overlay: Phaser.GameObjects.Rectangle;
  protected pokemonSprite: Phaser.GameObjects.Sprite;
  protected pokemonTintSprite: Phaser.GameObjects.Sprite;
  protected pokemonNewFormSprite: Phaser.GameObjects.Sprite;
  protected pokemonNewFormTintSprite: Phaser.GameObjects.Sprite;

  constructor(pokemon: PlayerPokemon) {
    super();

    this.pokemon = pokemon;
  }

  public abstract doFormChange(): void;

  public abstract validate(): boolean;

  public setMode(): Promise<void> {
    return globalScene.ui.setModeForceTransition<FormChangeSceneUiHandler>(UiMode.FORM_CHANGE_SCENE);
  }

  public override start(): void {
    super.start();
    const { add, spritePipeline, ui } = globalScene;

    this.setMode().then(() => {
      if (!this.validate()) {
        return this.end();
      }

      globalScene.audioManager.fadeOutBgm(undefined, false);

      this.handler = ui.getHandler() as FormChangeSceneUiHandler;

      this.container = this.handler.container;

      this.baseBgImg = add.image(0, 0, "default_bg");
      this.baseBgImg.setOrigin(0, 0);
      this.container.add(this.baseBgImg);

      this.bgVideo = add.video(0, 0, "evo_bg").stop();
      this.bgVideo.setOrigin(0, 0);
      this.bgVideo.setScale(0.4359673025);
      this.bgVideo.setVisible(false);
      this.container.add(this.bgVideo);

      this.bgOverlay = add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x262626);
      this.bgOverlay.setOrigin(0, 0);
      this.bgOverlay.setAlpha(0);
      this.container.add(this.bgOverlay);

      const getPokemonSprite = (): Phaser.GameObjects.Sprite => {
        const ret = globalScene.addPokemonSprite(
          this.pokemon,
          this.baseBgImg.displayWidth / 2,
          this.baseBgImg.displayHeight / 2,
          "pkmn__sub",
        );
        ret.setPipeline(spritePipeline, { tone: [0.0, 0.0, 0.0, 0.0], ignoreTimeTint: true });
        return ret;
      };

      this.container.add((this.pokemonSprite = getPokemonSprite()));
      this.container.add((this.pokemonTintSprite = getPokemonSprite()));
      this.container.add((this.pokemonNewFormSprite = getPokemonSprite()));
      this.container.add((this.pokemonNewFormTintSprite = getPokemonSprite()));

      this.pokemonTintSprite.setAlpha(0);
      this.pokemonTintSprite.setTintFill(0xffffff);
      this.pokemonNewFormSprite.setVisible(false);
      this.pokemonNewFormTintSprite.setVisible(false);
      this.pokemonNewFormTintSprite.setTintFill(0xffffff);

      this.overlay = add.rectangle(0, -GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT - 48, 0xffffff);
      this.overlay.setOrigin(0, 0);
      this.overlay.setAlpha(0);
      ui.add(this.overlay);

      [this.pokemonSprite, this.pokemonTintSprite, this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].map(
        (sprite) => {
          const spriteKey = this.pokemon.getSpriteKey(true);
          try {
            sprite.play(spriteKey);
          } catch (err: unknown) {
            console.error(`Failed to play animation for ${spriteKey}`, err);
          }

          sprite.setPipeline(spritePipeline, {
            tone: [0.0, 0.0, 0.0, 0.0],
            hasShadow: false,
            teraColor: getTypeRgb(this.pokemon.getTeraType()),
          });
          sprite.setPipelineData("ignoreTimeTint", true);
          sprite.setPipelineData("spriteKey", this.pokemon.getSpriteKey());
          let key = "spriteColors";
          if (this.pokemon.summonData?.speciesForm) {
            key += "Base";
          }
          sprite.pipelineData[key] = this.pokemon.getSprite().pipelineData[key];
        },
      );
      this.doFormChange();
    });
  }
}
