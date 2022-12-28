import { Payment }              from "../models/payment";
import BigNumber                from 'bignumber.js';
import { FEE }                  from '../constants';
import { 
    getPaymentType, 
    buildTransactionDetails }   from '../services/helpers';
import { TransactionType }      from "../models/payment";

/**
 * Generates a payment object from a csv row
 * @param cells the cells of the csv row
 * @param paymentType the type of payment
 * @returns Payment
 */
export const generatePayment = (cells: string[], paymentType: TransactionType): Payment => {
    const totalAmount = new BigNumber(cells[2])
    return {
        customerId: Number(cells[0]),
        date: cells[1],
        amount: totalAmount,
        transactionDetails: buildTransactionDetails(paymentType, cells),
        fee: totalAmount.multipliedBy(FEE).toNumber(),
    }
};

/**
 * Generates an array of payments from a csv file
 * @param content the content of the csv file as a string in utf8
 * @returns Payment[]
 */
export const generatePayments = (content: string): Payment[] => {
    const lines = content.split(/\r?\n/);
    const payments: Payment[] = [];
    for (let i = 1; i < lines.length; i++) {
         // ignore empty lines (e.g. last line)
        if(lines[i] !== '') {
            const paymentType = getPaymentType(lines[0])
            const cells = lines[i].split(',');
            payments.push(generatePayment(cells, paymentType));
        }
    }
    return payments;
}