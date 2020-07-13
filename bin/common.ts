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
import GearItemJSON from '../src/interface/GearItemJSONNew'
import GearItemSuffixType from '../src/enum/GearItemSuffixType'
import GearItemClass from '../src/enum/GearItemClass'
import ArmorSubclass from '../src/enum/ArmorSubclass'
import WeaponSubclass from '../src/enum/WeaponSubclass'

const xmlOutputDir = 'contrib/xml'
const iconOutputDir = 'contrib/icons'

/* parsed item object from keftenk balance druid spreadsheet */
interface GearItemKeftenk {
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
  const itemBaseName = lc.common.gearItemBaseName(itemName)
  const filePath = `${xmlOutputDir}/${itemBaseName}.xml`
  const encodedName = encodeURIComponent(itemBaseName)
  const url = `https://classic.wowhead.com/item=${encodedName}&xml`

  return downloadFile(url, filePath)
}

const wowheadParseXML = async (itemName: string) => {
  const itemBaseName = lc.common.gearItemBaseName(itemName)
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

const gearItemJSONFromKeftenk = (csvItem: object, wowheadItemXML?: object): GearItemJSON => {
  const gearItemJSON: GearItemJSON = {
    id: 0,
    name: '',
    slot: 0
  }

  return gearItemJSON
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

const handleSuffix = (gearItemJSON: GearItemJSON, gearItemKeftenk: GearItemKeftenk): Stats | undefined => {
  const gearItemSuffixType = lc.common.gearItemSuffixTypeFromText(gearItemKeftenk.Name)

  if (gearItemSuffixType === GearItemSuffixType.ArcaneWrath) {
    // e.g. Master's Hat of Arcane Wrath (+40 arcane damage)
    const gearItemSuffix = lc.gearItemSuffix.fromItemNameAndBonusValue(
      gearItemKeftenk.Name,
      Number(gearItemKeftenk['Spell Damage'])
    )
    gearItemJSON.name = lc.common.gearItemBaseName(gearItemKeftenk.Name)
    gearItemJSON.suffixId = gearItemSuffix ? gearItemSuffix.id : 0
    return {
      spellDamage: {
        arcaneDamage: 0
      }
    }
    // gearItemJSON.arcaneDamage = gearItemSuffix ? gearItemSuffix.bonus[0].value : 0
  } else if (gearItemSuffixType === GearItemSuffixType.NaturesWrath) {
    const gearItemSuffix = lc.gearItemSuffix.fromItemNameAndBonusValue(
      gearItemKeftenk.Name,
      Number(gearItemKeftenk['Spell Damage'])
    )
    gearItemJSON.name = lc.common.gearItemBaseName(gearItemKeftenk.Name)
    gearItemJSON.suffixId = gearItemSuffix ? gearItemSuffix.id : 0
    return {
      spellDamage: {
        natureDamage: 0
      }
    }
    // gearItemJSON.natureDamage = gearItemSuffix ? gearItemSuffix.bonus[0].value : 0
  } else if (gearItemSuffixType === GearItemSuffixType.Sorcery) {
    // e.g. Abyssal Cloth Pants of Sorcery (+15 Stamina , +15 Intellect , +18 Damage and Healing Spells)
    const gearItemSuffix = lc.gearItemSuffix.fromItemNameAndBonusValue(
      gearItemKeftenk.Name,
      Number(gearItemKeftenk['Spell Damage'])
    )
    gearItemJSON.name = lc.common.gearItemBaseName(gearItemKeftenk.Name)
    gearItemJSON.suffixId = gearItemSuffix ? gearItemSuffix.id : 0

    return {
      stamina: 0,
      intellect: 0,
      spellDamage: {
        spellDamage: 0
      }
    }
    // gearItemJSON.stamina = gearItemSuffix ? gearItemSuffix.bonus[0].value : 0
    // gearItemJSON.intellect = gearItemSuffix ? gearItemSuffix.bonus[1].value : 0
    // gearItemJSON.spellDamage = gearItemSuffix ? gearItemSuffix.bonus[2].value : 0
  } else if (gearItemSuffixType === GearItemSuffixType.Restoration) {
    // e.g. Abyssal Cloth Pants of Restoration (+15 Stamina , +33 Healing Spells , +6 mana every 5 sec.)
    const gearItemSuffix = lc.gearItemSuffix.fromItemNameAndBonusValue(
      gearItemKeftenk.Name,
      Number(gearItemKeftenk.MP5)
    )
    gearItemJSON.name = lc.common.gearItemBaseName(gearItemKeftenk.Name)
    gearItemJSON.suffixId = gearItemSuffix ? gearItemSuffix.id : 0

    return {
      stamina: 0,
      spellHealing: 0,
      mp5: 0
    }
    // gearItemJSON.stamina = gearItemSuffix ? gearItemSuffix.bonus[0].value : 0
    // gearItemJSON.spellHealing = gearItemSuffix ? gearItemSuffix.bonus[1].value : 0
    // gearItemJSON.mp5 = gearItemSuffix ? gearItemSuffix.bonus[2].value : 0
  } else {
    // this isn't a random enchant
    gearItemJSON.name = gearItemKeftenk.Name
    return undefined
  }
}

const gearItemJSONArrayFromKeftenk = async (csvFilePath: string) => {
  const gearItemJSONArray: GearItemJSON[] = []

  // parse the csv
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvJSON = await csvToJSON().fromFile(csvFilePath)

  // iterate all items in csv
  for (const csvItem of csvJSON) {
    const gearItemJSON = {} as GearItemJSON

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
    const gearItemBaseName = lc.common.gearItemBaseName(csvItem.Name)
    await wowheadDownloadXML(gearItemBaseName)
    const gearItemWowhead = await wowheadParseXML(gearItemBaseName)
    if (gearItemWowhead === null) {
      console.error(`-- error parsing wowhead xml`)
      continue
    }

    // set the item id
    gearItemJSON.id = parseInt(gearItemWowhead['$'].id, 10)
    if (!gearItemJSON.id) {
      console.error(`-- error item id can't be 0`)
      continue
    }

    // set icon and download if necessary
    gearItemJSON.icon = gearItemWowhead.icon[0]._.toLowerCase()
    await wowheadDownloadIcon(gearItemJSON.icon ? gearItemJSON.icon : 'classic_temp')

    // handle random enchant items (add name and suffixId)
    // item bonuses will be added when/if converted to a GearItem
    // so we're trusting our suffix database bonus values over the sheet
    const suffixStats = handleSuffix(gearItemJSON, csvItem)

    // fill in the static stuff
    gearItemJSON.class = parseInt(gearItemWowhead['class'][0].$.id, 10)
    gearItemJSON.subclass = parseInt(gearItemWowhead['subclass'][0].$.id, 10)
    gearItemJSON.phase = parseInt(csvItem.Phase, 10)
    gearItemJSON.location = csvItem.Location
    if (csvItem.Boss !== '') {
      gearItemJSON.boss = csvItem.Boss
    }

    // handle stats
    gearItemJSON.stats = {}
    const stamina = Number(csvItem.Stamina)
    const intellect = Number(csvItem.Intellect)
    const spirit = Number(csvItem.Spirit)
    const spellCrit = Number(csvItem['Spell Critical %'])
    const spellHit = Number(csvItem['Spell Hit %'])
    const spellPenetration = Number(csvItem['Spell Penetration'])
    const spellHealing = 0 // todo
    const spellDamage = Number(csvItem['Spell Damage'])

    if (suffixStats !== undefined) {
      // for random enchant items we'll ignore overlapping sheet values
      // we can lookup suffix data at run-time so we don't want it in the db
      gearItemJSON.stats.stamina = suffixStats.stamina !== 0 ? stamina : undefined
      gearItemJSON.stats.intellect = suffixStats.intellect !== 0 ? intellect : undefined
      gearItemJSON.stats.spirit = suffixStats.spirit !== 0 ? spirit : undefined
      gearItemJSON.stats.spellHit = suffixStats.spellHit !== 0 ? spellHit : undefined
      gearItemJSON.stats.spellCrit = suffixStats.spellCrit !== 0 ? spellCrit : undefined
      gearItemJSON.stats.spellPenetration = suffixStats.spellPenetration !== 0 ? spellPenetration : undefined
      gearItemJSON.stats.spellHealing = suffixStats.spellHealing !== 0 ? spellHealing : undefined

      gearItemJSON.stats.spellDamage = {}
      if (suffixStats.spellDamage !== undefined) {
        if (suffixStats.spellDamage.spellDamage !== 0) {
          gearItemJSON.stats.spellDamage.spellDamage = spellDamage
        }
      }
    } else {
      // for normal items use sheet values
      gearItemJSON.stats.stamina = stamina > 0 ? stamina : undefined
      gearItemJSON.stats.intellect = intellect > 0 ? intellect : undefined
      gearItemJSON.stats.spirit = spirit > 0 ? spirit : undefined
      gearItemJSON.stats.spellHit = spellHit > 0 ? spellHit : undefined
      gearItemJSON.stats.spellCrit = spellCrit > 0 ? spellCrit : undefined
      gearItemJSON.stats.spellPenetration = spellPenetration > 0 ? spellPenetration : undefined
      gearItemJSON.stats.spellHealing = spellHealing > 0 ? spellHealing : undefined
      if (spellDamage > 0) {
        gearItemJSON.stats.spellDamage = {
          spellDamage: spellDamage
        }
      }
    }

    if (lc.utils.isEmpty(gearItemJSON.stats)) {
      gearItemJSON.stats = undefined
    }

    // we made it. add item to array
    gearItemJSONArray.push(gearItemJSON)
  }

  return gearItemJSONArray
}

export default {
  gearItemJSONFromKeftenk,
  gearItemJSONArrayFromKeftenk
}
