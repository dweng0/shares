#!/usr/bin/env node

import { getCLI } from "./services/cli";


const cmd = getCLI();
const options = cmd.opts();

if (!process.argv.slice(2).length) {
  cmd.outputHelp();
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