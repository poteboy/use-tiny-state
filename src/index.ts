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
  (newVal?: T, callback?: () => void): void;
}

export function makeState<T>(arg: T): TinyVar<T> {
  const unique: unique symbol = Symbol();
  tinyState.set(unique, arg);

  let tv: any = function (newVal: T, callback: () => void) {
    tinyState.set(unique, newVal);
    if (callback) return callback();
  };
  tv.key = unique;
  tv.get = () => tinyState.get(unique) as T;

  return tv as TinyVar<T>;
}
