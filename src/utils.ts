/* Utility functions that have nothing to do with world of warcraft */

// import stats from 'statsjs'
// import mathjs from 'mathjs/dist/math'
// import clonedeep from 'lodash.clonedeep'

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
const sanitizeStringForEnum = (s: string): string => {
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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const cloneObject = (o: any): any => {
  return JSON.parse(JSON.stringify(o, null, 1))
  // return clonedeep(o)
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
  getEnumKeyByEnumValue,
  getEnumValueFromFuzzyText,
  sanitizeStringForEnum,
  // cumulativeChance,
  // consecutiveChance,
  triangularNumber,
  roundedString,
  isNode,
  isBrowser,
  isWebWorker,
  isMobile,
  cloneObject,
  isLetter,
  capitalize,
  encodeURI,
  decodeURI,
  paramFromURL
}
