import BigNumber from "bignumber.js";
import { byBankTransfers, byCardPayments, byNotPendingPayment, byPendingPayment } from "./helpers";
import { DEFAULT_SHARES_FILENAME } from '../constants';
import { exportToCsv, getPaymentsFromCSV } from '../controller/downstream';
import { getBankTransferResults } from "../controller/upstream";
import { generateShareOrders } from "../controller/shares";

/**
 * Platform service
 * NOTE: The CLI tool writes any console logs to the shell.
 * @param csv_path 
 * @param source 
 * @param share_price 
 * @returns 
 */
export const platform = async (csv_path: string, share_price: BigNumber): Promise<number> => {

    // Step 1: Read CSV file
    let payments;
    try {
        payments = await getPaymentsFromCSV(csv_path);
    } catch {
        return 1;
    }

    if(!payments || payments.length === 0) {
        console.log('No payments found in CSV file');
        return 1;
    }

    // Step 2: Filter payments
    const cardPayments = payments.filter(byCardPayments)
    const bankTransferPayments = payments.filter(byBankTransfers);

    // Step 3: Wait for pending bank transfers to complete
    const processedBankTransferPayments =  await getBankTransferResults(bankTransferPayments.filter(byPendingPayment));

    // Step 4: Spread all results back into a single array
    const processedPayments = [
        ...cardPayments.filter(byNotPendingPayment), 
        ...bankTransferPayments.filter(byNotPendingPayment), 
        ...processedBankTransferPayments];

    // Step 5: Generate share orders
    const shareOrders = generateShareOrders(processedPayments, share_price);

    // Step 6: Write share orders to CSV file
    const success = exportToCsv(shareOrders, DEFAULT_SHARES_FILENAME, ['customer_id', 'shares']);
    if(success) {
        console.log('Share orders exported to CSV file');
    } else {
        console.log('Failed to export share orders to CSV file');
        return 1;
    }
    return 0;
}