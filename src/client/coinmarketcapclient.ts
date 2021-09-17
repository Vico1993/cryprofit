import axios from 'axios'
import { cmcAPIResponse } from '../types'

type clientOptions = {
    apiKey: string
}

export class CoinMarketCapClient {
    /**
     * @var {string}
     */
    private key: string

    /**
     * @var {string}
     */
    private baseURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency'

    constructor(opts: clientOptions) {
        this.key = opts.apiKey
    }

    /**
     * Return asset value
     *
     * @param {string} asset
     * @param {string} currency
     * @returns {Promise<cmcAPIResponse>}
     */
    public getAssetValue = async (asset: string, currency: string): Promise<cmcAPIResponse> => {
        return await axios
            .get(`${this.baseURL}/quotes/latest`, {
                params: {
                    symbol: asset,
                    convert: currency,
                },
                headers: {
                    'X-CMC_PRO_API_KEY': this.key,
                },
            })
            .then((response) => {
                return response.data
            })
    }
}
