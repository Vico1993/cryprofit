#!/usr/bin/env node

import chalk from 'chalk'
import * as path from 'path'
import { Command } from 'commander'
import clear from 'clear'
import figlet from 'figlet'

const program = new Command()

clear()

console.log(chalk.green(figlet.textSync('Cryprofit test', { horizontalLayout: 'full' })))

program
    .version('1.0.0')
    .description('This CLI will help you to know what are your profit and lose')
    .option('-c --crypto <code>', 'Can choose a crypto, ex: BTC')
    .option('-d --debug', 'List all trade with a Lost or profit')
    .action((opts, comand) => {
        let debug = false
        // For now use a DEFAULT crypto
        let crypto = 'BTC'

        if (opts.debug) {
            debug = true
        }

        if (opts.crypto) {
            crypto = program.opts().crypto
        }

        console.log(`Script will run with BTC, DEBUG: ${debug}`)
    })
    .parse(process.argv)
