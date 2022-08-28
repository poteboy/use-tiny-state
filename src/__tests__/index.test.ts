import { renderHook, act, RenderResult } from "@testing-library/react-hooks";
import { makeState, useTinyState } from "../index";

describe("useTinyState", () => {
  const initialValue = 0;
  const state = makeState(initialValue);

  let result: RenderResult<unknown[]>;
  beforeEach(() => {
    result = renderHook(() => useTinyState(state)).result;
  });
  afterEach(() => {
    state(initialValue);
  });

  test("initial returnred value of useTinyState is initial arg", () => {
    expect(result.current[0]).toBe(initialValue);
  });

  test("state is updated when setter function is called", () => {
    expect(result.current[0]).toBe(initialValue);
    state(initialValue + 1);
    expect(result.current[0]).toBe(initialValue + 1);
  });

  test("state value and original value is always sync", () => {
    expect(result.current[0]).toBe(state.get());
    state(initialValue + 1);
    expect(result.current[0]).toBe(state.get());
  });
});
