declare enum ManaReturn {
    Invalid = 0,
    Innervate = 1,
    Evocation = 2,
    MajorManaPot = 3,
    DemonicRune = 4,
    ManaGem = 5
}
declare enum ManaReturnMage {
    Evocation = 0,
    MajorManaPot = 1,
    DemonicRune = 2,
    ManaGem = 3
}
declare const _default: {
    ManaReturn: typeof ManaReturn;
    ManaReturnMage: typeof ManaReturnMage;
};
export default _default;
