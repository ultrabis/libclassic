/**
 * common stuff for database creation
 */

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const csvToJSON = require('csvtojson')
const axios = require('axios').default
const xml2js = require('xml2js')
// const cheerio = require('cheerio')

import lc from '../src'
import Stats from '../src/interface/Stats'
import ItemJSON from '../src/interface/ItemJSONNew'
import ItemSuffixType from '../src/enum/ItemSuffixType'
import ItemClass from '../src/enum/ItemClass'
import ArmorSubclass from '../src/enum/ArmorSubclass'
import WeaponSubclass from '../src/enum/WeaponSubclass'

const xmlOutputDir = 'contrib/xml'
const iconOutputDir = 'contrib/icons'

/* parsed item object from keftenk balance druid spreadsheet */
interface ItemKeftenk {
  'Equipment Type': string
  Slot: string
  Name: string
  Phase: string
  Location: string
  Boss: string
  Stamina: string
  Intellect: string
  Spirit: string
  'Spell Damage': string
  'Spell Critical %': string
  'Spell Hit %': string
  MP5: string
  'Spell Penetration': string
  Score: string
  field16: string
  Alliance: string
  Horde: string
  Starfire: string
  Wrath: string
}

const wowheadDownloadIcon = async (iconName: string) => {
  const fileName = `${iconName}.jpg`
  const url = `https://wow.zamimg.com/images/wow/icons/large/${fileName}`
  const outputPath = `${iconOutputDir}/${fileName}`

  return downloadFile(url, outputPath)
}

const wowheadDownloadXML = async (itemName: string) => {
  const itemBaseName = lc.common.itemBaseName(itemName)
  const filePath = `${xmlOutputDir}/${itemBaseName}.xml`
  const encodedName = encodeURIComponent(itemBaseName)
  const url = `https://classic.wowhead.com/item=${encodedName}&xml`

  return downloadFile(url, filePath)
}

const wowheadParseXML = async (itemName: string) => {
  const itemBaseName = lc.common.itemBaseName(itemName)
  const filePath = `${xmlOutputDir}/${itemBaseName}.xml`
  const xmlString = await readFileAsString(filePath)
  const result = await xml2js.parseStringPromise(xmlString)
  return result.wowhead.error ? null : result.wowhead.item[0]
}

const readFileAsString = async (filePath: string) => {
  const data = await fsPromises.readFile(filePath, 'utf8')
  return data
}

const downloadFile = async (url: string, outputPath: string) => {
  if (!fs.existsSync(outputPath)) {
    console.log(`-- downloading ${url}`)
    const outputPathResolved = path.resolve(outputPath)
    const writer = fs.createWriteStream(outputPathResolved)
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }
}

const itemJSONFromKeftenk = (csvItem: object, wowheadItemXML?: object): ItemJSON => {
  const itemJSON: ItemJSON = {
    id: 0,
    name: '',
    slot: 0
  }

  return itemJSON
}

const isEnchant = (keftenkEquipmentType: string) => {
  switch (keftenkEquipmentType) {
    case 'Back Enchant':
    case 'Chest Enchant':
    case 'Feet Enchant':
    case 'Hands Enchant':
    case 'Head Enchant':
    case 'Legs Enchant':
    case 'Shoulder Enchant':
    case 'Weapon Enchant':
    case 'Wrist Enchant':
      return 1
    default:
      return 0
  }
}

const handleSuffix = (itemJSON: ItemJSON, itemKeftenk: ItemKeftenk): Stats | undefined => {
  const itemSuffixType = lc.common.itemSuffixTypeFromText(itemKeftenk.Name)

  if (itemSuffixType === ItemSuffixType.ArcaneWrath) {
    // e.g. Master's Hat of Arcane Wrath (+40 arcane damage)
    const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(itemKeftenk.Name, Number(itemKeftenk['Spell Damage']))
    itemJSON.name = lc.common.itemBaseName(itemKeftenk.Name)
    itemJSON.suffixId = itemSuffix ? itemSuffix.id : 0
    return {
      spellDamage: {
        arcaneDamage: 0
      }
    }
    // itemJSON.arcaneDamage = itemSuffix ? itemSuffix.bonus[0].value : 0
  } else if (itemSuffixType === ItemSuffixType.NaturesWrath) {
    const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(itemKeftenk.Name, Number(itemKeftenk['Spell Damage']))
    itemJSON.name = lc.common.itemBaseName(itemKeftenk.Name)
    itemJSON.suffixId = itemSuffix ? itemSuffix.id : 0
    return {
      spellDamage: {
        natureDamage: 0
      }
    }
    // itemJSON.natureDamage = itemSuffix ? itemSuffix.bonus[0].value : 0
  } else if (itemSuffixType === ItemSuffixType.Sorcery) {
    // e.g. Abyssal Cloth Pants of Sorcery (+15 Stamina , +15 Intellect , +18 Damage and Healing Spells)
    const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(itemKeftenk.Name, Number(itemKeftenk['Spell Damage']))
    itemJSON.name = lc.common.itemBaseName(itemKeftenk.Name)
    itemJSON.suffixId = itemSuffix ? itemSuffix.id : 0

    return {
      stamina: 0,
      intellect: 0,
      spellDamage: {
        spellDamage: 0
      }
    }
    // itemJSON.stamina = itemSuffix ? itemSuffix.bonus[0].value : 0
    // itemJSON.intellect = itemSuffix ? itemSuffix.bonus[1].value : 0
    // itemJSON.spellDamage = itemSuffix ? itemSuffix.bonus[2].value : 0
  } else if (itemSuffixType === ItemSuffixType.Restoration) {
    // e.g. Abyssal Cloth Pants of Restoration (+15 Stamina , +33 Healing Spells , +6 mana every 5 sec.)
    const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(itemKeftenk.Name, Number(itemKeftenk.MP5))
    itemJSON.name = lc.common.itemBaseName(itemKeftenk.Name)
    itemJSON.suffixId = itemSuffix ? itemSuffix.id : 0

    return {
      stamina: 0,
      spellHealing: 0,
      mp5: 0
    }
    // itemJSON.stamina = itemSuffix ? itemSuffix.bonus[0].value : 0
    // itemJSON.spellHealing = itemSuffix ? itemSuffix.bonus[1].value : 0
    // itemJSON.mp5 = itemSuffix ? itemSuffix.bonus[2].value : 0
  } else {
    // this isn't a random enchant
    itemJSON.name = itemKeftenk.Name
    return undefined
  }
}

