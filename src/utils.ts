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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getEnumKeyByEnumValue = (myEnum: any, enumValue: number | string): string => {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue)
  return keys.length > 0 ? keys[0] : ''
}

const getEnumValueFromFuzzyKey = (myEnum: any, fuzzyKey: string): number | string => {
  const keys = Object.keys(myEnum).filter((key) => sanitizeStringForEnum(key) === sanitizeStringForEnum(fuzzyKey))
  return keys.length > 0 ? myEnum[keys[0]] : 0
}

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
  getEnumValueFromFuzzyKey,
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
