/*
{
  '$': { id: '10261' },
  name: [ "Adventurer's Bandana" ],
  level: [ '63' ],
  quality: [ { _: 'Uncommon', '$': [Object] } ],
  class: [ { _: 'Armor', '$': [Object] } ],
  subclass: [ { _: 'Leather Armor', '$': [Object] } ],
  icon: [ { _: 'inv_misc_bandana_03', '$': [Object] } ],
  inventorySlot: [ { _: 'Head', '$': [Object] } ],
  htmlTooltip: [
    `<table><tr><td><!--nstart--><b class="q2">Adventurer's Bandana</b><!--nend--><!--ndstart--><!--ndend--><span class="q"><br>Item Level <!--ilvl-->63</span><br /><!--bo-->Binds when equipped<table width="100%"><tr><td>Head</td><th><!--scstart4:2--><span class="q1">Leather</span><!--scend--></th></tr></table><span><!--amr-->130 Armor</span><br><!--re--><span class="q2">&lt;Random enchantment&gt;</span><!--ebstats--><!--egstats--><!--eistats--><!--e--><!--ps--><br>Durability 50 / 50</td></tr></table><table><tr><td>Requires Level <!--rlvl-->58<!--itemEffects:1--><div class="whtt-sellprice">Sell Price: <span class="moneygold">1</span> <span class="moneysilver">79</span> <span class="moneycopper">85</span></div></td></tr></table>`
  ],
  json: [
    `"armor":130,"classs":4,"displayid":29051,"flags2":8192,"id":10261,"level":63,"name":"Adventurer's Bandana","quality":2,"reqlevel":58,"slot":1,"slotbak":1,"source":[2],"subclass":2`
  ],
  jsonEquip: [
    '"armor":130,"avgbuyout":40000,"displayid":29051,"dmgrange":1.00,"dura":50,"reqlevel":58,"sellprice":17985,"slotbak":1'
  ],
  link: [ 'https://classic.wowhead.com/item=10261' ]
}
*/

import Item from './class/Item'
import ClassicSim from './module/ClassicSim'
import ItemJSON from './interface/ItemJSON'
import Faction from './enum/Faction'
import ItemQuality from './enum/ItemQuality'
import ItemClass from './enum/ItemClass'
import ArmorSubclass from './enum/ArmorSubclass'
import WeaponSubclass from './enum/WeaponSubclass'
import ItemSlot from './enum/ItemSlot'
import PvPRank from './enum/PvPRank'
import PlayableClass from './enum/PlayableClass'
import TargetType from './enum/TargetType'
import ItemOnUseJSON from './interface/ItemOnUseJSON'

// let csvFilePath = 'vendor/Classic_Balance_Druidv1.3.csv'
// let csvFilePath = 'vendor/Classic_Balance_Druidv1.4.csv'
// let csvFilePath = 'vendor/Classic_Balance_Druidv1.5.csv'
let csvFilePath = 'vendor/Classic_Balance_Druidv1.5.1.2.csv'
let supplementalFilePath = 'vendor/supplemental-items.csv'

let csim = false
if (process.env.CSIM && process.env.CSIM === '1') {
  csim = true
}

const csv = require('csvtojson')
const axios = require('axios').default
const xml2js = require('xml2js')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const cheerio = require('cheerio')

interface WowHeadResult {
  $: Object
  name: Array<string>
  level: Array<string>
  quality: Array<Object>
  class: Array<Object>
  subclass: Array<Object>
  icon: Array<any>
  inventorySlot: Array<Object>
  htmlTooltip: Array<String>
  json: Array<String>
  jsonEquip: Array<String>
  link: Array<String>
}

