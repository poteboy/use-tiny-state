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
function useTinyState(unique) {
    const [state, setState] = (0, react_1.useState)(tinyState.get(unique));
    (0, react_1.useEffect)(() => {
        EventBus.$on(unique, () => {
            setState(tinyState.get(unique));
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
        setter: (arg) => {
            tinyState.set(unique, arg);
            EventBus.$emit(unique);
        },
    };
}
exports.makeState = makeState;
