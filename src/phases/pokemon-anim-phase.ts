import { globalScene } from "#app/global-scene";
import type { SubstituteTag } from "#battler-tags/substitute-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/base/battle-phase";
import { playNumberTween, playTween } from "#utils/anim-utils";

// TODO: This should probably be made into an abstract base class
export class PokemonAnimPhase extends BattlePhase {
  public override readonly phaseName = "PokemonAnimPhase";

  /** The type of animation to play in this phase */
  protected readonly key: PokemonAnimType;
  /** The Pokemon to which this animation applies */
  protected readonly pokemon: Pokemon;
  /** Any other field sprites affected by this animation */
  protected readonly fieldAssets: Phaser.GameObjects.Sprite[];

  constructor(key: PokemonAnimType, pokemon: Pokemon, fieldAssets: Phaser.GameObjects.Sprite[] = []) {
    super();

    this.key = key;
    this.pokemon = pokemon;
    this.fieldAssets = fieldAssets;
  }

  public override async start(): Promise<void> {
    switch (this.key) {
      case PokemonAnimType.SUBSTITUTE_ADD:
        await this.doSubstituteAddAnim();
        break;
      case PokemonAnimType.SUBSTITUTE_PRE_MOVE:
        await this.doSubstitutePreMoveAnim();
        break;
      case PokemonAnimType.SUBSTITUTE_POST_MOVE:
        await this.doSubstitutePostMoveAnim();
        break;
      case PokemonAnimType.SUBSTITUTE_REMOVE:
        await this.doSubstituteRemoveAnim();
        break;
      case PokemonAnimType.COMMANDER_APPLY:
        await this.doCommanderApplyAnim();
        break;
      case PokemonAnimType.COMMANDER_REMOVE:
        await this.doCommanderRemoveAnim();
        break;
    }
    this.end();
  }

  private async doSubstituteAddAnim(): Promise<void> {
    const { field } = globalScene;

    const substitute = this.pokemon.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE);
    if (substitute == null) {
      return;
    }

    const getSprite = (): Phaser.GameObjects.Sprite => {
      const sprite = globalScene.addFieldSprite(
        this.pokemon.x + this.pokemon.getSprite().x,
        this.pokemon.y + this.pokemon.getSprite().y,
        `pkmn${this.pokemon.isPlayer() ? "__back" : ""}__sub`,
      );
      sprite.setOrigin(0.5, 1);
      field.add(sprite);
      return sprite;
    };

    const [subSprite, subTintSprite] = [getSprite(), getSprite()];
    const subScale = this.pokemon.getSpriteScale() * (this.pokemon.isPlayer() ? 0.5 : 1);

    subSprite //
      .setVisible(false)
      .setScale(subScale);
    subTintSprite //
      .setTintFill(0xffffff)
      .setScale(0.01);

    if (this.pokemon.isPlayer()) {
      field.bringToTop(this.pokemon);
    }

    globalScene.audioManager.playSound("battle_anims/PRSFX- Transform.wav");

    const offset = this.pokemon.getSubstituteOffset();

    await Promise.allSettled([
      playTween({
        targets: this.pokemon,
        duration: 500,
        x: `+=${offset[0]}`,
        y: `+=${offset[1]}`,
        alpha: 0.5,
        ease: "Sine.easeIn",
      }),
      playTween({
        targets: subTintSprite,
        delay: 250,
        scale: subScale,
        ease: "Cubic.easeInOut",
        duration: 500,
      }),
    ]);

    subSprite.setVisible(true);
    await playTween({
      targets: subTintSprite,
      delay: 250,
      alpha: 0,
      ease: "Cubic.easeOut",
      duration: 1000,
    });

