export declare function useTinyState<T>(tinyVar: TinyVar<T>): T[];
interface TinyVar<T> {
    readonly key: symbol;
    get: () => T;
    (newVal: T, callback?: (newVal: T) => void): void;
    reset: (callback?: (initialValue: T) => void) => T;
}
export declare function makeState<T>(arg: T): TinyVar<T>;
export {};
//# sourceMappingURL=index.d.ts.map