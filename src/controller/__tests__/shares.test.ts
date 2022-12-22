import BigNumber from 'bignumber.js';
import { MOCK_CARD_PAYMENT_STRING } from '../../__mocks__/test.mocks';
import { generatePayments } from '../paymentprocessor';
import { generateShareOrders } from '../shares';
describe("Tests for share generation", () => {
    it("Should return a share with the correct values", () => {
        // setup
        const payments = generatePayments(MOCK_CARD_PAYMENT_STRING);
        const mockCustomerId = 123;

        // there are two payments for customer 123, each with an amount of 900
        // the share price is 100, (900 / 100) * 2 = 18. So the total shares for customer 123 should be 18
        const expectedOutput = 18;

        // execute
        const shares = generateShareOrders(payments, new BigNumber(100));
        
        // verify
        expect(shares[mockCustomerId]).toEqual(expectedOutput);
    });
});
