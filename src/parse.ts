type row = {
    asset: string
    quantity_bought: string
    asset_value: string
    value: string
    currency: string
}

import { getAssetValue } from './service'

export const parse = async (path: string, asset: string) => {
    const transactions = require(path) as row[]

    for (const transaction of transactions) {
        const currentAssetVal = await getAssetValue(transaction.asset, transaction.currency)
        const assetCurrentPrice = parseFloat(transaction.quantity_bought) * currentAssetVal
        const diff = assetCurrentPrice / parseFloat(transaction.value)

        console.log(
            `${transaction.quantity_bought}${transaction.asset}: Bought for ${transaction.quantity_bought} now worth: ${assetCurrentPrice}`,
        )

        if (diff > 0) {
            console.log(`win: ${diff * 100}`)
        } else {
            console.log(`loose: ${diff * 100}`)
        }
    }
}
