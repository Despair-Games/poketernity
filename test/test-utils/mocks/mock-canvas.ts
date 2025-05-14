import { mockContext } from "#test/test-utils/mocks/mock-context";

/**
 * A minimal stub object to mock HTMLCanvasElement
 */
export const mockCanvas: any = {
  width: 0,
  getContext() {
    return mockContext;
  },
};
