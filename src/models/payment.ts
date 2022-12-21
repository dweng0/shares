enum TransactionType {
    CARD = 'CARD',
    BANK_TRANSFER = 'BANK_TRANSFER'
}

interface TransactionDetails {
    transactionType: TransactionType;
    card?: Card;
    bankTransfer?: BankTransfer;
}

interface Payment {
    customerId: number;
    date: string;
    amount: number;
    fee: number;
    transactionDetails:TransactionDetails;
    isSuccessful: boolean;
}