interface ItemOld {
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

function toNumber(input: string): number | undefined {
  let val = parseInt(input, 10)
  return val > 0 ? val : undefined
}

async function downloadWowheadIcon(iconName: string) {
  const fileName = `${iconName}.jpg`
  const url = `https://wow.zamimg.com/images/wow/icons/large/${fileName}`
  const outputPath = `public/wow-icons/${fileName}`

  return downloadFile(url, outputPath)
}

async function downloadWowheadXML(baseName: string) {
  const encodedName = encodeURIComponent(baseName)
  const url = `https://classic.wowhead.com/item=${encodedName}&xml`
  const outputPath = `vendor/wowhead/xml/${baseName}.xml`

  return downloadFile(url, outputPath)
}

async function parseWowheadXML(baseName: string) {
  const filePath = `vendor/wowhead/xml/${baseName}.xml`
  const xmlString = await readFileAsString(filePath)
  const result = await xml2js.parseStringPromise(xmlString)
  return result.wowhead.error ? null : result.wowhead.item[0]
}

async function readFileAsString(filePath: string) {
  const data = await fsPromises.readFile(filePath, 'utf8')
  return data
}

async function downloadFile(url: string, outputPath: string) {
  if (!fs.existsSync(outputPath)) {
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

class ConvertItem {
  itemOld: ItemOld
  private _wowHeadItem: any
  constructor(itemOld: ItemOld) {
    this.itemOld = itemOld
    this._wowHeadItem = null
  }

  set wowHeadItem(wowHeadItem: any) {
    this._wowHeadItem = wowHeadItem
  }

  get oldItem(): ItemOld {
    return this.itemOld
  }

  get wowHeadURL(): string {
    // console.log('itemBaseName: \"' + this.itemBaseName + '\"')
    let encodedName = encodeURIComponent(this.itemBaseName)
    return `https://classic.wowhead.com/item=${encodedName}&xml`
  }

  async getWowHeadItem(): Promise<any> {
    try {
      const response = await axios.get(this.wowHeadURL)
      const result = await xml2js.parseStringPromise(response.data)
      // console.warn(result.wowhead.item[0])
      return result.wowhead.error ? null : result.wowhead.item[0]
    } catch (error) {
      console.error(error)
      return null
    }
  }

  get itemId(): number {
    return this._wowHeadItem !== null ? parseInt(this._wowHeadItem['$'].id, 10) : 0
  }

  /* this custom Id is a lazy way of handling the stupid suffixes of random enchant items.
   * For random enchants it prefixes a single character to the ID indicating it's random
   * enchant type */
  get itemCustomId(): string {
    let randomEnchantType = ''
    const of = this.itemName.indexOf(' of ')
    if (of >= 0) {
      const right = this.itemName.slice(of + 4)
      switch (right) {
        case `Arcane Wrath`:
          randomEnchantType = 'A'
          break
        case `Nature's Wrath`:
          randomEnchantType = 'N'
          break
        case `Sorcery`:
          randomEnchantType = 'S'
          break
        case `Restoration`:
          randomEnchantType = 'R'
          break
      }
    }
    return `${randomEnchantType}${this.itemId}`
  }

  get itemName(): string {
    return this.itemOld.Name
  }

  /**
   * wowhead doesn't actually have the random suffix items. instead they're
   * listed inside the base item.
   */
  get itemBaseName(): string {
    const of = this.itemName.indexOf(' of ')
    if (of >= 0) {
      const right = this.itemName.slice(of + 4)

      switch (right) {
        case `Arcane Wrath`:
        case `Nature's Wrath`:
        case `Sorcery`:
        case `Restoration`:
          return this.itemName.slice(0, of)
      }
    }
    return this.itemName
  }

  get isEnchant(): boolean {
    switch (this.itemOld['Equipment Type']) {
      case 'Back Enchant':
      case 'Chest Enchant':
      case 'Feet Enchant':
      case 'Hands Enchant':
      case 'Head Enchant':
      case 'Legs Enchant':
      case 'Shoulder Enchant':
      case 'Weapon Enchant':
      case 'Wrist Enchant':
        return true
      default:
        return false
    }
  }

  get itemSlot(): ItemSlot {
    return parseInt(this._wowHeadItem['inventorySlot'][0].$.id, 10)
  }

  get itemClass(): ItemClass {
    return parseInt(this._wowHeadItem['class'][0].$.id, 10)
  }

  get itemSubclass(): ArmorSubclass | WeaponSubclass {
    return parseInt(this._wowHeadItem['subclass'][0].$.id, 10)
  }

  get itemIconName(): string {
    return this._wowHeadItem === null || this.isEnchant
      ? 'spell_holy_greaterheal'
      : this._wowHeadItem.icon[0]._.toLowerCase()
  }

  get itemPhase(): number {
    return parseFloat(this.itemOld.Phase)
  }

  get itemLocation(): string | undefined {
    return this.itemOld.Location !== '' ? this.itemOld.Location : undefined
  }

  get itemBoss(): string | undefined {
    return this.itemOld.Boss !== '' ? this.itemOld.Boss : undefined
  }

  get itemWorldBoss(): boolean {
    if (!this.itemBoss) {
      return false
    }

    switch (this.itemBoss.toUpperCase()) {
      case 'EMERISS, TAERAR, LETHON, YSONDRE':
      case 'EMERISS':
      case 'YSONDRE':
      case 'LETHON':
      case 'TAERAR':
      case 'LORD KAZZAK':
      case 'AZUREGOS':
        return true
      default:
        return false
    }
  }

  get itemRaid(): boolean {
    if (!this.itemLocation) {
      return false
    }

    switch (this.itemLocation.toUpperCase()) {
      case `MOLTEN CORE`:
      case `BLACKWING LAIR`:
      case `ZUL'GURUB`:
      case `TEMPLE OF AHN'QIRAJ`:
      case `RUINS OF AHN'QIRAJ`:
      case `NAXXRAMAS`:
        return true
      default:
        return false
    }
  }

  get itemStamina(): number | undefined {
    return toNumber(this.itemOld.Stamina)
  }

  get itemIntellect(): number | undefined {
    return toNumber(this.itemOld.Intellect)
  }

  get itemSpirit(): number | undefined {
    return toNumber(this.itemOld.Spirit)
  }

  get itemSpellCrit(): number | undefined {
    return toNumber(this.itemOld['Spell Critical %'])
  }

  get itemSpellHit(): number | undefined {
    return toNumber(this.itemOld['Spell Hit %'])
  }

  get itemSpellPen(): number | undefined {
    return toNumber(this.itemOld['Spell Penetration'])
  }

  get itemSpellDamage(): number | undefined {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'Yes' && this.itemOld.Starfire === 'Yes') {
      return toNumber(this.itemOld['Spell Damage'])
    }
    return undefined
  }

  /* TODO */
  get itemSpellHealing(): number | undefined {
    return undefined
  }

  get itemArcaneDamage(): number | undefined {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'No' && this.itemOld.Starfire === 'Yes') {
      return toNumber(this.itemOld['Spell Damage'])
    }
    return undefined
  }

  get itemNatureDamage(): number | undefined {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'Yes' && this.itemOld.Starfire === 'No') {
      return toNumber(this.itemOld['Spell Damage'])
    }
    return undefined
  }

