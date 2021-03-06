#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import clear from 'clear'
import figlet from 'figlet'
import { existsSync } from 'fs'
import { transactionModel } from './domain'
import { initCoinMarketCap } from './service'
import { loadCSV } from './domain/parser'
import { resolve } from 'path'
import { CryptoDotCom } from './domain/parser/cryptoDotCom/cryptoCom'

const program = new Command()

clear()

console.info(chalk.blueBright(figlet.textSync('Cryprofit', { horizontalLayout: 'full' })))

program
    .version('1.0.0')
    .description(
        'This CLI will help you to know what are your profit and lose. Will read from a CSV',
    )
    .option('-a --asset <code>', 'Can choose a crypto, ex: BTC')
    .option('-d --debug', 'List all trade with a Lost or profit')
    .option('-c --crypto', 'Work on the feature for CRYPTO.com')
    .option('-p --path <path>', 'File path for the CSV based on the current location')
    .action(async (opts) => {
        let asset = null
        let debug = false

        if (opts.debug) {
            debug = true
        }

        if (opts.asset) {
            asset = program.opts().asset
        }

        if (debug) {
            console.info('')
            console.info('')
            console.info('')
            console.info(`************************DEBUG************************`)
            console.info('')

            if (!asset) {
                console.info(`Script will run with no asset filter`)
            } else {
                console.info(`Script will run with ${asset}`)
            }

            console.info('')
            console.info('Options:')
            console.info(program.opts())

            console.info('')
            console.info(`************************DEBUG************************`)
            console.info('')
            console.info('')
        }

        // Default behavior
        const coinMarketCapClient = initCoinMarketCap({
            debug: debug,
        })
        const model = new transactionModel(coinMarketCapClient)

        let earn
        let transactions
        if (program.opts().crypto) {
            const crypto = new CryptoDotCom()

            transactions = crypto.buildTransaction(await loadCSV(resolve('./reports/crypto.csv')))
            earn = crypto.getEarn()

            for (const asset in earn) {
                earn[asset].value = (
                    earn[asset].quantity * (await coinMarketCapClient.getAssetValue(asset))
                ).toFixed(2)
            }
        } else {
            const filePath = __dirname + '/../' + program.opts().path
            if (!existsSync(filePath)) {
                console.error(
                    `Couldn't find the file you are looking for, I'm looking at: ${filePath}`,
                )

                return
            }

            transactions = model.builder(__dirname + '/../' + program.opts().path)
        }

        const transactionsOutput = await model.toOutput(transactions)

        // Overview
        console.table(transactionsOutput)

        const { details, ...analitycs } = model.calculateAnalytics(transactionsOutput)

        console.table(analitycs)

        console.log(' -- DETAILS -- ')
        console.table(details)

        console.log(' -- EARN -- ')
        console.table(earn)
    })
    .parse(process.argv)
