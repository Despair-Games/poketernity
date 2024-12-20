import type { MockTextureManager } from "#test/testUtils/mocks/mockTextureManager";
import type { MockGameObject } from "#test/testUtils/mocks/mockGameObject";

/**
 * Stub for Phaser.Textures.Texture object
 * Just mocks the function calls and data required for use in tests
 */
export class MockTexture implements MockGameObject {
  public manager: MockTextureManager;
  public key: string;
  public source;
  public frames: object;
  public firstFrame: string;
  public name: string;

  constructor(manager, key: string, source) {
    this.manager = manager;
    this.key = key;
    this.source = source;

    const mockFrame = {
      width: 100,
      height: 100,
      cutX: 0,
      cutY: 0,
    };
    this.frames = {
      firstFrame: mockFrame,
      0: mockFrame,
      1: mockFrame,
      2: mockFrame,
      3: mockFrame,
      4: mockFrame,
    };
    this.firstFrame = "firstFrame";
  }

  /** Mocks the function call that gets an HTMLImageElement, see {@link Pokemon.updateFusionPalette} */
  getSourceImage() {
    return null;
  }
}