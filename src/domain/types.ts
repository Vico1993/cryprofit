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

export type analyticsDetailOutput = {
    [key: string]: analyticsOutput
}

export type analyticsOutput = {
    totalInvest: number
    currentPrice: number
    diff: string
    details?: analyticsDetailOutput
}
