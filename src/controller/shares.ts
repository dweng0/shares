import BigNumber    from 'bignumber.js';
import { Payment }  from '../models/payment';

/**
 * Builds the share hashmap by reducing the payments array into a hashmap (record obj in TS)
 * NOTE: The CLI tool writes any console logs to the shell.
 * @param processedPayments list of processed payments
 * @param share_price
 * @returns Share order: Record<customer_id, amount>
 */
export const generateShareOrders = (processedPayments: Payment[], share_price: BigNumber): Record<string, number>=> {
    const shareOrders: Record<string, number> = {};
    
    return processedPayments.reduce((acc, payment, currentIndex) => {      
        if(!acc[payment.customerId]) {
            acc[payment.customerId] = 0;
        }

        console.log(`Building shares ~${BigNumber(currentIndex).dividedBy(processedPayments.length).multipliedBy(100).toFixed(2)}% complete`);
        
        // take the current shares and add this payments' shares to it.
        const additionalShares = payment.amount.dividedBy(share_price).plus(acc[payment.customerId]);
        acc[payment.customerId] = additionalShares.toNumber();
        return acc;
    }, shareOrders);
}
