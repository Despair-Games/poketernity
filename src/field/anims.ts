import BattleScene from "#app/battle-scene";
import { PokeballType } from "#enums/pokeball";
import { Variant } from "#app/data/variant";
import { getFrameMs, randGauss } from "#app/utils";
import { settings } from "#app/data/settings/settings-manager";

export function addPokeballOpenParticles(scene: BattleScene, x: number, y: number, pokeballType: PokeballType): void {
  switch (pokeballType) {
    case PokeballType.POKEBALL:
      doDefaultPbOpenParticles(scene, x, y, 48);
      break;
    case PokeballType.GREAT_BALL:
      doDefaultPbOpenParticles(scene, x, y, 96);
      break;
    case PokeballType.ULTRA_BALL:
      doUbOpenParticles(scene, x, y, 8);
      break;
    case PokeballType.ROGUE_BALL:
      doUbOpenParticles(scene, x, y, 10);
      break;
    case PokeballType.MASTER_BALL:
      doMbOpenParticles(scene, x, y);
      break;
  }
}

function doDefaultPbOpenParticles(scene: BattleScene, x: number, y: number, radius: number) {
  const pbOpenParticlesFrameNames = scene.anims.generateFrameNames("pb_particles", {
    start: 0,
    end: 3,
    suffix: ".png",
  });
  if (!scene.anims.exists("pb_open_particle")) {
    scene.anims.create({
      key: "pb_open_particle",
      frames: pbOpenParticlesFrameNames,
      frameRate: 16,
      repeat: -1,
    });
  }

  const addParticle = (index: integer) => {
    const { gameSpeed } = settings.general;

    const particle = scene.add.sprite(x, y, "pb_open_particle");
    scene.field.add(particle);
    const angle = index * 45;
    const [xCoord, yCoord] = [radius * Math.cos((angle * Math.PI) / 180), radius * Math.sin((angle * Math.PI) / 180)];
    scene.tweens.add({
      targets: particle,
      x: x + xCoord,
      y: y + yCoord,
      duration: 575,
    });
    particle.play({
      key: "pb_open_particle",
      startFrame: (index + 3) % 4,
      frameRate: Math.floor(16 * gameSpeed),
    });
    scene.tweens.add({
      targets: particle,
      delay: 500,
      duration: 75,
      alpha: 0,
      ease: "Sine.easeIn",
      onComplete: () => particle.destroy(),
    });
  };

  let particleCount = 0;
  scene.time.addEvent({
    delay: 20,
    repeat: 16,
    callback: () => addParticle(++particleCount),
  });
}

function doUbOpenParticles(scene: BattleScene, x: number, y: number, frameIndex: integer) {
  const particles: Phaser.GameObjects.Image[] = [];
  for (let i = 0; i < 10; i++) {
    particles.push(doFanOutParticle(scene, i * 25, x, y, 1, 1, 5, frameIndex));
  }

  scene.tweens.add({
    targets: particles,
    delay: 750,
    duration: 250,
    alpha: 0,
    ease: "Sine.easeIn",
    onComplete: () => {
      for (const particle of particles) {
        particle.destroy();
      }
    },
  });
}

function doMbOpenParticles(scene: BattleScene, x: number, y: number) {
  const particles: Phaser.GameObjects.Image[] = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 8; i++) {
      particles.push(doFanOutParticle(scene, i * 32, x, y, j ? 1 : 2, j ? 2 : 1, 8, 4));
    }

    scene.tweens.add({
      targets: particles,
      delay: 750,
      duration: 250,
      alpha: 0,
      ease: "Sine.easeIn",
      onComplete: () => {
        for (const particle of particles) {
          particle.destroy();
        }
      },
    });
  }
}

function doFanOutParticle(
  scene: BattleScene,
  trigIndex: integer,
  x: integer,
  y: integer,
  xSpeed: integer,
  ySpeed: integer,
  angle: integer,
  frameIndex: integer,
): Phaser.GameObjects.Image {
  let f = 0;

  const particle = scene.add.image(x, y, "pb_particles", `${frameIndex}.png`);
  scene.field.add(particle);

  const updateParticle = () => {
    if (!particle.scene) {
      return particleTimer.remove();
    }
    particle.x = x + sin(trigIndex, f * xSpeed);
    particle.y = y + cos(trigIndex, f * ySpeed);
    trigIndex = trigIndex + angle;
    f++;
  };

  const particleTimer = scene.tweens.addCounter({
    repeat: -1,
    duration: getFrameMs(1),
    onRepeat: () => {
      updateParticle();
    },
  });

  return particle;
}

export function addPokeballCaptureStars(scene: BattleScene, pokeball: Phaser.GameObjects.Sprite): void {
  const addParticle = () => {
    const particle = scene.add.sprite(pokeball.x, pokeball.y, "pb_particles", "4.png");
    particle.setOrigin(pokeball.originX, pokeball.originY);
    particle.setAlpha(0.5);
    scene.field.add(particle);

    scene.tweens.add({
      targets: particle,
      y: pokeball.y - 10,
      ease: "Sine.easeOut",
      duration: 250,
      onComplete: () => {
        scene.tweens.add({
          targets: particle,
          y: pokeball.y,
          alpha: 0,
          ease: "Sine.easeIn",
          duration: 250,
        });
      },
    });

    const dist = randGauss(25);
    scene.tweens.add({
      targets: particle,
      x: pokeball.x + dist,
      duration: 500,
    });

    scene.tweens.add({
      targets: particle,
      alpha: 0,
      delay: 425,
      duration: 75,
      onComplete: () => particle.destroy(),
    });
  };

  new Array(3).fill(null).map(() => addParticle());
}

export function sin(index: integer, amplitude: integer): number {
  return amplitude * Math.sin(index * (Math.PI / 128));
}

export function cos(index: integer, amplitude: integer): number {
  return amplitude * Math.cos(index * (Math.PI / 128));
}

/**
 * Play the shiny sparkle animation and sound effect for the given sprite
 * First ensures that the animation has been properly initialized
 * @param sparkleSprite the Sprite to play the animation on
 * @param variant which shiny {@linkcode variant} to play the animation for
 */
export function doShinySparkleAnim(scene: BattleScene, sparkleSprite: Phaser.GameObjects.Sprite, variant: Variant) {
  const keySuffix = variant ? `_${variant + 1}` : "";
  const spriteKey = `shiny${keySuffix}`;
  const animationKey = `sparkle${keySuffix}`;

  // Make sure the animation exists, and create it if not
  if (!scene.anims.exists(animationKey)) {
    const frameNames = scene.anims.generateFrameNames(spriteKey, { suffix: ".png", end: 34 });
    scene.anims.create({
      key: `sparkle${keySuffix}`,
      frames: frameNames,
      frameRate: 32,
      showOnStart: true,
      hideOnComplete: true,
    });
  }

  // Play the animation
  sparkleSprite.play(animationKey);
  scene.playSound("se/sparkle");
}
