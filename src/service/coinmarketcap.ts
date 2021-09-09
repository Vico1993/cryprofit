import { default as CoinMarketCap } from 'coinmarketcap-api'
import * as dotenv from 'dotenv'
import { CURRENCY } from '../constant'
import { cmcQuotesResponse } from '../types'

// Load process.env in Typescript
dotenv.config()

// Constuct client from CMC
const client = new CoinMarketCap(process.env.COINMARKETCAP_API_KEY)

const strintToNumber = (str: string): number => {
    return Number(str.replace(/[^0-9.-]+/g, ''))
}

// Mock reponse to avoid useless call
const mock = {
    BTC: strintToNumber('59,011.65'),
    ETH: strintToNumber('4,348.04'),
}

// @todo: Find a better way to cach CMC price
const cache = {}

/**
 * Query CMC to get price
 *
 * @param {string} currency
 * @param {string} symbol
 * @returns {Promise<cmcQuotesResponse>}
 */
export const getAssetValue = async (
    symbol: string,
    currency: string = CURRENCY,
    debug: boolean = false,
): Promise<number | null> => {
    if (debug) {
        return mock[symbol]
    }

    if (typeof cache[symbol] !== 'undefined') {
        return cache[symbol]
    }

    try {
        const response = (await client.getQuotes({
            symbol: symbol,
            convert: currency,
        })) as cmcQuotesResponse

        cache[symbol] = response.data[symbol].quote[currency].price

        return cache[symbol]
    } catch (error) {
        console.error('Coinmarketcap error: ', error)
    }

    return null
}
