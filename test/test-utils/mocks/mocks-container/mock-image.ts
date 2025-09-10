import { MockContainer } from "#test/test-utils/mocks/mocks-container/mock-container";

export class MockImage extends MockContainer {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: intentional?
  private readonly texture;

  constructor(textureManager, x, y, texture) {
    super(textureManager, x, y);
    this.texture = texture;
  }
}
