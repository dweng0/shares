import uiOptions from './inquireui';
import { errorBoundary } from './errorboundary';
import BigNumber from 'bignumber.js';

interface CLIParams {
    csv_path:       string;
    share_price:    BigNumber;
}
/**
 * IT: Provides the UI for the user to interact with the platform
 * @see getCLI
 */
export const cliInputs = async (): Promise<CLIParams> => {

    const   options = await uiOptions();

    // Step 1: Error boundary
    const {csv_path, share_price, errors} = errorBoundary(options.csv_path, options.source, options.share_price);
    
    if(errors.length) {
        console.log(errors.reduce((acc, curr) => `${acc}\n${curr}`));
        return;
    }

    // Step 2: Interact with the platform
    console.log('Getting share price for ', share_price.toString());

    // Step 3: Return the sanitized inputs
    return {
        csv_path,
        share_price
    }

}

export default cliInputs;