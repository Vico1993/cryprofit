import { initCoinMarketCap } from './service'
import { input, quote, totalQuote } from './types'

/**
 * Logic who will parse Inbuild to build ARRAY's information
 *
 * @param {input[]} input
 * @param {string} asset Name of the asset, OPTIONAL
 * @param {boolean} debug Debug mode
 * @return {void}
 */
export const parse = async (
    input: input[],
    asset?: string,
    debug: boolean = false,
): Promise<totalQuote> => {
    let totalInvest = 0
    let totalCurrentValue = 0
    const rows: quote[] = []

    for (const transaction of input) {
        // Filter by asset
        if (asset && asset != transaction.asset) {
            continue
        }
        const currentAssetVal = await initCoinMarketCap({
            debug: debug,
        }).getAssetValue(transaction.asset)

        if (!currentAssetVal) {
            continue
        }

        const currentPrice = transaction.quantity * currentAssetVal

        totalInvest += transaction.bought_for
        totalCurrentValue += currentPrice

        rows.push({
            time: new Date(transaction.time).toLocaleDateString('en-ca'),
            quantity: transaction.quantity,
            asset: transaction.asset,
            boughtAt: transaction.asset_value,
            currentPrice: currentAssetVal,
            boughtFor: transaction.bought_for,
            currentValue: parseFloat(currentPrice.toFixed(2)),
            diff: `${(
                ((currentPrice - transaction.bought_for) / transaction.bought_for) *
                100
            ).toFixed(2)}%`,
        })
    }

    return {
        totalCurrentValue,
        totalInvest,
        quotes: rows,
    }
}
