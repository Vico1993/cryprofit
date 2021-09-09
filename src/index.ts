#!/usr/bin/env node

import chalk from 'chalk'
import * as path from 'path'
import { Command } from 'commander'
import clear from 'clear'
import figlet from 'figlet'
import { parse } from './parse'
import { input } from './types'

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
    // .option('-p --path', 'File path for the CSV')
    .action(async (opts, comand) => {
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

        const data = require('./../input.json') as input[]

        const { quotes, totalInvest, totalCurrentValue } = await parse(data, asset, debug)

        // Overview
        console.table(quotes)

        // Result
        console.table({
            'Total invest': totalInvest,
            'Total current Value': parseFloat(totalCurrentValue.toFixed(2)),
            'Diff ( in CAD )': `$${((totalCurrentValue - totalInvest) / totalInvest).toFixed(5)}`,
            'Diff ( in % )': `${(((totalCurrentValue - totalInvest) / totalInvest) * 100).toFixed(
                2,
            )}%`,
        })
    })
    .parse(process.argv)
