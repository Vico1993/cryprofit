import { getAssetValue } from './service'
import { ParseRow } from './types'

export const parse = async (path: string, asset?: string) => {
    for (const transaction of require(path) as ParseRow[]) {
        // Filter by asset
        if (asset && asset != transaction.asset) {
            continue
        }

        let log = ''
        const currentAssetVal = await getAssetValue(transaction.asset, transaction.currency)

        if (!currentAssetVal) {
            continue
        }

        const time = new Date(transaction.time).toLocaleDateString('en-ca')
        const currentPrice = transaction.quantity * currentAssetVal
        const diff = currentPrice / transaction.bought_at

        log += `${time}: ${transaction.quantity}${transaction.asset} `
        log += `Bought for ${transaction.bought_at}, now worth ${currentPrice}`
        log += ' ( '
        log += diff > 0 ? '+' : '-'
        log += `${diff * 100}%`
        log += ' ) '

        console.log(log)
    }
}
