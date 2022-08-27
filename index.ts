import { useState, useEffect } from "react";
import { TinyEmitter } from "tiny-emitter";

const emitter = new TinyEmitter();

const EventBus = {
  $emit: (unique: symbol) => emitter.emit(unique as any),
  $on: (unique: symbol, callback: () => void) =>
    emitter.on(unique as any, callback),
};

class ProxyMap extends Map<symbol, any> {
  get(key: symbol) {
    return super.get(key);
  }
  set(key: symbol, value: any) {
    const returnValue = super.set(key, value);
    EventBus.$emit(key);
    return returnValue;
  }
}

const tinyState = new ProxyMap();

export function useTinyState<T>(unique: symbol) {
  const [state, setState] = useState<T>(tinyState.get(unique));

  useEffect(() => {
    EventBus.$on(unique, () => {
      setState(tinyState.get(unique));
    });
  }, []);

  return [state];
}

export function makeState<T>(arg: T) {
  const unique: unique symbol = Symbol();
  tinyState.set(unique, arg);
  return {
    key: unique,
    setter: (arg: T, callback?: () => void) => {
      tinyState.set(unique, arg);
      EventBus.$emit(unique);
      if (callback) return callback();
    },
  };
}
