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

export function useTinyState<T>(tinyVar: TinyVar<T>) {
  const [state, setState] = useState<T>(tinyState.get(tinyVar.key));

  useEffect(() => {
    EventBus.$on(tinyVar.key, () => {
      setState(tinyState.get(tinyVar.key));
    });
  }, []);

  return [state];
}

interface TinyVar<T> {
  readonly key: symbol;
  get: () => T;
  (newVal: T, callback?: (newVal: T) => void): void;
  reset: (callback?: (initialValue: T) => void) => T;
}

export function makeState<T>(arg: T): TinyVar<T> {
  const unique: unique symbol = Symbol();
  tinyState.set(unique, arg);

  // setter function which also takes a callback as an optional argument
  let tv: any = function (newVal: T, callback: (newVal: T) => void) {
    tinyState.set(unique, newVal);
    if (callback) return callback(newVal);
  };
  tv.key = unique;

  // get a current value
  tv.get = () => tinyState.get(unique) as T;

  // retrieve an initial value
  tv.reset = (callback?: (initialValue: T) => void) => {
    tinyState.set(unique, arg);
    if (callback) return callback(arg);
  };

  return tv as TinyVar<T>;
}
