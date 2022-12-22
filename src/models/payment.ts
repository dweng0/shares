import BigNumber from "bignumber.js";

export enum TransactionType {
    CARD = 'CARD',
    BANK_TRANSFER = 'BANK_TRANSFER'
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