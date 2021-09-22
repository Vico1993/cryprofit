/* eslint-disable @typescript-eslint/ban-ts-comment */
import { transactionModel, transactionOutput } from '../../src/domain'
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

describe('transactionModel@calculateAnalytics', () => {
    const transactions: transactionOutput[] = [
        {
            ...transactionFactory({
                quantity: 1,
                price: 50,
            }),
            asset: 'ETH',
            currentPrice: 100,
            assetCurrentPrice: 100,
            diff: '100.00 %',
        },
        {
            ...transactionFactory({
                quantity: 1,
                price: 50,
            }),
            asset: 'ETH',
            currentPrice: 25,
            assetCurrentPrice: 25,
            diff: '-50.00 %',
        },
        {
            ...transactionFactory({
                quantity: 0.45,
                price: 100,
            }),
            asset: 'ETH',
            currentPrice: 131.4,
            assetCurrentPrice: 292,
            diff: '31.40 %',
        },
    ]

    it('Test accurate total', () => {
        const result = model.calculateAnalytics(transactions)

        expect(result).toStrictEqual({
            currentPrice: 256.4,
            totalInvest: 200,
            diff: '28.20 %',
            details: {
                ETH: {
                    currentPrice: 256.4,
                    totalInvest: 200,
                    diff: '28.20 %',
                },
            },
        })
    })

    it('Test with a lot of negative value', () => {
        transactions.push(
            {
                ...transactionFactory({
                    quantity: 1,
                    price: 100,
                }),
                asset: 'BTC',
                currentPrice: 24,
                assetCurrentPrice: 24,
                diff: '-76 %',
            },
            {
                ...transactionFactory({
                    quantity: 1,
                    price: 100,
                }),
                asset: 'BTC',
                currentPrice: 8,
                assetCurrentPrice: 8,
                diff: '-92 %',
            },
        )

        const result = model.calculateAnalytics(transactions)

        expect(result).toStrictEqual({
            currentPrice: 288.4,
            totalInvest: 400,
            diff: '-27.90 %',
            details: {
                BTC: {
                    currentPrice: 32,
                    totalInvest: 200,
                    diff: '-27.90 %',
                },
                ETH: {
                    currentPrice: 256.4,
                    totalInvest: 200,
                    diff: '28.20 %',
                },
            },
        })
    })
})

describe('transactionModel@calculateCapitalGain', () => {
    const cases = [
        {
            start: 50,
            end: 100,
            expected: '100.00',
        },
        {
            start: 32.8,
            end: 40,
            expected: '21.95',
        },
        {
            start: 21.45,
            end: 12.85,
            expected: '-40.09',
        },
        {
            start: 99.92,
            end: 21.004,
            expected: '-78.98',
        },
    ]

    cases.forEach((data) => {
        it(`Test with start: ${data.start} end: ${data.end} - expected: ${data.expected}`, () => {
            // @ts-ignore
            const result = model.calculateCapitalGain(data.start, data.end)

            expect(data.expected).toBe(result)
        })
    })
})
