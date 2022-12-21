#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import cmd from "commander";


clear();
console.log(
  chalk.yellow(
    figlet.textSync('Quick Shares', { horizontalLayout: 'full' })
  )
);

cmd.program
  .description("Get share prices")
  .option('-c, --csv_path', 'Path to the payments CSV file')
  .option('-s, --source', 'The source of the payment, currently only \"card\" is supported')
  .option('-p, --share_price', 'Share price to generate share orders for e.g. \"1.30\"')
  .parse(process.argv);

const options = cmd.program.opts();

if (!process.argv.slice(2).length) {
  cmd.program.outputHelp();
} else { 

/**
 * ========================================
 * CLI ERROR BOUNDARY
 * ========================================
 */
let hasErrors = false;
if (!options.csv_path) {
    console.error('Please specify a path to the CSV file');
    hasErrors = true;
}
if(!options.source) {
    console.error('Please specify a source payment method "card" or "bank"');    
    hasErrors = true;
}

if(!options.share_price) {
    console.error('Please specify a share price to generate share orders for');
    hasErrors = true;
}

if(!hasErrors) {
console.log('Getting share price for:');
if (options.share_price) console.log('-', options.share_price);
}
}