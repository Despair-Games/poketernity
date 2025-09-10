import { MockContainer } from "#test/test-utils/mocks/mocks-container/mock-container";

export class MockNineslice extends MockContainer {
  private readonly texture;
  private readonly leftWidth;
  private readonly rightWidth;
  private readonly topHeight;
  private readonly bottomHeight;

  constructor(textureManager, x, y, texture, frame, _width, _height, leftWidth, rightWidth, topHeight, bottomHeight) {
    super(textureManager, x, y);
    this.texture = texture;
    this.frame = frame;
    this.leftWidth = leftWidth;
    this.rightWidth = rightWidth;
    this.topHeight = topHeight;
    this.bottomHeight = bottomHeight;
  }
}
