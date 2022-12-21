
interface Payment {
    customerId: number;
    date: string;
    amount: number;
    fee: number;
    card: Card;
    isSuccessful: boolean;
}