import Vendor from './Vendor'

const getEnumKeyByEnumValue = (myEnum: any, enumValue: number | string): string => {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue)
  return keys.length > 0 ? keys[0] : ''
}

const cumulativeChance = (trials: number, chance: number, x: number): number => {
  return 1 - Vendor.stats.binomcdf(trials, chance, x)
}

const consecutiveChance = (trials: number, chance: number, x: number): number => {
  let sStart = Vendor.math.zeros([x + 1, x + 1])
  sStart[0][0] = 1

  let T = Vendor.math.zeros([x + 1, x + 1])
  for (let i = 0; i < x; i++) {
    T[0][i] = 1 - chance
    T[i + 1][i] = chance
  }

  T[x][x] = 1
  let sEnd = Vendor.math.multiply(Vendor.math.pow(T, trials), sStart)
  return sEnd.slice(-1)[0][0]
}

const triangularNumber = (n: number) => {
  return (n * (n + 1)) / 2
}

const roundedString = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

const isMobile = () => {
  let mql = window.matchMedia('(max-width: 768px)')
  if (!mql.matches) {
    return true
  }

  return false
}

const cloneObject = (o: any) => {
  return Vendor.clonedeep(o)
}

const isLetter = (char: string) => {
  return char.length === 1 && char.match(/[a-z]/i) ? true : false
}

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const baseURL = () => {
  return `https://kmmiles.gitlab.io/moonkin-calc/`
}

const encodeURI = (str: string) => {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const decodeURI = (str: string) => {
  str = (str + '===').slice(0, str.length + (str.length % 4))
  return str.replace(/-/g, '+').replace(/_/g, '/')
}

export default {
  getEnumKeyByEnumValue,
  cumulativeChance,
  consecutiveChance,
  triangularNumber,
  roundedString,
  isMobile,
  cloneObject,
  isLetter,
  capitalize,
  baseURL,
  encodeURI,
  decodeURI
}
