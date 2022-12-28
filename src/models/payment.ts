import BigNumber from "bignumber.js";
import { Card, BankTransfer } from "./paymentmethods";

/**
 * Enumeration of the different transaction types
 */
export enum TransactionType {
    CARD = 'CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    UNKNOWN = 'UNKNOWN'
}

/**
 * Specific details of a payment transaction  
 */
export interface TransactionDetails {
    transactionType: TransactionType;
    card?: Card;
    bankTransfer?: BankTransfer;
}

/**
 * Payment object contains meta data about a payment as well as transaction details
 */
export interface Payment {
    customerId: number;
    date: string;
    amount: BigNumber;
    fee: number;
    transactionDetails:TransactionDetails;
}