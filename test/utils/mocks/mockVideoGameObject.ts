import type { MockGameObject } from "#test/utils/mocks/mockGameObject";

/** Mocks video-related stuff */
export class MockVideoGameObject implements MockGameObject {
  public name: string;

  constructor() {}

  public play = () => null;
  public stop = () => this;
  public setOrigin = () => null;
  public setScale = () => null;
  public setVisible = () => null;
  public setLoop = () => null;
}
