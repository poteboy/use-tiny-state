export declare function useTinyState<T>(makeState: MakeState): T[];
export declare function makeState<T>(arg: T): {
    key: symbol;
    set: (arg: T, callback?: () => void) => void;
};
declare type MakeState = ReturnType<typeof makeState<any>>;
export {};
