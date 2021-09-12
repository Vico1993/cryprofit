// For now because input type is JSON
/* eslint-disable @typescript-eslint/no-var-requires */

import { CoinMarketCap } from '../../service/coinmarketcap'
import { analyticsOutput, transactionEntity, transactionOutput } from '../types'
import { input } from '../../types'
import { transaction } from './transaction'

export class transactionModel {
    private coinmarketcapClient: CoinMarketCap

    constructor(coinmarketCapClient: CoinMarketCap) {
        this.coinmarketcapClient = coinmarketCapClient
    }

    /**
     * Will get the path of JSON Input to build a transactionEntity Array
     *
     * @param {string} path
     * @returns {transactionEntity[]}
     */
    public builder = (path: string): transactionEntity[] => {
        const data = require(path) as input[]

        return data.map((input) => {
            return new transaction({
                date: input.time,
                asset: input.asset,
                quantity: input.quantity,
                price: input.bought_for,
                assetPrice: input.asset_value,
            })
        })
    }

    /**
     * Parse list of transmission to add output value
     *
     * @param {transactionEntity[]} transactions
     * @returns {transactionOutput[]}
     */
    public toOutput = async (transactions: transactionEntity[]): Promise<transactionOutput[]> => {
        // return transactions.map((transaction) => {})
        const output: transactionOutput[] = []

        for (const transaction of transactions) {
            const assetValue = await this.coinmarketcapClient.getAssetValue(transaction.asset)

            if (!assetValue) {
                console.error(`CoinMarketCap doesn't any value for: ${transaction.asset}`)
                continue
            }

            const price = assetValue * transaction.quantity

            output.push({
                ...transaction,
                assetCurrentPrice: assetValue,
                currentPrice: parseFloat(price.toFixed(2)),
                diff: `${this.calculateCapitalGain(transaction.price, price)} %`,
            })
        }

        return output
    }

    /**
     * Loop threw transactions to get some analytics informations
     *
     * @param {transactionOutput[]} transactions
     * @return {analyticsOutput}
     */
    public calculateAnalytics = (transactions: transactionOutput[]): analyticsOutput => {
        let totalInvest = 0
        let currentPrice = 0

        for (const transaction of transactions) {
            totalInvest += transaction.price
            currentPrice += transaction.currentPrice
        }

        return {
            currentPrice,
            totalInvest,
            diff: `${this.calculateCapitalGain(totalInvest, currentPrice)} %`,
        }
    }

    /**
     * Calculate capital gain
     *
     * @param {number} startPrice
     * @param {number} endPrice
     * @returns {string}
     */
    private calculateCapitalGain = (startPrice: number, endPrice: number): string => {
        return (((endPrice - startPrice) / startPrice) * 100).toFixed(2)
    }
}
