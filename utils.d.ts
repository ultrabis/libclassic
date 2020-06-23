declare const _default: {
    getEnumKeyByEnumValue: (myEnum: any, enumValue: string | number) => string;
    cumulativeChance: (trials: number, chance: number, x: number) => number;
    consecutiveChance: (trials: number, chance: number, x: number) => number;
    triangularNumber: (n: number) => number;
    roundedString: (num: number, decimals: number) => string;
    isNode: boolean;
    isBrowser: boolean;
    isWebWorker: boolean;
    isMobile: () => boolean;
    cloneObject: (o: any) => any;
    isLetter: (char: string) => boolean;
    capitalize: (s: string) => string;
    encodeURI: (str: string) => string;
    decodeURI: (str: string) => string;
    paramFromURL: (paramName: string, URL?: string | undefined) => string | null;
};
export default _default;
