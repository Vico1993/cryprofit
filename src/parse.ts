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

/**
 * Logic who will parse JSON to build ARRAY in response
 *
 * @param {string} path File path
 * @param {string} asset Name of the asset, OPTIONAL
 * @param {boolean} debug Debug mode
 * @return {void}
 */
export const parse = async (
    path: string,
    asset?: string,
    debug: boolean = false,
): Promise<void> => {
    let totalInvest = 0
    let totalCurrentValue = 0
    const rows: row[] = []

    for (const transaction of require(path) as ParseRow[]) {
        // Filter by asset
        if (asset && asset != transaction.asset) {
            continue
        }

        const currentAssetVal = await getAssetValue(transaction.asset, transaction.currency, debug)

        if (!currentAssetVal) {
            continue
        }

        const currentPrice = transaction.quantity * currentAssetVal

        totalInvest += transaction.bought_at
        totalCurrentValue += currentPrice

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

    // Overview
    console.table(rows)

    // Result
    console.table({
        'Total invest': totalInvest,
        'Total current Value': parseFloat(totalCurrentValue.toFixed(2)),
        'Diff ( in CAD )': `$${((totalCurrentValue - totalInvest) / totalInvest).toFixed(5)}`,
        'Diff ( in % )': `${(((totalCurrentValue - totalInvest) / totalInvest) * 100).toFixed(2)}%`,
    })
}
