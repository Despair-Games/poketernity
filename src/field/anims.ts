import { gScene } from "#app/battle-scene";
import { PokeballType } from "../data/pokeball";
import * as Utils from "../utils";

export function addPokeballOpenParticles(x: number, y: number, pokeballType: PokeballType): void {
  switch (pokeballType) {
    case PokeballType.POKEBALL:
      doDefaultPbOpenParticles(x, y, 48);
      break;
    case PokeballType.GREAT_BALL:
      doDefaultPbOpenParticles(x, y, 96);
      break;
    case PokeballType.ULTRA_BALL:
      doUbOpenParticles(x, y, 8);
      break;
    case PokeballType.ROGUE_BALL:
      doUbOpenParticles(x, y, 10);
      break;
    case PokeballType.MASTER_BALL:
      doMbOpenParticles(x, y);
      break;
  }
}

function doDefaultPbOpenParticles(x: number, y: number, radius: number) {
  const pbOpenParticlesFrameNames = gScene.anims.generateFrameNames("pb_particles", { start: 0, end: 3, suffix: ".png" });
  if (!(gScene.anims.exists("pb_open_particle"))) {
    gScene.anims.create({
      key: "pb_open_particle",
      frames: pbOpenParticlesFrameNames,
      frameRate: 16,
      repeat: -1
    });
  }

  const addParticle = (index: integer) => {
    const particle = gScene.add.sprite(x, y, "pb_open_particle");
    gScene.field.add(particle);
    const angle = index * 45;
    const [ xCoord, yCoord ] = [ radius * Math.cos(angle * Math.PI / 180), radius * Math.sin(angle * Math.PI / 180) ];
    gScene.tweens.add({
      targets: particle,
      x: x + xCoord,
      y: y + yCoord,
      duration: 575
    });
    particle.play({
      key: "pb_open_particle",
      startFrame: (index + 3) % 4,
      frameRate: Math.floor(16 * gScene.gameSpeed)
    });
    gScene.tweens.add({
      targets: particle,
      delay: 500,
      duration: 75,
      alpha: 0,
      ease: "Sine.easeIn",
      onComplete: () => particle.destroy()
    });
  };

  let particleCount = 0;
  gScene.time.addEvent({
    delay: 20,
    repeat: 16,
    callback: () => addParticle(++particleCount)
  });
}

function doUbOpenParticles(x: number, y: number, frameIndex: integer) {
  const particles: Phaser.GameObjects.Image[] = [];
  for (let i = 0; i < 10; i++) {
    particles.push(doFanOutParticle(i * 25, x, y, 1, 1, 5, frameIndex));
  }

  gScene.tweens.add({
    targets: particles,
    delay: 750,
    duration: 250,
    alpha: 0,
    ease: "Sine.easeIn",
    onComplete: () => {
      for (const particle of particles) {
        particle.destroy();
      }
    }
  });
}

function doMbOpenParticles(x: number, y: number) {
  const particles: Phaser.GameObjects.Image[] = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 8; i++) {
      particles.push(doFanOutParticle(i * 32, x, y, j ? 1 : 2, j ? 2 : 1, 8, 4));
    }

    gScene.tweens.add({
      targets: particles,
      delay: 750,
      duration: 250,
      alpha: 0,
      ease: "Sine.easeIn",
      onComplete: () => {
        for (const particle of particles) {
          particle.destroy();
        }
      }
    });
  }
}

function doFanOutParticle(trigIndex: integer, x: integer, y: integer, xSpeed: integer, ySpeed: integer, angle: integer, frameIndex: integer): Phaser.GameObjects.Image {
  let f = 0;

  const particle = gScene.add.image(x, y, "pb_particles", `${frameIndex}.png`);
  gScene.field.add(particle);

  const updateParticle = () => {
    if (!particle.scene) {
      return particleTimer.remove();
    }
    particle.x = x + sin(trigIndex, f * xSpeed);
    particle.y = y + cos(trigIndex, f * ySpeed);
    trigIndex = (trigIndex + angle);
    f++;
  };

  const particleTimer = gScene.tweens.addCounter({
    repeat: -1,
    duration: Utils.getFrameMs(1),
    onRepeat: () => {
      updateParticle();
    }
  });

  return particle;
}

export function addPokeballCaptureStars(pokeball: Phaser.GameObjects.Sprite): void {
  const addParticle = () => {
    const particle = gScene.add.sprite(pokeball.x, pokeball.y, "pb_particles", "4.png");
    particle.setOrigin(pokeball.originX, pokeball.originY);
    particle.setAlpha(0.5);
    gScene.field.add(particle);

    gScene.tweens.add({
      targets: particle,
      y: pokeball.y - 10,
      ease: "Sine.easeOut",
      duration: 250,
      onComplete: () => {
        gScene.tweens.add({
          targets: particle,
          y: pokeball.y,
          alpha: 0,
          ease: "Sine.easeIn",
          duration: 250
        });
      }
    });

    const dist = Utils.randGauss(25);
    gScene.tweens.add({
      targets: particle,
      x: pokeball.x + dist,
      duration: 500
    });

    gScene.tweens.add({
      targets: particle,
      alpha: 0,
      delay: 425,
      duration: 75,
      onComplete: () => particle.destroy()
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
