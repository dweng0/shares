import { buildTransactionDetails, byBankTransfers, byCardPayments, byNotPendingPayment, byPendingPayment, byprocessedPayment, getPaymentType } from '../helpers';
import { TransactionType } from '../../models/payment';
import { MOCK_ROW_CARD_PAYMENT, MOCK_PAYMENT_PARTIAL, MOCK_ROW_BANK_PAYMENT } from '../../__mocks__/test.mocks';
import { PaymentStatus } from '../../models/paymentmethods';

describe("Tests around the helper functions", () => {
    it("Should filter by bank transfers", () => {
        // setup, execute
        const bankTransfers = MOCK_PAYMENT_PARTIAL.filter(byBankTransfers);

        // verify
        expect(bankTransfers.length).toEqual(3);
    });

    it("Should filter by card payments", () => {
        // setup, execute
        const cardPayments = MOCK_PAYMENT_PARTIAL.filter(byCardPayments);

        // verify
        expect(cardPayments.length).toEqual(2);
    });
    
    it("Should filter by pending payments", () => {
        // setup, execute
        const pending = MOCK_PAYMENT_PARTIAL.filter(byPendingPayment);

        // verify
        expect(pending.length).toEqual(2);
    });

    it("Should filter by processedPayment", () => {
        // setup, execute
        const processed = MOCK_PAYMENT_PARTIAL.filter(byprocessedPayment);

        // verify
        expect(processed.length).toEqual(2);
    });

    it("Should filter by not pending payments", () => {
        // setup, execute
        const notPending = MOCK_PAYMENT_PARTIAL.filter(byNotPendingPayment);

        // verify
        expect(notPending.length).toEqual(3);
    });

    it("Should return the payment type based on the headers provided", () => {

        // setup
        const cardHeaders = ['test', 'test2', 'test3', 'card_id'];
        const bankHeaders = ['test', 'test2', 'test3', 'bank_account_id'];

        // execute
        const cardExpectation = getPaymentType(cardHeaders.join(','));
        const bankExpectation = getPaymentType(bankHeaders.join(','));
        const unknownExpectation = getPaymentType('test,test2,test3,test4');

        // verify
        expect(cardExpectation).toEqual(TransactionType.CARD);
        expect(bankExpectation).toEqual(TransactionType.BANK_TRANSFER);
        expect(unknownExpectation).toEqual(TransactionType.UNKNOWN);
    });

    it("Should build transaction details off of the row cells", () => {
        
        // setup, execute
        const cardPayment = buildTransactionDetails(TransactionType.CARD, MOCK_ROW_CARD_PAYMENT);
        const bankPayment = buildTransactionDetails(TransactionType.BANK_TRANSFER, MOCK_ROW_BANK_PAYMENT);

        // verify
        expect(cardPayment.bankTransfer).toBeUndefined();
        expect(cardPayment.card.status).toEqual(PaymentStatus.processed);

        expect(bankPayment.card).toBeUndefined();
        expect(bankPayment.bankTransfer.status).toEqual(PaymentStatus.pending);

    });

});