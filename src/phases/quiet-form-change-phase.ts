import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostTeraFormChangeClearWeatherTerrainAbAttr } from "#abilities/post-tera-form-change-clear-weather-terrain-ab-attr";
import type { PostTeraFormChangeStatChangeAbAttr } from "#abilities/post-tera-form-change-stat-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getSpeciesFormChangeMessage, type SpeciesFormChange, SpeciesFormChangeTeraTrigger } from "#data/pokemon-forms";
import { getTypeRgb } from "#data/type";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/base/battle-phase";
import { playTween } from "#utils/anim-utils";

export class QuietFormChangePhase extends BattlePhase {
  public override readonly phaseName = "QuietFormChangePhase";

  protected readonly pokemon: Pokemon;
  protected readonly formChange: SpeciesFormChange;

  constructor(pokemon: Pokemon, formChange: SpeciesFormChange) {
    super();
    this.pokemon = pokemon;
    this.formChange = formChange;
  }

  public override async start(): Promise<void> {
    const { ui } = globalScene;

    if (this.pokemon.formIndex === this.pokemon.species.forms.findIndex((f) => f.formKey === this.formChange.formKey)) {
      this.end();
      return;
    }

    const preName = getPokemonNameWithAffix(this.pokemon);

    if (!this.pokemon.isOnField() || this.pokemon.isSemiInvulnerable() || this.pokemon.isFainted()) {
      if (this.pokemon.isPlayer() || this.pokemon.isActive()) {
        await this.pokemon.changeForm(this.formChange);
        ui.showText(getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName), {
          callback: () => this.end(),
          callbackDelay: 1500,
        });
      } else {
        this.end();
      }
      return;
    }

    /** A white tint fill of the pre-form-change Pokemon sprite */
    const pokemonTintSprite = this.createPokemonSprite() //
      .setAlpha(0)
      .setTintFill(0xffffff);

    /** A white tint fill of the post-form-change Pokemon sprite */
    const pokemonFormTintSprite = this.createPokemonSprite() //
      .setVisible(false)
      .setTintFill(0xffffff)
      .setScale(0.01);

    // Sync tint sprites' animations with the original Pokemon's animation
    this.pokemon.getSprite().on("animationupdate", (_anim, frame) => {
      if (frame.textureKey === pokemonTintSprite.texture.key) {
        pokemonTintSprite.setFrame(frame.textureFrame);
      } else {
        pokemonFormTintSprite.setFrame(frame.textureFrame);
      }
    });

    globalScene.audioManager.playSound("battle_anims/PRSFX- Transform");

    // Fades the original form tint in on top of the affected Pokemon
    await playTween({
      targets: pokemonTintSprite,
      alpha: 1,
      duration: 1000,
      ease: "Cubic.easeIn",
    });

    // Hide the affected Pokemon's sprite and change its form while invisible
    this.pokemon.setVisible(false);
    await this.pokemon.changeForm(this.formChange);

    const spriteKey = this.pokemon.getBattleSpriteKey();
    // TODO: does `.play(...).stop()` actually do anything?
    pokemonFormTintSprite //
      .play(spriteKey)
      .stop()
      .setVisible(true);

    await Promise.allSettled([
      // Shrinks the original form tint sprite
      playTween({
        targets: pokemonTintSprite,
        delay: 250,
        scale: 0.01,
        ease: "Cubic.easeInOut",
        duration: 500,
      }),
      // Grows the new form tint sprite to match the affected Pokemon's scale
      playTween({
        targets: pokemonFormTintSprite,
        delay: 250,
        scale: this.pokemon.getSpriteScale(),
        ease: "Cubic.easeInOut",
        duration: 500,
      }),
    ]);

    pokemonTintSprite.destroy();
    this.pokemon.setVisible(true);

    // Fades out the new form tint sprite
    await playTween({
      targets: pokemonFormTintSprite,
      delay: 250,
      alpha: 0,
      ease: "Cubic.easeOut",
      duration: 1000,
    });
    pokemonFormTintSprite.destroy();

    ui.showText(getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName), {
      callback: () => this.end(),
      callbackDelay: 1500,
    });
  }

  public override end(): void {
    this.pokemon.findAndRemoveTags((t) => t.tagType === BattlerTagType.AUTOTOMIZED);

    if (globalScene?.currentBattle.isClassicFinalBoss && this.pokemon.isEnemy()) {
      globalScene.audioManager.playBgm();
      globalScene.phaseManager.createAndUnshiftPhase(
        "PokemonHealPhase",
        this.pokemon.getBattlerIndex(),
        this.pokemon.getMaxHp(),
        {
          showFullHpMessage: false,
          healStatus: true,
        },
      );

      this.pokemon.findAndRemoveTags(() => true);
      this.pokemon.bossSegments = 5;
      this.pokemon.bossSegmentIndex = 4;
      this.pokemon.initBattleInfo();
      this.pokemon.cry();

      const movePhase = globalScene.phaseManager.findPhaseOfType("MovePhase", (p) => p.pokemon === this.pokemon);
      if (movePhase) {
        movePhase.cancel();
      }
    }

    if (this.formChange.trigger instanceof SpeciesFormChangeTeraTrigger) {
      // TODO: add simulated support?
      applyAbAttrs<PostTeraFormChangeStatChangeAbAttr>(
        AbAttrFlag.POST_TERA_FORM_CHANGE_STAT_CHANGE,
        this.pokemon,
        false,
      );
      /**
       * TODO: Smogon suggests this is tied to tera so move to `terastallization-phase` and
       * rename the AbAttr in case we want randomizer modes where other Pokemon may have
       * Tera Zero
       */
      applyAbAttrs<PostTeraFormChangeClearWeatherTerrainAbAttr>(
        AbAttrFlag.POST_TERA_FORM_CHANGE_CLEAR_WEATHER_TERRAIN,
        this.pokemon,
        false,
      );
    }

    super.end();
  }

  /**
   * Creates a copy of the affected Pokemon's sprite with the same
   * pipeline applied and adds it to the {@linkcode globalScene.field | field} container
   * @returns The copied {@linkcode Phaser.GameObjects.Sprite | Sprite}
   */
  private createPokemonSprite(): Phaser.GameObjects.Sprite {
    const { field, spritePipeline } = globalScene;
    const sprite = globalScene.addPokemonSprite(
      this.pokemon,
      this.pokemon.x + this.pokemon.getSprite().x,
      this.pokemon.y + this.pokemon.getSprite().y,
      "pkmn__sub",
    );
    sprite.setOrigin(0.5, 1);

    const spriteKey = this.pokemon.getBattleSpriteKey();
    sprite.play(spriteKey).stop();

    sprite.setPipeline(spritePipeline, {
      tone: [0.0, 0.0, 0.0, 0.0],
      hasShadow: false,
      teraColor: getTypeRgb(this.pokemon.teraType),
      isTerastallized: this.pokemon.isTerastallized,
    });

    let key = "spriteColors";
    if (this.pokemon.summonData.speciesForm) {
      key += "Base";
    }
    sprite.pipelineData[key] = this.pokemon.getSprite().pipelineData[key];

    field.add(sprite);
    return sprite;
  }
}
