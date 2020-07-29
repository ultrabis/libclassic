import lc from '..'
import { exit } from 'process'
import cli from './cli'
const fs = require('fs')
const path = require('path')
const request = require('requestretry')
const cheerio = require('cheerio')
const argv = require('minimist')(process.argv.slice(2))
const outputDir = 'contrib/wowhead'
const iconDir = 'contrib/icons'
const itemListFilePath = `contrib/itemList.json`

const main = async () => {
  const items = argv._[0]
  await wowheadDownloadItems(items)
}

/**
 *
 * Downloads / caches everything we need from wowhead for `items`
 *
 * @param items Comma seperated listed of item id's or names. If undefined all items.
 */
const wowheadDownloadItems = async (items: string | undefined) => {
  let itemList: string[] = []

  if (items) {
    // we passed in a list a item id's / names
    if (lc.utils.isNum(items) || !items.includes(',')) {
      itemList[0] = `${items}`
    } else {
      itemList = items.split(',')
    }
  } else {
    // no list provided...we're doing everything
    // first we need a list of all item id's / names
    console.warn(`No items provided, doing ALL items`)
    await cli.wowheadDownloadItemList(itemListFilePath)
    const data = JSON.parse(await cli.readFileAsString(itemListFilePath))
    for (let i = 0; i < data.length; i++) {
      itemList.push(data[i].name)
    }
  }
  const itemCount = itemList.length

  console.log(`Processing ${itemCount} item(s)`)

  for (let i = 0; i < itemCount; i++) {
    const itemKey = itemList[i].trim()
    const x = lc.utils.isNum(itemKey) ? itemKey : lc.common.itemNameWowhead(itemKey)

    console.log(`- ${itemKey}`)

    // start by downloading XML, since we can fetch it via item id or name
    const itemXMLFilePath = `${outputDir}/${x}.xml`
    const itemXMLEncoded = lc.utils.isNum(itemKey) ? itemKey : encodeURIComponent(itemKey)
    const itemXMLURL = `https://classic.wowhead.com/item=${itemXMLEncoded}&xml`
    await cli.downloadFile(itemXMLURL, itemXMLFilePath)

    // parse the xml
    const itemWowhead = await cli.wowheadParseXMLFile(itemXMLFilePath)
    if (itemWowhead === null) {
      console.error(`-- error parsing wowhead xml`)
      continue
    }
    const itemId = Number(itemWowhead['$'].id)
    const isRandomEnchant = itemWowhead['htmlTooltip'][0].includes('Random enchantment')

    // if it's a random enchant item we need to scrape wowhead for a list of
    // valid suffix id's. in the future we might need other stuff scraped, but
    // we need to condense it into a JSON file, otherwise we'll have gigabytes
    // of HTML files.
    const itemJSONFilePath = `${outputDir}/${x}.json`
    if (isRandomEnchant && !fs.existsSync(itemJSONFilePath)) {
      console.log(`-- scraping suffix data`)
      const validSuffixIds = await cli.wowheadValidSuffixIds(itemId)
      fs.writeFileSync(itemJSONFilePath, JSON.stringify(validSuffixIds))
    }

    // download icon
    const itemIconName = itemWowhead.icon[0]._.toLowerCase()
    const itemIconFilePath = `${iconDir}/${itemIconName}.jpg`
    const itemIconURL = `https://wow.zamimg.com/images/wow/icons/large/${itemIconName}.jpg`
    await cli.downloadFile(itemIconURL, itemIconFilePath)
  }
}

main()
