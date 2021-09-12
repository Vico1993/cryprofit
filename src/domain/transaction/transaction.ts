import { transactionEntity } from '../types'

export class transaction implements transactionEntity {
    public date: string
    public price: number
    public asset: string
    public quantity: number
    public assetPrice: number

    constructor({ date, asset, quantity, price, assetPrice }: transactionEntity) {
        this.date = new Date(date).toLocaleDateString('en-ca')
        this.price = price
        this.asset = asset
        this.quantity = quantity
        this.assetPrice = assetPrice
    }
}
