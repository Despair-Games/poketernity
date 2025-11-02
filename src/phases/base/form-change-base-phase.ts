import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { getTypeRgb } from "#data/type";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { FormChangeSceneUiHandler } from "#ui/form-change-scene-ui-handler";

/**
 * A base phase to establish a "scene" for when a Pokemon changes form.
 * Currently used for evolution and all toggleable form changes (e.g. Mega Evolution).
 * @todo Use a separate Phaser Scene to contain assets. This currently
 * injects sprites and other assets into {@linkcode FormChangeSceneUiHandler}'s container
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

  public override async start(): Promise<void> {
    await this.setMode();
    const { audioManager, spritePipeline } = globalScene;

    audioManager.fadeOutBgm(undefined, false);

    this.initAssets();

    [this.pokemonSprite, this.pokemonTintSprite, this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].forEach(
      (sprite) => {
        const spriteKey = this.pokemon.getSpriteKey(true);
        // TODO: this animation may be better placed in `applyFormChange`
        sprite.play(spriteKey);

        sprite.setPipeline(spritePipeline, {
          tone: [0.0, 0.0, 0.0, 0.0],
          hasShadow: false,
          teraColor: getTypeRgb(this.pokemon.teraType),
          isTerastallized: this.pokemon.isTerastallized,
        });
        sprite.setPipelineData("ignoreTimeTint", true);
        sprite.setPipelineData("spriteKey", this.pokemon.getSpriteKey());
        let key = "spriteColors";
        if (this.pokemon.summonData.speciesForm) {
          key += "Base";
        }
        sprite.pipelineData[key] = this.pokemon.getSprite().pipelineData[key];
      },
    );

    await this.applyFormChange();
  }

  /**
   * Switches the running UI handler to the form change "scene", then initializes
   * the phase's {@linkcode handler} and {@linkcode container} references based on
   * the new handler.
   * @async
   */
  protected async setMode(): Promise<void> {
    const { ui } = globalScene;
    await ui.setModeForceTransition<FormChangeSceneUiHandler>(UiMode.FORM_CHANGE_SCENE);

    this.handler = ui.getCurrentHandler<FormChangeSceneUiHandler>();
    this.container = this.handler.container;
  }

  /**
   * Applies all logical and visual effects of the form change, including
   * animations and changes to game data.
   * @virtual
   */
  public abstract applyFormChange(): Promise<void>;

  /**
   * Creates all assets for the form change sequence and injects them into
   * the running UI handler.
   * @todo Visual assets should be stored in a separate Scene.
   */
  private initAssets(): void {
    const { add, ui } = globalScene;

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

    this.pokemonSprite = this.createPokemonSprite();
    this.pokemonTintSprite = this.createPokemonSprite();
    this.pokemonNewFormSprite = this.createPokemonSprite();
    this.pokemonNewFormTintSprite = this.createPokemonSprite();

    [this.pokemonSprite, this.pokemonTintSprite, this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].forEach(
      (sprite) => this.container.add(sprite),
    );

    this.pokemonTintSprite.setAlpha(0);
    this.pokemonTintSprite.setTintFill(0xffffff);
    this.pokemonNewFormSprite.setVisible(false);
    this.pokemonNewFormTintSprite.setVisible(false);
    this.pokemonNewFormTintSprite.setTintFill(0xffffff);

    this.overlay = add.rectangle(0, -GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT - 48, 0xffffff);
    this.overlay.setOrigin(0, 0);
    this.overlay.setAlpha(0);
    ui.add(this.overlay);
  }

  /**
   * {@link globalScene.addPokemonSprite | Creates a Pokemon sprite}, then applies `globalScene`'s
   * pipeline onto the created sprite.
   * @returns The created {@linkcode Phaser.GameObjects.Sprite | Sprite}
   */
  private createPokemonSprite(): Phaser.GameObjects.Sprite {
    const ret = globalScene.addPokemonSprite(
      this.pokemon,
      this.baseBgImg.displayWidth / 2,
      this.baseBgImg.displayHeight / 2,
      "pkmn__sub",
    );
    ret.setPipeline(globalScene.spritePipeline, { tone: [0.0, 0.0, 0.0, 0.0], ignoreTimeTint: true });
    return ret;
  }
}
