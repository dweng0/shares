import BigNumber from "bignumber.js";
import { readFile } from "fs/promises";
import { Payment, TransactionType } from "../models/payment";

/**
 * Platform service
 * 
 * @param csv_path 
 * @param source 
 * @param share_price 
 * @returns 
 */
export const platform = (csv_path: string, source: TransactionType, share_price: BigNumber) => {

    // Step 1: Read CSV file
    const payments = getPaymentsFromCSV(csv_path)

    // Step 2: Filter payments
    const filteredPayments = filterPayments(payments, source);

    // Step 3: Generate share orders
    const shareOrders = generateShareOrders(filteredPayments, share_price);

    // Step 4: Write share orders to CSV file
    return writeCSV(shareOrders);
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
        .then(data => {
            const lines = data.split(/\r?\n/);
            const payments: Payment[] = [];
            for (let i = 1; i < lines.length; i++) {
                const paymentType = getPaymentType(lines[0])
                const columns = lines[i].split(',');
                const payment: Payment = {
                    customerId: Number(columns[0]),
                    date: columns[1],
                    amount: new BigNumber(columns[2]),
                    currency: columns[3],
                    source: columns[4]
                }
                payments.push(payment);
            }
            return payments;
        })
        .catch(err => {
            console.log('failed to read CSV file')
            return [];
        });
}

export const getPaymentType = (header: string): TransactionType => {
    const columns = header.split(',');
    switch (columns[3]) { 
        case 'card_id':
            return TransactionType.CARD;
        case 'bank_account_id':
            return TransactionType.BANK_TRANSFER;
        default:
            throw 
            return TransactionType.CARD;
    }
}