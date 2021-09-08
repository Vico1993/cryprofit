import fs from 'fs'
import { createInterface, Interface } from 'readline'
import { reportRow } from '.'

const readFile = async (reader: Interface): Promise<unknown[]> => {
    const response = []

    await new Promise((resolve, reject) => {
        reader.on('error', reject)
        reader.on('line', (row) => {
            response.push(row.split(','))
        })
        reader.on('close', resolve)
    })

    return response
}

export const parse = async (path: string): Promise<void> => {
    const reader = createInterface({
        input: fs.createReadStream(path),
    })

    const rows = await readFile(reader)

    const header = rows.shift()

    console.log(rows, header)
}

/*
[
    'Timestamp',
    'Transaction Type',
    'Asset',
    'Quantity Transacted',
    'CAD Spot Price at Transaction',
    'CAD Subtotal',
    'CAD Total (inclusive of fees)',
    'CAD Fees',
    'Notes'
],
*/
