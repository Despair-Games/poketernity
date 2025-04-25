import "phaser";

declare module "phaser" {
  namespace GameObjects {
    interface GameObject {
      width: number;

      height: number;

      originX: number;

      originY: number;

      x: number;

      y: number;
    }

    interface Container {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
    interface Sprite {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
    interface Image {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
    interface NineSlice {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
    interface Text {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
    interface Rectangle {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode T}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }
  }

  namespace Input {
    namespace Gamepad {
      interface GamepadPlugin {
        /**
         * Refreshes the list of connected Gamepads.
         * This is called automatically when a gamepad is connected or disconnected, and during the update loop.
         */
        refreshPads(): void;
      }
    }
  }

  namespace Tweens {
    interface Tween {
      getValue(index?: number): number | null;
    }
  }
}
