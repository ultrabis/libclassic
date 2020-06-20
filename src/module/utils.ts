import vendor from './vendor'

/* TODO: dumb. should go elsehwere. this won't work forever. */
const baseURL = () => {
  return `https://kmmiles.gitlab.io/moonkin-calc/`
}

const paramFromURL = (paramName: string, URL?: string): string | null => {
  let urlSearchParams = new URLSearchParams(URL ? URL : window.location.search.substring(1))
  return urlSearchParams.get(paramName.toLowerCase())
}

const encodeURI = (str: string) => {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const decodeURI = (str: string): string => {
  str = (str + '===').slice(0, str.length + (str.length % 4))
  return str.replace(/-/g, '+').replace(/_/g, '/')
}

const isMobile = (): boolean => {
  let mql = window.matchMedia('(max-width: 768px)')
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

const getEnumKeyByEnumValue = (myEnum: any, enumValue: number | string): string => {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue)
  return keys.length > 0 ? keys[0] : ''
}

const cloneObject = (o: any) => {
  return vendor.clonedeep(o)
}

const isLetter = (char: string) => {
  return char.length === 1 && char.match(/[a-z]/i) ? true : false
}

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const roundedString = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

const triangularNumber = (n: number) => {
  return (n * (n + 1)) / 2
}

const cumulativeChance = (trials: number, chance: number, x: number): number => {
  return 1 - vendor.stats.binomcdf(trials, chance, x)
}

const consecutiveChance = (trials: number, chance: number, x: number): number => {
  let sStart = vendor.math.zeros([x + 1, x + 1])
  sStart[0][0] = 1

  let T = vendor.math.zeros([x + 1, x + 1])
  for (let i = 0; i < x; i++) {
    T[0][i] = 1 - chance
    T[i + 1][i] = chance
  }

  T[x][x] = 1
  let sEnd = vendor.math.multiply(vendor.math.pow(T, trials), sStart)
  return sEnd.slice(-1)[0][0]
}

export default {
  getEnumKeyByEnumValue,
  cumulativeChance,
  consecutiveChance,
  triangularNumber,
  roundedString,
  isNode,
  isBrowser,
  isWebWorker,
  isMobile,
  cloneObject,
  isLetter,
  capitalize,
  baseURL,
  encodeURI,
  decodeURI,
  paramFromURL
}
