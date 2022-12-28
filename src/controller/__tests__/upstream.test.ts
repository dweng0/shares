import { Payment } from '../../models/payment';
import { byBankTransfers, byPendingPayment } from '../../services/helpers';
import { MOCK_PAYMENT_PARTIAL } from '../../__mocks__/test.mocks';
import { getBankTransferResult, getBankTransferResults } from '../upstream';

describe("Tests for grabbing data from upstream", () => {
    it("Should get the payment result from upstream", async () => {
        // setup 
        const bankPayments = MOCK_PAYMENT_PARTIAL
                                .filter(byBankTransfers)
                                .filter(byPendingPayment)
        // execute
        const result = await getBankTransferResult(bankPayments[0] as Payment);

        // verify
        expect(result.transactionDetails.bankTransfer.status).toBe('processed');


    });

    it("Should get the array payment results from upstream", async () => {
        // setup 
        const bankPayments = MOCK_PAYMENT_PARTIAL
                .filter(byBankTransfers)
                .filter(byPendingPayment)

        // execute
        const result = await getBankTransferResults(bankPayments as Payment[]);

        // verify
        expect(result.every(payment => payment.transactionDetails.bankTransfer.status === 'processed')).toBe(true);
    });
});