  get itemMp5(): number | undefined {
    return toNumber(this.itemOld.MP5)
  }

  get itemScore(): number | undefined {
    return toNumber(this.itemOld.Score)
  }

  get itemRank(): PvPRank {
    switch (this.itemLocation) {
      case 'Requires Blood Guard':
        return PvPRank.BloodGuard
      case 'Requires Champion':
        return PvPRank.Champion
      case 'Requires Field Marshal':
        return PvPRank.FieldMarshal
      case 'Requires General':
        return PvPRank.General
      case 'Requires Grand Marshal':
        return PvPRank.GrandMarshal
      case 'Requires High Warlord':
        return PvPRank.HighWarlord
      case 'Requires Knight-Captain':
        return PvPRank.KnightCaptain
      case 'Requires Knight-Lieutenant':
        return PvPRank.KnightLieutenant
      case 'Requires Legionnaire':
        return PvPRank.Legionnaire
      case 'Requires Lieutenant Commander':
        return PvPRank.LieutenantCommander
      case 'Requires Marshal':
        return PvPRank.Marshal
      case 'Requires Warlord':
        return PvPRank.Warlord
      default:
        return PvPRank.Scout
    }
  }

  get itemFaction(): Faction {
    if (this.itemAlliance && this.itemHorde) {
      return Faction.Alliance | Faction.Horde
    } else if (this.itemHorde) {
      return Faction.Horde
    }

    return Faction.Alliance
  }

  get itemAlliance(): boolean {
    return this.itemOld.Alliance === 'Yes' ? true : false
  }

  get itemHorde(): boolean {
    return this.itemOld.Horde === 'Yes' ? true : false
  }

  get itemQuality(): ItemQuality {
    if (this._wowHeadItem === null) {
      return ItemQuality.Common
    }

    switch (this._wowHeadItem['quality'][0]._.toUpperCase()) {
      case 'POOR':
        return ItemQuality.Poor
      case 'COMMON':
        return ItemQuality.Common
      case 'UNCOMMON':
        return ItemQuality.Uncommon
      case 'RARE':
        return ItemQuality.Rare
      case 'EPIC':
        return ItemQuality.Epic
      case 'LEGENDARY':
        return ItemQuality.Legendary
      default:
        return ItemQuality.Common
    }
  }

  get itemLevel(): number {
    return parseInt(this._wowHeadItem['level'][0], 10)
  }

  get itemReqLevel(): number {
    return JSON.parse(`{ ${this._wowHeadItem['json'][0]} }`).reqlevel
  }