    subTintSprite.destroy();
    substitute.sprite = subSprite;
  }

  private async doSubstitutePreMoveAnim(): Promise<void> {
    if (this.fieldAssets.length !== 1) {
      return;
    }

    const subSprite = this.fieldAssets[0];
    if (subSprite == null) {
      return;
    }

    await Promise.allSettled([
      playTween({
        targets: subSprite,
        alpha: 0,
        ease: "Sine.easeInOut",
        duration: 500,
      }),
      playTween({
        targets: this.pokemon,
        x: subSprite.x,
        y: subSprite.y,
        alpha: 1,
        ease: "Sine.easeInOut",
        delay: 250,
        duration: 500,
      }),
    ]);
  }

  private async doSubstitutePostMoveAnim(): Promise<void> {
    if (this.fieldAssets.length !== 1) {
      return;
    }

    const subSprite = this.fieldAssets[0];
    if (subSprite === undefined) {
      return;
    }

    const offset = this.pokemon.getSubstituteOffset();

    await Promise.allSettled([
      playTween({
        targets: this.pokemon,
        x: subSprite.x + offset[0],
        y: subSprite.y + offset[1],
        alpha: 0.5,
        ease: "Sine.easeInOut",
        duration: 500,
      }),
      playTween({
        targets: subSprite,
        alpha: 1,
        ease: "Sine.easeInOut",
        delay: 250,
        duration: 500,
      }),
    ]);
  }

  private async doSubstituteRemoveAnim(): Promise<void> {
    if (this.fieldAssets.length !== 1) {
      return;
    }

    const subSprite = this.fieldAssets[0];
    if (subSprite === undefined) {
      return;
    }

    const subTintSprite = globalScene.addFieldSprite(
      subSprite.x,
      subSprite.y,
      `pkmn${this.pokemon.isPlayer() ? "__back" : ""}__sub`,
    );

    const subScale = this.pokemon.getSpriteScale() * (this.pokemon.isPlayer() ? 0.5 : 1);
    subTintSprite //
      .setOrigin(0.5, 1)
      .setAlpha(0)
      .setTintFill(0xffffff)
      .setScale(subScale);
    globalScene.field.add(subTintSprite);

    await playTween({
      targets: subTintSprite,
      alpha: 1,
      ease: "Sine.easeInOut",
      duration: 500,
    });

    subSprite.destroy();
    // TODO: this doesn't cause the tint sprite to flash for some reason
    await playNumberTween({
      delay: 200,
      duration: 100,
      repeat: 7,
      onStart: () => globalScene.audioManager.playSound("battle_anims/PRSFX- Substitute2.wav"),
      onLoop: () => subTintSprite.setVisible(!subTintSprite.visible),
    });

    const offset = this.pokemon.getSubstituteOffset();
    await Promise.allSettled([
      playTween({
        targets: subTintSprite,
        scale: 0.01,
        ease: "Sine.cubicEaseIn",
        duration: 500,
      }),
      playTween({
        targets: this.pokemon,
        x: `-=${offset[0]}`,
        y: `-=${offset[1]}`,
        alpha: 1,
        ease: "Sine.easeInOut",
        delay: 250,
        duration: 500,
      }),
    ]);

    subTintSprite.destroy();
  }

  private async doCommanderApplyAnim(): Promise<void> {
    const { currentBattle, field } = globalScene;

    if (!currentBattle?.double) {
      return;
    }

    const dondozo = this.pokemon.getAlly();
    if (dondozo?.species?.speciesId !== SpeciesId.DONDOZO) {
      return;
    }

    const tatsugiriX = this.pokemon.x + this.pokemon.getSprite().x;
    const tatsugiriY = this.pokemon.y + this.pokemon.getSprite().y;

    const sourceSprite = globalScene.addPokemonSprite(
      this.pokemon,
      tatsugiriX,
      tatsugiriY,
      this.pokemon.getSprite().texture,
      this.pokemon.getSprite()!.frame.name,
      true,
    );
    sourceSprite.pipelineData["spriteColors"] = this.pokemon.getSprite().pipelineData["spriteColors"];
    sourceSprite
      .setPipelineData("spriteKey", this.pokemon.getBattleSpriteKey())
      .setPipelineData("ignoreFieldPos", true)
      .setOrigin(0.5, 1);
    this.pokemon.getSprite().on("animationupdate", (_anim, frame) => sourceSprite.setFrame(frame.textureFrame));
    field.add(sourceSprite);

    this.pokemon.setVisible(false);

    const sourceFpOffset = this.pokemon.getFieldPositionOffset();
    const dondozoFpOffset = dondozo.getFieldPositionOffset();

    globalScene.audioManager.playSound("se/pb_throw");

    await playTween({
      targets: sourceSprite,
      duration: 375,
      scale: 0.5,
      x: { value: tatsugiriX + (dondozoFpOffset[0] - sourceFpOffset[0]) / 2, ease: "Linear" },
      y: { value: (this.pokemon.isPlayer() ? 100 : 65) + sourceFpOffset[1], ease: "Sine.easeOut" },
    });

    field.bringToTop(dondozo);
    await playTween({
      targets: sourceSprite,
      duration: 375,
      scale: 0.01,
      x: { value: dondozo.x, ease: "Linear" },
      y: { value: dondozo.y + dondozo.height / 2, ease: "Sine.easeIn" },
    });

    sourceSprite.destroy();
    globalScene.audioManager.playSound("battle_anims/PRSFX- Liquidation1.wav");
    await playTween({
      targets: dondozo,
      duration: 250,
      ease: "Sine.easeInOut",
      scale: 0.85,
      yoyo: true,
    });
  }

  private async doCommanderRemoveAnim(): Promise<void> {
    // Note: unlike the other Commander animation, this is played through the
    // Dondozo instead of the Tatsugiri.
    const tatsugiri = this.pokemon.getAlly();
    if (tatsugiri == null) {
      console.warn("Aborting COMMANDER_REMOVE anim: Tatsugiri is undefined");
      return;
    }

    const tatsuSprite = globalScene.addPokemonSprite(
      tatsugiri,
      this.pokemon.x + this.pokemon.getSprite().x,
      this.pokemon.y + this.pokemon.getSprite().y + this.pokemon.height / 2,
      tatsugiri.getSprite().texture,
      tatsugiri.getSprite()!.frame.name,
      true,
    );

    tatsuSprite.pipelineData["spriteColors"] = tatsugiri.getSprite().pipelineData["spriteColors"];
    tatsuSprite.setPipelineData("spriteKey", tatsugiri.getBattleSpriteKey());
    tatsuSprite.setPipelineData("ignoreFieldPos", true);
    this.pokemon.getSprite().on("animationupdate", (_anim, frame) => tatsuSprite.setFrame(frame.textureFrame));

    tatsuSprite.setOrigin(0.5, 1);
    tatsuSprite.setScale(0.01);

    globalScene.field.add(tatsuSprite);
    globalScene.field.bringToTop(this.pokemon);
    tatsuSprite.setVisible(true);

    await playTween({
      targets: this.pokemon,
      scale: 1.15,
      duration: 250,
      ease: "Sine.easeInOut",
      yoyo: true,
    });

    globalScene.audioManager.playSound("battle_anims/PRSFX- Liquidation4.wav");
    await playTween({
      targets: tatsuSprite,
      x: { value: tatsugiri.x + tatsugiri.getSprite().x, ease: "Linear" },
      y: { value: tatsugiri.y + tatsugiri.getSprite().y, ease: "Sine.easeIn" },
      scale: 1,
      duration: 500,
    });

    tatsugiri.setVisible(true);
    tatsuSprite.destroy();
  }
}
