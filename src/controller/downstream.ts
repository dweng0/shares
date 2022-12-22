import { writeFile } from "fs/promises";
import BigNumber from 'bignumber.js';
import { readFile } from 'fs\promises';
import { Payment } from '../models/payment';
import { FEE } from '../constants';
import { getPaymentType } from "src/services/helpers";
import { buildTransactionDetails } from "src/services/helpers";

const DEFAULT_HEADERS   = ['customer_id', 'shares'];
const DEFAULT_TYPE      = 'utf-8';

/**
 * Writes a csv file to disk
 * @param shares the shares to write to the file
 * @param filename the name of the file
 * @param headers the headers to use
 * @param fileWriter the function to use to write the file
 * @returns Promise<boolean>
 */
export const exportToCsv = (shares: Record<string, number>, filename: string, headers?: string[], fileWriter?: (file: string, content: string, options: {encoding: string}) => Promise<void>): Promise<boolean> => { 
    return new Promise((resolve, reject) => {        
        //return false if shares is empty
        if (Object.keys(shares).length === 0) {
            resolve(false);
        }

        // setup headers, rows and ls
        const lineSeperator = ',';
        const header        = headers ? headers.join(lineSeperator) : DEFAULT_HEADERS.join(lineSeperator);        
        const row           = Object.keys(shares).map((key) => {
                                return `${key}${lineSeperator}${shares[key]}`;
                            }).join('\n');

        // build the file
        const csv   = `${header}\n${row}`;
        const file  = `${filename}.csv`;

        // write the file
        const writer = fileWriter ? fileWriter : writeFile;
        writer(file, csv, { encoding: DEFAULT_TYPE }).then(() => {
            resolve(true);
        })
        .catch((err) => {
            reject(err);
        }); 
    });   
}


/**
 * IT: reads a csv file and returns an array of payments
 * 
 * @param csv_path the path to the file
 * @param fileReader dependency injected function that reads a file and returns a promise
 * @returns {Promise<Payment[]>}
 */
export const getPaymentsFromCSV = (csv_path: string, fileReader?: (path: string, encoding: string) => Promise<string>): Promise<Payment[]> => {
    const reader = fileReader || readFile;
    return reader(csv_path, 'utf8')
        .then((data: string) => {
            const lines = data.split(/\r?\n/);
            const payments: Payment[] = [];
            for (let i = 1; i < lines.length; i++) {
                const paymentType = getPaymentType(lines[0])
                const columns = lines[i].split(',');
                const totalAmount = new BigNumber(columns[2])
                const payment: Payment = {
                    customerId: Number(columns[0]),
                    date: columns[1],
                    amount: totalAmount,
                    transactionDetails: buildTransactionDetails(paymentType, columns),
                    fee: totalAmount.multipliedBy(FEE).toNumber(),
                }
                payments.push(payment);
            }
            return payments;
        })
        .catch(() => {
            console.log('Failed to read CSV file from upstream, format incorrect')
        });
}
