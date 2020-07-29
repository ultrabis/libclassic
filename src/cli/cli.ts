/**
 * common stuff for database creation
 */

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const csvToJSON = require('csvtojson')
const axios = require('axios').default
const xml2js = require('xml2js')
const cheerio = require('cheerio')
const request = require('requestretry')

import lc from '..'
import Stats from '../interface/Stats'
import ItemJSON from '../interface/ItemJSONNew'
import ItemSuffixType from '../enum/ItemSuffixType'

const xmlOutputDir = 'contrib/wowhead'
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

/**
 * scrapes all item id's / names from wowhead and writes them as JSON to `outputPath`
 *
 * @param outputPath write to file
 */
const wowheadDownloadItemList = async (outputPath: string) => {
  if (!fs.existsSync(outputPath)) {
    const data = await scrapeWowheadListing()
    fs.writeFileSync(outputPath, JSON.stringify(data))
  }
}

/**
 * returns object of all wowhead item id's.
 *
 * borrowed from: https://github.com/nexus-devs/wow-classic-items
 */
const scrapeWowheadListing = async () => {
  const items = []

  // Filter the items by ID (total ID range about 24000).
  const stepSize = 500 // Wowhead can only show about 500 items per page.
  const maxSize = 24500
  for (let i = 0; i < maxSize; i += stepSize) {
    // const url = `https://classic.wowhead.com/items?filter=162:151:151:195;2:2:5:1;0:${i}:${i + stepSize}`
    const url = `https://classic.wowhead.com/items?filter=162:151:151;2:2:5;0:${i}:${i + stepSize}`
    console.log(`doing ${i} of ${maxSize}: ${url}`)
    const req = await request({
      url: url,
      json: true
    })

    // Wowhead uses JavaScript to load in their table content, so we'd need something like Selenium to get the HTML.
    // However, that is really painful and slow. Fortunately, with some parsing the table content is available in the source code.
    const $ = cheerio.load(req.body)
    const tableContentRaw = $('script[type="text/javascript"]').get()[0].children[0].data.split('\n')[1].slice(26, -2)
    const tableContent = JSON.parse(tableContentRaw)

    for (const key of Object.keys(tableContent)) {
      const item = tableContent[key]
      if (!item.jsonequip.slotbak) {
        console.log(`skipping ${item.name_enus}...not equippable`)
        continue
      }
      items.push({
        id: parseInt(key),
        name: item.name_enus
      })
    }
  }

  return items
}

const wowheadDownloadIcon = async (iconName: string) => {
  const fileName = `${iconName}.jpg`
  const url = `https://wow.zamimg.com/images/wow/icons/large/${fileName}`
  const outputPath = `${iconOutputDir}/${fileName}`

  return downloadFile(url, outputPath)
}

// for some reason we can't link to items by name as with the XML
const wowheadDownloadHTML = async (itemId: number, itemName?: string) => {
  const filePath = `${xmlOutputDir}/${itemName ? itemName : itemId}.html`
  const url = `https://classic.wowhead.com/item=${itemId}`
  return downloadFile(url, filePath)
}

const wowheadDownloadXML = async (itemName: string) => {
  const itemBaseName = lc.common.itemBaseName(itemName)
  const filePath = `${xmlOutputDir}/${itemBaseName}.xml`
  const encodedName = encodeURIComponent(itemBaseName)
  const url = `https://classic.wowhead.com/item=${encodedName}&xml`

  return downloadFile(url, filePath)
}

const wowheadParseXMLFile = async (filePath: string) => {
  const xmlString = await readFileAsString(filePath)
  const result = await xml2js.parseStringPromise(xmlString)
  return result.wowhead.error ? null : result.wowhead.item[0]
}

const wowheadParseXML = async (itemName: string) => {
  const itemBaseName = lc.common.itemBaseName(itemName)
  const filePath = `${xmlOutputDir}/${itemBaseName}.xml`
  return wowheadParseXMLFile(filePath)
}

