import { SemiInvulnerableTag } from "#app/data/battler-tags";
import { getSpeciesFormChangeMessage, type SpeciesFormChange } from "#app/data/pokemon-forms";
import { getTypeRgb } from "#app/data/type";
import { EnemyPokemon, type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BattlePhase } from "./abstract-battle-phase";
import { MovePhase } from "./move-phase";
import { PokemonHealPhase } from "./pokemon-heal-phase";

export class QuietFormChangePhase extends BattlePhase {
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

    if (!this.pokemon.isOnField() || this.pokemon.getTag(SemiInvulnerableTag) || this.pokemon.isFainted()) {
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
      try {
        sprite.play(spriteKey).stop();
      } catch (err: unknown) {
        console.error(`Failed to play animation for ${spriteKey}`, err);
      }

      sprite.setPipeline(spritePipeline, {
        tone: [0.0, 0.0, 0.0, 0.0],
        hasShadow: false,
        teraColor: getTypeRgb(this.pokemon.getTeraType()),
      });

      ["spriteColors", "fusionSpriteColors"].map((k) => {
        if (this.pokemon.summonData?.speciesForm) {
          k += "Base";
        }
        sprite.pipelineData[k] = this.pokemon.getSprite().pipelineData[k];
      });

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

    globalScene.playSound("battle_anims/PRSFX- Transform");

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
          try {
            pokemonFormTintSprite.play(spriteKey).stop();
          } catch (err: unknown) {
            console.error(`Failed to play animation for ${spriteKey}`, err);
          }

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

    if (globalScene?.currentBattle.isClassicFinalBoss && this.pokemon instanceof EnemyPokemon) {
      globalScene.playBgm();
      globalScene.unshiftPhase(
        new PokemonHealPhase(this.pokemon.getBattlerIndex(), this.pokemon.getMaxHp(), {
          showFullHpMessage: false,
          healStatus: true,
        }),
      );

      this.pokemon.findAndRemoveTags(() => true);
      this.pokemon.bossSegments = 5;
      this.pokemon.bossSegmentIndex = 4;
      this.pokemon.initBattleInfo();
      this.pokemon.cry();

      const movePhase = globalScene.findPhase((p) => p instanceof MovePhase && p.pokemon === this.pokemon) as MovePhase;
      if (movePhase) {
        movePhase.cancel();
      }
    }

    super.end();
  }
}
