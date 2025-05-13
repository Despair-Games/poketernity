import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostTeraFormChangeClearWeatherTerrainAbAttr } from "#abilities/post-tera-form-change-clear-weather-terrain-ab-attr";
import type { PostTeraFormChangeStatChangeAbAttr } from "#abilities/post-tera-form-change-stat-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getSpeciesFormChangeMessage, SpeciesFormChangeTeraTrigger, type SpeciesFormChange } from "#data/pokemon-forms";
import { getTypeRgb } from "#data/type";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/abstract-battle-phase";
import type { MovePhase } from "#phases/move-phase";

export class QuietFormChangePhase extends BattlePhase {
  override readonly id = PhaseId.QUIET_FORM_CHANGE;

  protected readonly pokemon: Pokemon;
  protected readonly formChange: SpeciesFormChange;

  constructor(pokemon: Pokemon, formChange: SpeciesFormChange) {
    super();
    this.pokemon = pokemon;
    this.formChange = formChange;
  }

  public override start(): void {
    super.start();
    const { field, spritePipeline, tweens, ui } = globalScene;

    if (this.pokemon.formIndex === this.pokemon.species.forms.findIndex((f) => f.formKey === this.formChange.formKey)) {
      return this.end();
    }

    const preName = getPokemonNameWithAffix(this.pokemon);

    if (!this.pokemon.isOnField() || this.pokemon.isSemiInvulnerable() || this.pokemon.isFainted()) {
      if (this.pokemon.isPlayer() || this.pokemon.isActive()) {
        this.pokemon.changeForm(this.formChange).then(() => {
          ui.showText(
            getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName),
            null,
            () => this.end(),
            1500,
          );
        });
      } else {
        this.end();
      }
      return;
    }

    const getPokemonSprite = (): Phaser.GameObjects.Sprite => {
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
      if (this.pokemon.summonData?.speciesForm) {
        key += "Base";
      }
      sprite.pipelineData[key] = this.pokemon.getSprite().pipelineData[key];

      field.add(sprite);
      return sprite;
    };

    const [pokemonTintSprite, pokemonFormTintSprite] = [getPokemonSprite(), getPokemonSprite()];

    this.pokemon.getSprite().on("animationupdate", (_anim, frame) => {
      if (frame.textureKey === pokemonTintSprite.texture.key) {
        pokemonTintSprite.setFrame(frame.textureFrame);
      } else {
        pokemonFormTintSprite.setFrame(frame.textureFrame);
      }
    });

    pokemonTintSprite.setAlpha(0);
    pokemonTintSprite.setTintFill(0xffffff);
    pokemonFormTintSprite.setVisible(false);
    pokemonFormTintSprite.setTintFill(0xffffff);

    globalScene.audioManager.playSound("battle_anims/PRSFX- Transform");

    tweens.add({
      targets: pokemonTintSprite,
      alpha: 1,
      duration: 1000,
      ease: "Cubic.easeIn",
      onComplete: () => {
        this.pokemon.setVisible(false);
        this.pokemon.changeForm(this.formChange).then(() => {
          pokemonFormTintSprite.setScale(0.01);

          const spriteKey = this.pokemon.getBattleSpriteKey();
          pokemonFormTintSprite.play(spriteKey).stop();

          pokemonFormTintSprite.setVisible(true);

          tweens.add({
            targets: pokemonTintSprite,
            delay: 250,
            scale: 0.01,
            ease: "Cubic.easeInOut",
            duration: 500,
            onComplete: () => pokemonTintSprite.destroy(),
          });

          tweens.add({
            targets: pokemonFormTintSprite,
            delay: 250,
            scale: this.pokemon.getSpriteScale(),
            ease: "Cubic.easeInOut",
            duration: 500,
            onComplete: () => {
              this.pokemon.setVisible(true);
              tweens.add({
                targets: pokemonFormTintSprite,
                delay: 250,
                alpha: 0,
                ease: "Cubic.easeOut",
                duration: 1000,
                onComplete: () => {
                  pokemonTintSprite.setVisible(false);
                  ui.showText(
                    getSpeciesFormChangeMessage(this.pokemon, this.formChange, preName),
                    null,
                    () => this.end(),
                    1500,
                  );
                },
              });
            },
          });
        });
      },
    });
  }

  public override end(): void {
    this.pokemon.findAndRemoveTags((t) => t.tagType === BattlerTagType.AUTOTOMIZED);

    if (globalScene?.currentBattle.isClassicFinalBoss && this.pokemon.isEnemy()) {
      globalScene.audioManager.playBgm();
      globalScene.phaseManager.queuePokemonHealPhase(this.pokemon.getBattlerIndex(), this.pokemon.getMaxHp(), {
        showFullHpMessage: false,
        healStatus: true,
      });

      this.pokemon.findAndRemoveTags(() => true);
      this.pokemon.bossSegments = 5;
      this.pokemon.bossSegmentIndex = 4;
      this.pokemon.initBattleInfo();
      this.pokemon.cry();

      const movePhase = globalScene.phaseManager.findPhase<MovePhase>(
        (p) => p.is<MovePhase>(PhaseId.MOVE) && p.pokemon === this.pokemon,
      );
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
}
