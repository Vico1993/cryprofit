export type transactionEntity = {
    date: string
    price: number
    asset: string
    quantity: number
    assetPrice: number
}

export type transactionOutput = transactionEntity & {
    assetCurrentPrice: number
    currentPrice: number
    diff: string
}

export type analyticsOutput = {
    totalInvest: number
    currentPrice: number
    diff: string
}
