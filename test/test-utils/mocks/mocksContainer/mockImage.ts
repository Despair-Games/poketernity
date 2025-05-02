import { MockContainer } from "#test/test-utils/mocks/mocksContainer/mockContainer";

export class MockImage extends MockContainer {
  private texture;

  constructor(textureManager, x, y, texture) {
    super(textureManager, x, y);
    this.texture = texture;
  }
}
