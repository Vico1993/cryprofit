import * as CoinMarketCap from 'coinmarketcap-api'
import * as dotenv from 'dotenv'
import { CURRENCY } from '../constant'
import { cmcQuotesResponse } from '../types'

// Load process.env in Typescript
dotenv.config()

// Constuct client from CMC
const client = new CoinMarketCap(process.env.API_KEY)

/**
 * Query CMC to get price
 *
 * @param {string} currency
 * @param {string} symbol
 * @returns {Promise<cmcQuotesResponse>}
 */
export const getCoinValue = async (
    symbol: string,
    currency: string = CURRENCY,
): Promise<cmcQuotesResponse> => {
    return (await client.getQuotes({
        symbol: symbol,
        convert: currency,
    })) as cmcQuotesResponse
}
