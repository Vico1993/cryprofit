import { transactionEntity } from '../..'
import { basicParserInterface, CryptoDotComInput, Earn } from '../types'

export class CryptoDotCom implements basicParserInterface {
    private earn: Earn = {}

    /**
     * @inheritdoc
     */
    buildTransaction = (data: CryptoDotComInput[]): transactionEntity[] => {
        const transactions: transactionEntity[] = []

        for (const input of data.reverse()) {
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

            if (input['Transaction Kind'] === 'crypto_earn_interest_paid') {
                if (!this.earn[input.Currency]) {
                    this.earn[input.Currency] = {
                        quantity: Number(input.Amount),
                    }
                } else {
                    this.earn[input.Currency].quantity += Number(input.Amount)
                }
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

    /**
     * Return total earn group by Asset
     *
     * @returns {Earn}
     */
    public getEarn = (): Earn => {
        return this.earn
    }
}
