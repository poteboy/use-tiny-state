import { useState, useEffect } from "react";
import { TinyEmitter } from "tiny-emitter";
const emitter = new TinyEmitter();
const EventBus = {
    $emit: (unique) => emitter.emit(unique),
    $on: (unique, callback) => emitter.on(unique, callback),
};
class ProxyMap extends Map {
    get(key) {
        return super.get(key);
    }
    set(key, value) {
        const returnValue = super.set(key, value);
        EventBus.$emit(key);
        return returnValue;
    }
}
const tinyState = new ProxyMap();
export function useTinyState(makeState) {
    const [state, setState] = useState(tinyState.get(makeState.key));
    useEffect(() => {
        EventBus.$on(makeState.key, () => {
            setState(tinyState.get(makeState.key));
        });
    }, []);
    return [state];
}
export function makeState(arg) {
    const unique = Symbol();
    tinyState.set(unique, arg);
    return {
        key: unique,
        set: (arg, callback) => {
            tinyState.set(unique, arg);
            if (callback)
                return callback();
        },
    };
}