  get itemArmor(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['json'][0]} }`).armor)
  }

  get itemDurability(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).dura)
  }

  get itemMinDmg(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledmgmin)
  }

  get itemMaxDmg(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledmgmax)
  }

  get itemSpeed(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mlespeed)
  }

  get itemDps(): number | undefined {
    return toNumber(JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledps)
  }

  get itemTargetTypes(): number | undefined {
    if (this._wowHeadItem['htmlTooltip'][0].includes('Undead and Demons')) {
      return TargetType.Undead | TargetType.Demon
    } else if (this._wowHeadItem['htmlTooltip'][0].includes('Increases damage done to Undead')) {
      return TargetType.Undead
    }
    return undefined
  }

  get itemBop(): boolean {
    return this._wowHeadItem['htmlTooltip'][0].includes('Binds when picked up')
  }

  get itemUnique(): boolean {
    return this._wowHeadItem['htmlTooltip'][0].includes('Unique')
  }

  get allowableClasses(): any {
    const htt = this._wowHeadItem['htmlTooltip'][0]
    let classes = []

    if (!htt.includes('Classes: ')) {
      return undefined
    }

    if (htt.includes('Warrior')) {
      classes.push(PlayableClass.Warrior)
    }
    if (htt.includes('Paladin')) {
      classes.push(PlayableClass.Paladin)
    }
    if (htt.includes('Hunter')) {
      classes.push(PlayableClass.Hunter)
    }
    if (htt.includes('Rogue')) {
      classes.push(PlayableClass.Rogue)
    }
    if (htt.includes('Priest')) {
      classes.push(PlayableClass.Priest)
    }
    if (htt.includes('Shaman')) {
      classes.push(PlayableClass.Shaman)
    }
    if (htt.includes('Mage')) {
      classes.push(PlayableClass.Mage)
    }
    if (htt.includes('Warlock')) {
      classes.push(PlayableClass.Warlock)
    }
    if (htt.includes('Druid')) {
      classes.push(PlayableClass.Druid)
    }
    return classes
  }

  get itemOnUse(): ItemOnUseJSON | undefined {
    let tooltip = this._wowHeadItem['htmlTooltip'][0]
    if (tooltip.includes('Use:')) {
      let $ = cheerio.load(tooltip)
      let onUseText = $('span .q2').html()
      $('a[class=q2]').remove()
      let tmpstr = $('span[class=q2]').html()
      let onUseCooldown = tmpstr.substring(tmpstr.lastIndexOf('(') + 1, tmpstr.lastIndexOf(')'))
      return {
        effect: onUseText,
        cooldown: onUseCooldown
      }
    }
    return undefined
  }

  get newItem(): ItemJSON {
    /*
    let item: ItemJSON = {
      id: this.itemId,
      name: this.itemName,
      class: this.itemClass,
      subclass: this.itemSubclass,
      slot: this.itemSlot
    }
    */

    return {
      id: this.itemId,
      customId: this.itemCustomId,
      name: this.itemName,
      class: this.itemClass,
      subclass: this.itemSubclass,
      slot: this.itemSlot,
      quality: this.itemQuality,
      level: this.itemLevel,
      reqLevel: this.itemReqLevel,
      bop: this.itemBop,
      unique: this.itemUnique,
      allowableClasses: this.allowableClasses,
      targetTypes: this.itemTargetTypes,
      phase: this.itemPhase,
      pvpRank: this.itemRank,
      icon: this.itemIconName,
      location: this.itemLocation,
      boss: this.itemBoss,
      raid: this.itemRaid,
      worldBoss: this.itemWorldBoss,
      faction: this.itemFaction,
      spellDamage: this.itemSpellDamage,
      spellHealing: this.itemSpellHealing,
      arcaneDamage: this.itemArcaneDamage,
      natureDamage: this.itemNatureDamage,
      spellHit: this.itemSpellHit,
      spellCrit: this.itemSpellCrit,
      spellPenetration: this.itemSpellPen,
      stamina: this.itemStamina,
      intellect: this.itemIntellect,
      spirit: this.itemSpirit,
      mp5: this.itemMp5,
      armor: this.itemArmor,
      durability: this.itemDurability,
      minDmg: this.itemMinDmg,
      maxDmg: this.itemMaxDmg,
      speed: this.itemSpeed,
      dps: this.itemDps,
      onUse: this.itemOnUse
    }
  }
}

const start = async function() {
  console.warn('Parsing CSV: ' + csvFilePath)
  const csvArray = await csv().fromFile(csvFilePath)
  const csvExtraArray = await csv().fromFile(supplementalFilePath)
  const jsonArray = csvArray.concat(csvExtraArray)
  let myArray = []

  for (let ogObj of jsonArray) {
    if (ogObj.Name === '') {
      continue
    }
    let gearItem = new ConvertItem(ogObj)
    if (gearItem.isEnchant) {
      continue
    }
    console.warn('Processing: ' + gearItem.itemName)
    await downloadWowheadXML(gearItem.itemBaseName)
    let wowHeadItem = await parseWowheadXML(gearItem.itemBaseName)
    if (wowHeadItem === null) {
      console.error('Item not found: ' + ogObj.Name)
    } else {
      gearItem.wowHeadItem = wowHeadItem
      await downloadWowheadIcon(gearItem.itemIconName)
      myArray.push(gearItem.newItem)
    }
  }

  if (csim) {
    console.warn(`Hello, i'm doing csim`)
    for (let i = 0; i <= myArray.length; i++) {
      if (myArray[i]) {
        let myItem = new Item(myArray[i].slot, myArray[i])
        console.log(ClassicSim.GenerateItemXML(myItem))
      }
    }
  } else {
    console.log(JSON.stringify(myArray, null, 1))
  }
  console.warn('Complete.')
}

void start()
