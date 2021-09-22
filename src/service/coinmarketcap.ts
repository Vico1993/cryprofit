// import { default as CoinMarketCapClient } from 'coinmarketcap-api'
import { CoinMarketCapClient } from '../client/coinmarketcapclient'
import { CoinMarketCapOptions } from '../types'

export class CoinMarketCap {
    /**
     * Api client
     *
     * @type {CoinMarketCapClient}
     */
    private client: CoinMarketCapClient

    /**
     * Activate or deactivate debug mode
     *
     * @type {Boolean}
     */
    private debug = false

    /**
     * Devise to get data too
     *
     * @type {string}
     */
    private currency = 'CAD'

    /**
     * Small cache system to not query CoinMarketCap everytime for the same asset
     *
     * @type {Record<string, number>}
     * @todo: Improve ?
     */
    private assetMemory: Record<string, number> = {}

    constructor(opts: CoinMarketCapOptions) {
        // this.client = new CoinMarketCapClient(opts.apiKey)

        this.client = new CoinMarketCapClient({
            apiKey: opts.apiKey,
        })

        if (opts.debug) {
            this.debug = opts.debug
        }

        if (opts.currency) {
            this.currency = opts.currency
        }
    }

    /**
     * Mock fake return value to not query CoinMarketCap for dump information
     *
     * @param {string} asset
     * @returns {number}
     * @todo: Remove ?
     */
    private mockAssetValue = (asset: string): number => {
        const mock = {
            BTC: this.toNumber('59,011.65'),
            ETH: this.toNumber('4,348.04'),
        }

        return mock[asset]
    }

    /**
     * Helper method to transform a Number to string
     *
     * @param {string} str string to convert
     * @returns {number}
     */
    private toNumber = (str: string): number => {
        return Number(str.replace(/[^0-9.-]+/g, ''))
    }

    /**
     * Get current value of Asset
     *
     * @param {string} asset Asset code, like: BTC
     * @returns {Promise<number | undefined>}
     */
    public getAssetValue = async (asset: string): Promise<number | undefined> => {
        if (this.debug) {
            return this.mockAssetValue(asset)
        }

        if (typeof this.assetMemory[asset] === 'undefined') {
            try {
                const response = await this.client.getAssetValue(asset, this.currency)

                this.assetMemory[asset] = response.data[asset].quote[this.currency].price
            } catch (error) {
                console.error('Coinmarketcap error: ', error)
            }
        }

        return this.assetMemory[asset]
    }
}
