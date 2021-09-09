import { getAssetValue } from './service'
import { ParseRow } from './types'

type row = {
    time: string
    asset: string
    quantity: number
    boughtAt: number
    currentPrice: number
    boughtFor: number
    currentValue: number
    diff: string
}

export const parse = async (path: string, asset?: string) => {
    const rows: row[] = []

    for (const transaction of require(path) as ParseRow[]) {
        // Filter by asset
        if (asset && asset != transaction.asset) {
            continue
        }

        const currentAssetVal = await getAssetValue(transaction.asset, transaction.currency)

        if (!currentAssetVal) {
            continue
        }

        const currentPrice = transaction.quantity * currentAssetVal

        rows.push({
            time: new Date(transaction.time).toLocaleDateString('en-ca'),
            quantity: transaction.quantity,
            asset: transaction.asset,
            boughtAt: transaction.asset_value,
            currentPrice: currentAssetVal,
            boughtFor: transaction.bought_at,
            currentValue: parseFloat(currentPrice.toFixed(2)),
            diff: `${(
                ((currentPrice - transaction.bought_at) / transaction.bought_at) *
                100
            ).toFixed(2)}%`,
        })
    }

    console.table(rows)
}