const wowheadValidSuffixIds = async (itemId: number) => {
  const req = await request({
    url: `https://classic.wowhead.com/item=${itemId}`,
    json: true
  })

  const validSuffixIds: number[] = []
  const $ = cheerio.load(req.body)
  $('div[class=random-enchantments]')
    .find('li')
    .find('div')
    .each(function (i: number, elem: any) {
      // the suffix type e.g. "of the Bear"
      const suffixTypeText = $(elem).find('span').text().replace(/\./g, '')

      // drop chance...not doing anything with it for now
      const dropChanceText = $(elem).find('small').text()

      // rip out junk so we can grab bonus text
      $(elem).find('span').remove()
      $(elem).find('small').remove()
      $(elem).find('br').remove()

      // we only care about the first bonus type e.g. the stamina bonus of 'the bear'
      // this is enough to find the itemSuffix record, which has all the bonuses
      const bonusText = $(elem).text().trim().split(',')[0]

      // sometimes there are two versions of an item with different bonus values
      // e.g. "+(6 - 7) Stamina"
      // so we'll create an array of bonus values
      // note: for some enchantments e.g. of healing, wowhead lists as e.g. '59-62'
      // that means 59 AND 62, not 59 through 62
      const bonusValues: number[] = []
      if (bonusText.includes('(')) {
        const bonuses = bonusText
          .replace(/.*\(|\).*/g, '')
          .replace(/ /g, '')
          .split('-')
        bonusValues[0] = Number(bonuses[0])
        bonusValues[1] = Number(bonuses[1])
      } else {
        bonusValues[0] = Number(bonusText.split(' ')[0].replace(/\+/g, ''))
      }

      // lookup the itemSuffix(es). each represents a suffix id with associated bonuses
      // so at this point, we have an itemId and all valid suffixId's for that item.
      for (let i = 0; i < bonusValues.length; i++) {
        const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(`x ${suffixTypeText}`, bonusValues[i])
        if (itemSuffix) {
          validSuffixIds.push(itemSuffix.id)
        }
      }
    })

  return {
    validSuffixIds: validSuffixIds
  }
}

const readFileAsString = async (filePath: string) => {
  return await fsPromises.readFile(filePath, 'utf8')
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

/*
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
*/

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

    const itemSuffixType = lc.common.itemSuffixTypeFromText(csvItem.Name)
    let bonusValue: number
    switch (itemSuffixType) {
      case ItemSuffixType.ArcaneWrath:
      case ItemSuffixType.NaturesWrath:
      case ItemSuffixType.Sorcery:
        bonusValue = Number(csvItem['Spell Damage'])
        break
      default:
        bonusValue = 0
        break
    }

    if (bonusValue) {
      // this is a random enchant we will support
      const itemSuffix = lc.itemSuffix.fromItemNameAndBonusValue(csvItem.Name, bonusValue)
      itemJSON.suffixId = itemSuffix ? itemSuffix.id : undefined
    }

    // set the name
    itemJSON.name = csvItem.Name

    // set icon and download if necessary
    itemJSON.icon = itemWowhead.icon[0]._.toLowerCase()
    await wowheadDownloadIcon(itemJSON.icon ? itemJSON.icon : 'classic_temp')

    // fill in the static stuff
    itemJSON.class = parseInt(itemWowhead['class'][0].$.id, 10)
    itemJSON.subclass = parseInt(itemWowhead['subclass'][0].$.id, 10)
    itemJSON.phase = parseInt(csvItem.Phase, 10)
    itemJSON.location = csvItem.Location
    itemJSON.slot = parseInt(itemWowhead['inventorySlot'][0].$.id, 10)
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

    itemJSON.stats.stamina = stamina > 0 ? stamina : undefined
    itemJSON.stats.intellect = intellect > 0 ? intellect : undefined
    itemJSON.stats.spirit = spirit > 0 ? spirit : undefined
    itemJSON.stats.spellHit = spellHit > 0 ? spellHit : undefined
    itemJSON.stats.spellCrit = spellCrit > 0 ? spellCrit : undefined
    itemJSON.stats.spellPenetration = spellPenetration > 0 ? spellPenetration : undefined
    itemJSON.stats.spellHealing = spellHealing > 0 ? spellHealing : undefined
    if (spellDamage > 0) {
      if (itemSuffixType === ItemSuffixType.ArcaneWrath) {
        itemJSON.stats.spellDamage = {
          arcaneDamage: spellDamage
        }
      } else if (itemSuffixType === ItemSuffixType.NaturesWrath) {
        itemJSON.stats.spellDamage = {
          natureDamage: spellDamage
        }
      } else {
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
  itemJSONArrayFromKeftenk,
  downloadFile,
  wowheadDownloadItemList,
  wowheadDownloadHTML,
  wowheadDownloadXML,
  wowheadDownloadIcon,
  wowheadParseXML,
  wowheadParseXMLFile,
  wowheadValidSuffixIds,
  readFileAsString
}
