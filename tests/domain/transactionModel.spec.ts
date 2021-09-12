import { transactionModel } from '../../src/domain'
import { transactionFactory } from './../factory'
import { initCoinMarketCap } from './../../src/service'

const getAssetValueMock = jest.fn()
jest.mock('../../src/service/coinmarketcap.ts', () => ({
    CoinMarketCap: jest.fn().mockImplementation(() => {
        return {
            constructor: jest.fn(),
            getAssetValue: getAssetValueMock,
        }
    }),
}))

const model = new transactionModel(initCoinMarketCap())

describe('transactionModel@toOutput', () => {
    it('get good output', async () => {
        getAssetValueMock.mockResolvedValue(100)

        const transaction = transactionFactory({
            quantity: 1,
            price: 50,
        })

        const output = await model.toOutput([transaction])

        expect(output).toHaveLength(1)
        expect(output.shift()).toMatchObject({
            ...output.shift(),
            quantity: 1,
            price: 50,
            assetCurrentPrice: 100,
            diff: '100.00 %',
        })
    })
})
