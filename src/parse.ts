type row = {
    time: string
    asset: string
    quantity: string
    asset_value: string
    bought_at: string
    currency: string
}

import { getAssetValue } from './service'

export const parse = async (path: string, asset: string) => {
    const transactions = require(path) as row[]

    for (const transaction of transactions) {
        let log = ''
        const currentAssetVal = await getAssetValue(transaction.asset, transaction.currency)

        if (!currentAssetVal) {
            continue
        }

        const time = new Date(transaction.time).toLocaleDateString('en-ca')
        const currentPrice = parseFloat(transaction.quantity) * currentAssetVal
        const diff = currentPrice / parseFloat(transaction.bought_at)

        log += `${time}: ${transaction.quantity}${transaction.asset} `
        log += `Bought for ${transaction.bought_at}, now worth ${currentPrice}`
        log += ' ( '
        log += diff > 0 ? '+' : '-'
        log += `${diff * 100}%`
        log += ' ) '

        console.log(log)
    }
}
