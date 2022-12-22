import BigNumber from 'bignumber.js';
import fs from 'fs';
import { TransactionType } from '../models/payment';

interface SanitizedInputs {
    csv_path: string;
    source: TransactionType;
    share_price: BigNumber;
    errors: string[];
}

/**
 * Problem:     We dont know what the users' has input into the CLI
 * Solution:    A service that is given the three arguments of unknown type provided by the user and we sanitize them,
 * @see TransactionType
 * @param csv_path Path to the payments CSV file
 * @param source The source of the payment
 * @param share_price Share price to generate share orders for e.g. "1.30"
 * @param checker A dependency injected function that checks if a file exists
 * @returns the sanitized inputs and an array of errors - this will be empty if there are no errors
 */
export const errorBoundary = (csv_path: unknown, source: unknown, share_price: unknown, checker?: (path: string) => boolean): SanitizedInputs => {
    const fileCheck = checker || fs.existsSync;
    // set defaults
    const sanitizedInputs: SanitizedInputs = {
        csv_path: '',
        source: TransactionType.CARD,
        share_price: new BigNumber(0),
        errors: []
    }

   // Step 1: Validate inputs
    if (!csv_path) {
        sanitizedInputs.errors.push('No CSV path was provided');
    }

    if(!source) {
        sanitizedInputs.errors.push('No payment source was provided, please use "card" or "bank"');
    }

    if(!share_price) {
        sanitizedInputs.errors.push('No share price was provided');
    }

    // Step 2: Sanitize inputs
    try { 
        console.log('share price is ', share_price)
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
        if(!fileCheck(csv_path as string)) {
            sanitizedInputs.errors.push('Please specify a valid path to the CSV file');
        }  else if(!csv_path.toString().endsWith('.csv')) {
            sanitizedInputs.errors.push('Please specify a valid path to the CSV file with the correct file extension');
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