const itemJSONArrayFromKeftenk = async (csvFilePath: string) => {
  const itemJSONArray: ItemJSON[] = []

  // parse the csv
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvJSON = await csvToJSON().fromFile(csvFilePath)

  // iterate all items in csv
  for (const csvItem of csvJSON) {
    const itemJSON = {} as ItemJSON

    // skip empty names
    if (csvItem.Name === '') {
      continue
    }

    console.warn(`- ${csvItem.Name}`)

    // skip enchants
    if (isEnchant(csvItem['Equipment Type'])) {
      console.warn(`-- skipping because enchant`)
      continue
    }

    // download and parse the wowhead xml (downloads are cached in contrib/)
    const itemBaseName = lc.common.itemBaseName(csvItem.Name)
    await wowheadDownloadXML(itemBaseName)
    const itemWowhead = await wowheadParseXML(itemBaseName)
    if (itemWowhead === null) {
      console.error(`-- error parsing wowhead xml`)
      continue
    }

    // set the item id
    itemJSON.id = parseInt(itemWowhead['$'].id, 10)
    if (!itemJSON.id) {
      console.error(`-- error item id can't be 0`)
      continue
    }

    // set icon and download if necessary
    itemJSON.icon = itemWowhead.icon[0]._.toLowerCase()
    await wowheadDownloadIcon(itemJSON.icon ? itemJSON.icon : 'classic_temp')

    // fill in the static stuff
    itemJSON.class = parseInt(itemWowhead['class'][0].$.id, 10)
    itemJSON.subclass = parseInt(itemWowhead['subclass'][0].$.id, 10)
    itemJSON.phase = parseInt(csvItem.Phase, 10)
    itemJSON.location = csvItem.Location
    if (csvItem.Boss !== '') {
      itemJSON.boss = csvItem.Boss
    }

    // handle stats
    itemJSON.stats = {}
    const stamina = Number(csvItem.Stamina)
    const intellect = Number(csvItem.Intellect)
    const spirit = Number(csvItem.Spirit)
    const spellCrit = Number(csvItem['Spell Critical %'])
    const spellHit = Number(csvItem['Spell Hit %'])
    const spellPenetration = Number(csvItem['Spell Penetration'])
    const spellHealing = 0 // todo
    const spellDamage = Number(csvItem['Spell Damage'])

    // handle random enchant items (add name and suffixId)
    // item bonuses will be added when/if converted to a Item
    // so we're trusting our suffix database bonus values over the sheet
    const suffixStats = handleSuffix(itemJSON, csvItem)
    if (suffixStats !== undefined) {
      // for random enchant items we'll ignore overlapping sheet values
      // we can lookup suffix data at run-time so we don't want it in the db
      itemJSON.stats.stamina = suffixStats.stamina !== 0 ? stamina : undefined
      itemJSON.stats.intellect = suffixStats.intellect !== 0 ? intellect : undefined
      itemJSON.stats.spirit = suffixStats.spirit !== 0 ? spirit : undefined
      itemJSON.stats.spellHit = suffixStats.spellHit !== 0 ? spellHit : undefined
      itemJSON.stats.spellCrit = suffixStats.spellCrit !== 0 ? spellCrit : undefined
      itemJSON.stats.spellPenetration = suffixStats.spellPenetration !== 0 ? spellPenetration : undefined
      itemJSON.stats.spellHealing = suffixStats.spellHealing !== 0 ? spellHealing : undefined

      itemJSON.stats.spellDamage = {}
      if (suffixStats.spellDamage !== undefined) {
        if (suffixStats.spellDamage.spellDamage !== 0) {
          itemJSON.stats.spellDamage.spellDamage = spellDamage
        }
      }
    } else {
      // for normal items use sheet values
      itemJSON.stats.stamina = stamina > 0 ? stamina : undefined
      itemJSON.stats.intellect = intellect > 0 ? intellect : undefined
      itemJSON.stats.spirit = spirit > 0 ? spirit : undefined
      itemJSON.stats.spellHit = spellHit > 0 ? spellHit : undefined
      itemJSON.stats.spellCrit = spellCrit > 0 ? spellCrit : undefined
      itemJSON.stats.spellPenetration = spellPenetration > 0 ? spellPenetration : undefined
      itemJSON.stats.spellHealing = spellHealing > 0 ? spellHealing : undefined
      if (spellDamage > 0) {
        itemJSON.stats.spellDamage = {
          spellDamage: spellDamage
        }
      }
    }

    if (lc.utils.isEmpty(itemJSON.stats)) {
      itemJSON.stats = undefined
    }

    // we made it. add item to array
    itemJSONArray.push(itemJSON)
  }

  return itemJSONArray
}

export default {
  itemJSONFromKeftenk,
  itemJSONArrayFromKeftenk
}
