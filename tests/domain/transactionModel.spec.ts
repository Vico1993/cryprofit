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
            price: 50,
        })

        const ouput = await model.toOutput([transaction])

        expect(ouput).toHaveLength(1)
    })
})
