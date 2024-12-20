import { getTypeRgb } from "#app/data/type";
import { sin, cos } from "#app/field/anims";
import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type FormChangeSceneHandler from "#app/ui/form-change-scene-handler";
import { Mode } from "#app/ui/ui";
import { getFrameMs, randInt } from "#app/utils";

/**
 * A base phase for handling Pokemon form changes, including evolutions
 * @extends Phase
 */
export abstract class FormChangeBasePhase extends Phase {
  protected pokemon: PlayerPokemon;

  protected handler: FormChangeSceneHandler;

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
    return globalScene.ui.setModeForceTransition(Mode.FORM_CHANGE_SCENE);
  }

  public override start() {
    super.start();

    this.setMode().then(() => {
      if (!this.validate()) {
        return this.end();
      }

      globalScene.fadeOutBgm(undefined, false);

      this.handler = globalScene.ui.getHandler() as FormChangeSceneHandler;

      this.container = this.handler.container;

      this.baseBgImg = globalScene.add.image(0, 0, "default_bg");
      this.baseBgImg.setOrigin(0, 0);
      this.container.add(this.baseBgImg);

      this.bgVideo = globalScene.add.video(0, 0, "evo_bg").stop();
      this.bgVideo.setOrigin(0, 0);
      this.bgVideo.setScale(0.4359673025);
      this.bgVideo.setVisible(false);
      this.container.add(this.bgVideo);

      this.bgOverlay = globalScene.add.rectangle(
        0,
        0,
        globalScene.game.canvas.width / 6,
        globalScene.game.canvas.height / 6,
        0x262626,
      );
      this.bgOverlay.setOrigin(0, 0);
      this.bgOverlay.setAlpha(0);
      this.container.add(this.bgOverlay);

      const getPokemonSprite = () => {
        const ret = globalScene.addPokemonSprite(
          this.pokemon,
          this.baseBgImg.displayWidth / 2,
          this.baseBgImg.displayHeight / 2,
          "pkmn__sub",
        );
        ret.setPipeline(globalScene.spritePipeline, { tone: [0.0, 0.0, 0.0, 0.0], ignoreTimeTint: true });
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

      this.overlay = globalScene.add.rectangle(
        0,
        -globalScene.game.canvas.height / 6,
        globalScene.game.canvas.width / 6,
        globalScene.game.canvas.height / 6 - 48,
        0xffffff,
      );
      this.overlay.setOrigin(0, 0);
      this.overlay.setAlpha(0);
      globalScene.ui.add(this.overlay);

      [this.pokemonSprite, this.pokemonTintSprite, this.pokemonNewFormSprite, this.pokemonNewFormTintSprite].map(
        (sprite) => {
          const spriteKey = this.pokemon.getSpriteKey(true);
          try {
            sprite.play(spriteKey);
          } catch (err: unknown) {
            console.error(`Failed to play animation for ${spriteKey}`, err);
          }

          sprite.setPipeline(globalScene.spritePipeline, {
            tone: [0.0, 0.0, 0.0, 0.0],
            hasShadow: false,
            teraColor: getTypeRgb(this.pokemon.getTeraType()),
          });
          sprite.setPipelineData("ignoreTimeTint", true);
          sprite.setPipelineData("spriteKey", this.pokemon.getSpriteKey());
          sprite.setPipelineData("shiny", this.pokemon.shiny);
          sprite.setPipelineData("variant", this.pokemon.variant);
          ["spriteColors", "fusionSpriteColors"].map((k) => {
            if (this.pokemon.summonData?.speciesForm) {
              k += "Base";
            }
            sprite.pipelineData[k] = this.pokemon.getSprite().pipelineData[k];
          });
        },
      );
      this.doFormChange();
    });
  }

  public doSpiralUpward() {
    let f = 0;

    globalScene.tweens.addCounter({
      repeat: 64,
      duration: getFrameMs(1),
      onRepeat: () => {
        if (f < 64) {
          if (!(f & 7)) {
            for (let i = 0; i < 4; i++) {
              this.doSpiralUpwardParticle((f & 120) * 2 + i * 64);
            }
          }
          f++;
        }
      },
    });
  }

  public doSpiralUpwardParticle(trigIndex: integer) {
    const initialX = this.baseBgImg.displayWidth / 2;
    const particle = globalScene.add.image(initialX, 0, "evo_sparkle");
    this.container.add(particle);

    let f = 0;
    let amp = 48;

    const particleTimer = globalScene.tweens.addCounter({
      repeat: -1,
      duration: getFrameMs(1),
      onRepeat: () => {
        updateParticle();
      },
    });

    const updateParticle = () => {
      if (!f || particle.y > 8) {
        particle.setPosition(initialX, 88 - (f * f) / 80);
        particle.y += sin(trigIndex, amp) / 4;
        particle.x += cos(trigIndex, amp);
        particle.setScale(1 - f / 80);
        trigIndex += 4;
        if (f & 1) {
          amp--;
        }
        f++;
      } else {
        particle.destroy();
        particleTimer.remove();
      }
    };

    updateParticle();
  }

  public doArcDownward() {
    let f = 0;

    globalScene.tweens.addCounter({
      repeat: 96,
      duration: getFrameMs(1),
      onRepeat: () => {
        if (f < 96) {
          if (f < 6) {
            for (let i = 0; i < 9; i++) {
              this.doArcDownParticle(i * 16);
            }
          }
          f++;
        }
      },
    });
  }

  public doArcDownParticle(trigIndex: integer) {
    const initialX = this.baseBgImg.displayWidth / 2;
    const particle = globalScene.add.image(initialX, 0, "evo_sparkle");
    particle.setScale(0.5);
    this.container.add(particle);

    let f = 0;
    let amp = 8;

    const particleTimer = globalScene.tweens.addCounter({
      repeat: -1,
      duration: getFrameMs(1),
      onRepeat: () => {
        updateParticle();
      },
    });

    const updateParticle = () => {
      if (!f || particle.y < 88) {
        particle.setPosition(initialX, 8 + (f * f) / 5);
        particle.y += sin(trigIndex, amp) / 4;
        particle.x += cos(trigIndex, amp);
        amp = 8 + sin(f * 4, 40);
        f++;
      } else {
        particle.destroy();
        particleTimer.remove();
      }
    };

    updateParticle();
  }

  public doCycle(l: number, lastCycle: integer = 15): Promise<boolean> {
    return new Promise((resolve) => {
      const isLastCycle = l === lastCycle;
      globalScene.tweens.add({
        targets: this.pokemonTintSprite,
        scale: 0.25,
        ease: "Cubic.easeInOut",
        duration: 500 / l,
        yoyo: !isLastCycle,
      });
      globalScene.tweens.add({
        targets: this.pokemonNewFormTintSprite,
        scale: 1,
        ease: "Cubic.easeInOut",
        duration: 500 / l,
        yoyo: !isLastCycle,
        onComplete: () => {
          if (this.handler.cancelled) {
            return resolve(false);
          }
          if (l < lastCycle) {
            this.doCycle(l + 0.5, lastCycle).then((success) => resolve(success));
          } else {
            this.pokemonTintSprite.setVisible(false);
            resolve(true);
          }
        },
      });
    });
  }

  public doCircleInward() {
    let f = 0;

    globalScene.tweens.addCounter({
      repeat: 48,
      duration: getFrameMs(1),
      onRepeat: () => {
        if (!f) {
          for (let i = 0; i < 16; i++) {
            this.doCircleInwardParticle(i * 16, 4);
          }
        } else if (f === 32) {
          for (let i = 0; i < 16; i++) {
            this.doCircleInwardParticle(i * 16, 8);
          }
        }
        f++;
      },
    });
  }

  public doCircleInwardParticle(trigIndex: integer, speed: integer) {
    const initialX = this.baseBgImg.displayWidth / 2;
    const initialY = this.baseBgImg.displayHeight / 2;
    const particle = globalScene.add.image(initialX, initialY, "evo_sparkle");
    this.container.add(particle);

    let amp = 120;

    const particleTimer = globalScene.tweens.addCounter({
      repeat: -1,
      duration: getFrameMs(1),
      onRepeat: () => {
        updateParticle();
      },
    });

    const updateParticle = () => {
      if (amp > 8) {
        particle.setPosition(initialX, initialY);
        particle.y += sin(trigIndex, amp);
        particle.x += cos(trigIndex, amp);
        amp -= speed;
        trigIndex += 4;
      } else {
        particle.destroy();
        particleTimer.remove();
      }
    };

    updateParticle();
  }

  public doSpray() {
    let f = 0;

    globalScene.tweens.addCounter({
      repeat: 48,
      duration: getFrameMs(1),
      onRepeat: () => {
        if (!f) {
          for (let i = 0; i < 8; i++) {
            this.doSprayParticle(i);
          }
        } else if (f < 50) {
          this.doSprayParticle(randInt(8));
        }
        f++;
      },
    });
  }

  public doSprayParticle(trigIndex: integer) {
    const initialX = this.baseBgImg.displayWidth / 2;
    const initialY = this.baseBgImg.displayHeight / 2;
    const particle = globalScene.add.image(initialX, initialY, "evo_sparkle");
    this.container.add(particle);

    let f = 0;
    let yOffset = 0;
    const speed = 3 - randInt(8);
    const amp = 48 + randInt(64);

    const particleTimer = globalScene.tweens.addCounter({
      repeat: -1,
      duration: getFrameMs(1),
      onRepeat: () => {
        updateParticle();
      },
    });

    const updateParticle = () => {
      if (!(f & 3)) {
        yOffset++;
      }
      if (trigIndex < 128) {
        particle.setPosition(initialX + (speed * f) / 3, initialY + yOffset);
        particle.y += -sin(trigIndex, amp);
        if (f > 108) {
          particle.setScale(1 - (f - 108) / 20);
        }
        trigIndex++;
        f++;
      } else {
        particle.destroy();
        particleTimer.remove();
      }
    };

    updateParticle();
  }
}
