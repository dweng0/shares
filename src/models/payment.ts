import BigNumber from "bignumber.js";
import { Card, BankTransfer } from "./paymentmethods";

export enum TransactionType {
    CARD = 'CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    UNKNOWN = 'UNKNOWN'
}

export interface TransactionDetails {
    transactionType: TransactionType;
    card?: Card;
    bankTransfer?: BankTransfer;
}

export interface Payment {
    customerId: number;
    date: string;
    amount: BigNumber;
    fee: number;
    transactionDetails:TransactionDetails;
}