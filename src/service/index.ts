import { CoinMarketCapOptions } from '../types'
import { CoinMarketCap } from './coinmarketcap'
import dotenv from 'dotenv'

// Check env var
dotenv.config()

/**
 * Will instantiate the CoinMarketCap api client with parameters
 *
 * @param {Omit<CoinMarketCapOptions, 'apiKey'>} opts Every option exept for the APIKey who it's added here
 * @returns {CoinMarketCap}
 */
export const initCoinMarketCap = (opts?: Omit<CoinMarketCapOptions, 'apiKey'>): CoinMarketCap => {
    return new CoinMarketCap({
        ...opts,
        apiKey: process.env.COINMARKETCAP_API_KEY,
    })
}
