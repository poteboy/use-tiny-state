"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeState = exports.useTinyState = void 0;
const react_1 = require("react");
const tiny_emitter_1 = require("tiny-emitter");
const emitter = new tiny_emitter_1.TinyEmitter();
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
function useTinyState(makeState) {
    const [state, setState] = (0, react_1.useState)(tinyState.get(makeState.key));
    (0, react_1.useEffect)(() => {
        EventBus.$on(makeState.key, () => {
            setState(tinyState.get(makeState.key));
        });
    }, []);
    return [state];
}
exports.useTinyState = useTinyState;
function makeState(arg) {
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
exports.makeState = makeState;
