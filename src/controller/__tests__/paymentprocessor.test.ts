import { MOCK_CARD_PAYMENT_STRING } from "../../__mocks__/test.mocks";
import { TransactionType } from "../../models/payment";
import { generatePayment, generatePayments } from "../paymentprocessor";
import { PaymentStatus } from "../../models/paymentmethods";
import { FEE } from "../../constants";

describe("Tests for create payment objects from content strings", () => {

    it("Should return a payment object with the correct values", () => {
        // setup
        const cells = ['1', '2020-01-01', '100', '1234567890', 'processed'];
        const paymentType = TransactionType.CARD;

        // execute
        const payment = generatePayment(cells, paymentType);
        console.debug(payment);
        // verify
        expect(payment.customerId).toEqual(1);
        expect(payment.date).toEqual('2020-01-01');
        expect(payment.amount.toString()).toEqual("100");
        expect(payment.transactionDetails.card.id).toEqual(1234567890);
        expect(payment.transactionDetails.card.status).toEqual(PaymentStatus.processed);
        expect(payment.fee).toEqual(payment.amount.multipliedBy(FEE).toNumber());
    });

    it("Should return an array of payment objects", () => { 
        // setup, execute
        const payments = generatePayments(MOCK_CARD_PAYMENT_STRING);

        // verify
        expect(payments.length).toEqual(3);
        expect(payments[0].customerId).toEqual(123);
        expect(payments[0].date).toEqual('2019-01-12');
        expect(payments[0].amount.toString()).toEqual("900");        
    });
        
});