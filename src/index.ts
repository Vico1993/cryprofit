#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import clear from 'clear'
import figlet from 'figlet'
import { existsSync } from 'fs'
import { transactionModel } from './domain'
import { initCoinMarketCap } from './service'

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

        const model = new transactionModel(
            initCoinMarketCap({
                debug: debug,
            }),
        )

        const filePath = __dirname + '/../' + program.opts().path
        if (!existsSync(filePath)) {
            console.error(`Couldn't find the file you are looking for, I'm looking at: ${filePath}`)

            return
        }

        const transactions = model.builder(__dirname + '/../' + program.opts().path)
        const transactionsOutput = await model.toOutput(transactions)

        // Overview
        console.table(transactionsOutput)

        const { details, ...analitycs } = model.calculateAnalytics(transactionsOutput)

        console.log(' -- DETAILS -- ')
        console.table(details)

        console.table(analitycs)
    })
    .parse(process.argv)
