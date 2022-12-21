import BigNumber from 'bignumber.js';
import fs from 'fs';

interface SanitizedInputs {
    csv_path: string;
    source: TransactionType;
    share_price: BigNumber;
    errors: string[];
}

/**
 * Problem:     We dont know what the users has input into the CLI
 * Solution:    A service that is given the three arguments provided by the user and sanitizes them,
 * 
 * {@see cliInputs}
 * @param csv_path Path to the payments CSV file
 * @param source The source of the payment, {@see TransactionType}
 * @param share_price Share price to generate share orders for e.g. "1.30"
 * @returns the sanitized inputs and an array of errors - this will be empty if there are no errors
 */
export const errorBoundary = (csv_path: unknown, source: unknown, share_price: unknown): SanitizedInputs => {

    // set defaults
    const sanitizedInputs: SanitizedInputs = {
        csv_path: '',
        source: TransactionType.CARD,
        share_price: new BigNumber(0),
        errors: []
    }

   // Step 1: Validate inputs
    if (!csv_path) {
        sanitizedInputs.errors.push('Please specify a path to the CSV file');
    }

    if(!source) {
        sanitizedInputs.errors.push('Please specify a source payment method "card" or "bank"');
    }

    if(!share_price) {
        sanitizedInputs.errors.push('Please specify a share price to generate share orders for');
    }

    // Step 2: Sanitize inputs
    try { 
        if(new BigNumber(share_price as string).isNaN()) {
            sanitizedInputs.errors.push('Please specify a valid share price to generate share orders for');
        }
    
        if(new BigNumber(share_price as string).isNegative()) {
            sanitizedInputs.errors.push('Please specify a positive share price to generate share orders for');
        } else { 
            // set share_price
            sanitizedInputs.share_price = new BigNumber(share_price as string);
        }
    
        // check file path exists
        if(!fs.existsSync(csv_path as string)) {
            sanitizedInputs.errors.push('Please specify a valid path to the CSV file');
        } 
    
        // check if file is a csv file
        if(!csv_path.toString().endsWith('.csv')) {
            sanitizedInputs.errors.push('Please specify a valid path to the CSV file');
        } else { 
            // set csv_path
            sanitizedInputs.csv_path = csv_path as string;
        }

    } catch (e) {
        sanitizedInputs.errors.push('Input values were invalid, please try again.');
    }
    
    // check source is valid
    if(source !== 'card' && source !== 'bank') {
        sanitizedInputs.errors.push('Please specify a valid source payment method "card" or "bank"');
    } else { 
        // set source
        sanitizedInputs.source = source as TransactionType;
    }
    
    return sanitizedInputs;
}
