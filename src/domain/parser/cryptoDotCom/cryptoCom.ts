import { transactionEntity } from '../..'
import { basicParserInterface, CryptoDotComInput } from '../types'

export class CryptoDotCom implements basicParserInterface {
    /**
     * @inheritdoc
     */
    buildTransaction = (data: CryptoDotComInput[]): transactionEntity[] => {
        const transactions: transactionEntity[] = []

        for (const input of data) {
            // Right now just deal with simple purchase
            if (input['Transaction Kind'] === 'crypto_purchase') {
                if (input.Currency === 'ERD') {
                    continue
                }

                transactions.push({
                    date: input['Timestamp (UTC)'],
                    quantity: input.Amount,
                    asset: input.Currency,
                    price: Number(input['Native Amount']),
                    assetPrice: this.getAssetPrice(input.Amount, Number(input['Native Amount'])),
                })
            }
        }

        return transactions
    }

    /**
     * Crypto.com doesn't return the assetPrice.
     * Will need to make an operations
     *
     * @param {number} quantity
     * @param {number} price
     * @returns {number}
     */
    private getAssetPrice = (quantity: number, price: number): number => {
        return (1 * price) / quantity
    }
}
