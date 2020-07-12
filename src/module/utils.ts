/* Utility functions that have nothing to do with world of warcraft */

// import stats from 'statsjs'
// import mathjs from 'mathjs/dist/math'
import clonedeep from 'lodash.clonedeep'

const paramFromURL = (paramName: string, URL?: string): string | null => {
  const urlSearchParams = new URLSearchParams(URL ? URL : window.location.search.substring(1))
  return urlSearchParams.get(paramName.toLowerCase())
}

const encodeURI = (str: string): string => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const decodeURI = (str: string): string => {
  str = (str + '===').slice(0, str.length + (str.length % 4))
  return str.replace(/-/g, '+').replace(/_/g, '/')
}

const isMobile = (): boolean => {
  const mql = window.matchMedia('(max-width: 768px)')
  if (!mql.matches) {
    return true
  }

  return false
}

const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined'

/* eslint-disable no-restricted-globals */
const isWebWorker: boolean =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'

/* eslint-enable no-restricted-globals */
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

/* strips chars for easier comparisons */
const fuzzyTextFromString = (s: string): string => {
  return s
    .replace(/ /g, '')
    .replace(/-/g, '')
    .replace(/'/g, '')
    .replace(/:/g, '')
    .replace(/\./g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/%/g, '')
    .toUpperCase()
}

const fuzzyIncludes = (haystack: string, needle: string): boolean => {
  return fuzzyTextFromString(haystack).includes(fuzzyTextFromString(needle))
}

// FIXME:
const sanitizeStringForEnum = (s: string): string => {
  return fuzzyTextFromString(s)
}

const getAllEnumKeys = (enumType: object): string[] => Object.keys(enumType).filter((key) => isNaN(Number(key)))
const getAllEnumValues = (enumType: object): number[] => exports.getAllEnumKeys(enumType).map((key) => enumType[key])

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getEnumKeyByEnumValue = (myEnum: any, enumValue: number | string): string => {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue)
  return keys.length > 0 ? keys[0] : ''
}

/* Find enum value by a fuzzy text search of it's key. Comparisons are sanitized to ignore
   invalid characters, case and whitespace. If an 'exact' match is found, return it. Otherwise
   try to find the key name anywhere in the text */
const getEnumValueFromFuzzyText = (myEnum: any, fuzzyText: string, exact?: boolean): number | string => {
  const keys = Object.keys(myEnum)
  let partialMatch = undefined

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = myEnum[key]
    const sanKey = sanitizeStringForEnum(key)
    const sanText = sanitizeStringForEnum(fuzzyText)

    /* an exact match */
    if (sanKey === sanText) {
      return value
    }

    /* a match, somewhere in the string */
    if (!exact && sanText.includes(sanKey)) {
      partialMatch = value
    }
  }

  return partialMatch ? partialMatch : 0
}

/* Returns array of enum values from fuzzy text */
const getEnumValuesFromFuzzyText = (myEnum: any, fuzzyText: string): any[] => {
  const values: any[] = []
  const sanText = sanitizeStringForEnum(fuzzyText)

  /* loop through all keys */
  const keys = Object.keys(myEnum)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = myEnum[key]
    const sanKey = sanitizeStringForEnum(key)

    /* a match, somewhere in the text */
    if (sanText.includes(sanKey)) {
      values.push(value)
    }
  }

  return values
}

/* returns a bitMask by OR'ing the enum value with each matching key */
const getEnumBitmaskFromFuzzyText = (myEnum: any, fuzzyText: string): any => {
  const sanText = sanitizeStringForEnum(fuzzyText)
  let bitMask = 0

  /* loop through all keys */
  const keys = Object.keys(myEnum)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = myEnum[key]
    const sanKey = sanitizeStringForEnum(key)

    /* a match, somewhere in the text */
    if (sanText.includes(sanKey)) {
      bitMask |= value
    }
  }

  return bitMask
}

const bitMaskFromArray = (array: number[]): number => {
  let bitMask = 0

  for (let i = 0; i <= array.length; i++) {
    bitMask |= array[i]
  }

  return bitMask
}

const bitMaskIncludes = (bitMask: number, value: number): boolean => {
  return (bitMask & value) === value ? true : false
}

const newZeroedArray = (len: number): any[] => {
  return new Array(len).fill(0)
}

const isEmpty = (obj: object) => {
  return Object.keys(obj).length == 0
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const cloneObject = (o: any): any => {
  // return JSON.parse(JSON.stringify(o, null, 1))
  return clonedeep(o)
}

const isLetter = (char: string): boolean => {
  return char.length === 1 && char.match(/[a-z]/i) ? true : false
}

const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const roundedString = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

const triangularNumber = (n: number): number => {
  return (n * (n + 1)) / 2
}

/*
const cumulativeChance = (trials: number, chance: number, x: number): number => {
  return 1 - stats.binomcdf(trials, chance, x)
}

// thanks zia
const consecutiveChance = (trials: number, chance: number, x: number): number => {
  const sStart = mathjs.zeros([x + 1, x + 1])
  sStart[0][0] = 1

  const T = mathjs.zeros([x + 1, x + 1])
  for (let i = 0; i < x; i++) {
    T[0][i] = 1 - chance
    T[i + 1][i] = chance
  }

  T[x][x] = 1
  const sEnd = mathjs.multiply(mathjs.pow(T, trials), sStart)
  // @ts-ignore
  return sEnd.slice(-1)[0][0]
}
*/

export default {
  isNode,
  isBrowser,
  isWebWorker,
  isMobile,
  isEmpty,
  isLetter,
  cloneObject,
  newZeroedArray,
  bitMaskFromArray,
  bitMaskIncludes,
  // cumulativeChance,
  // consecutiveChance,
  triangularNumber,
  roundedString,
  capitalize,
  fuzzyTextFromString,
  fuzzyIncludes,
  encodeURI,
  decodeURI,
  paramFromURL,
  sanitizeStringForEnum,
  getAllEnumKeys,
  getAllEnumValues,
  getEnumKeyByEnumValue,
  getEnumValueFromFuzzyText,
  getEnumValuesFromFuzzyText,
  getEnumBitmaskFromFuzzyText
}
