import "phaser";

declare module "phaser" {
  namespace GameObjects {
    interface GameObject {
      /**
       * Searches for the first instance of a child with its `type` property matching the given argument.
       * Should more than one child have the same type only the first is returned.
       * @param type - The type to search for
       * @returns The first instance with the given type (as {@linkcode T}), or `null`
       */
      getByType<T extends Phaser.GameObjects.GameObject>(type: string): T | null;
    }

    interface Container {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.Container}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }

    interface Sprite {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.Sprite}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }

    interface Image {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.Image}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }

    interface NineSlice {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.NineSlice}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }

    interface Text {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.Text}
       */
      setPositionRelative(guideObject: any, x: number, y: number): this;
    }

    interface Rectangle {
      /**
       * Positions this object relative to the {@linkcode guideObject}.
       * @param guideObject - The object to base the position off of
       * @param x - The relative x position
       * @param y - The relative y position
       * @returns The positioned instance of {@linkcode Phaser.GameObjects.Rectangle}
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
}
