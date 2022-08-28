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
export function useTinyState(tinyVar) {
    const [state, setState] = useState(tinyState.get(tinyVar.key));
    useEffect(() => {
        EventBus.$on(tinyVar.key, () => {
            setState(tinyState.get(tinyVar.key));
        });
    }, []);
    return [state];
}
export function makeState(arg) {
    const unique = Symbol();
    tinyState.set(unique, arg);
    let tv = function (newVal, callback) {
        tinyState.set(unique, newVal);
        if (callback)
            return callback(newVal);
    };
    tv.key = unique;
    tv.get = () => tinyState.get(unique);
    return tv;
}
