import csv from 'csv-parser'
import { createReadStream } from 'fs'

/**
 * Extract information from a CSV
 *
 * @param {string} filepath
 * @returns {Promise<T>}
 */
export const loadCSV = async <T>(filepath: string): Promise<T[]> => {
    const data: T[] = []

    const readStream = createReadStream(filepath)
        .pipe(csv())
        .on('data', (elm) => data.push(elm))

    await new Promise((resolve) => {
        readStream.on('finish', resolve)
    })

    return data
}
