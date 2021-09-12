import faker from 'faker'
import { transaction } from '../../src/domain'

/**
 * Build a fake transaction with faker.
 * Can be override with opts parameters
 *
 * @param {transactionEntity} opts
 * @returns {transaction}
 */
export const transactionFactory = (opts?: Record<string, string | number>): transaction => {
    return new transaction({
        date: faker.date.past().toDateString(),
        price: faker.datatype.number(),
        asset: faker.finance.currencyCode(),
        quantity: faker.datatype.float(2),
        assetPrice: faker.datatype.number(),
        ...opts,
    })
}
