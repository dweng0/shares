import { platform } from './platform';
import uiOptions from './inquireui';
import { errorBoundary } from './errorboundary';
/**
 * Takes the CLI and sanitizes user inputs before interacting with the 
 * platform
 * @see getCLI
 */
export const cliInputs = async () => {

    const   options = await uiOptions();
    console.log(options)
    // Step 1: Error boundary
    const {csv_path, share_price, errors} = errorBoundary(options.csv_path, options.source, options.share_price);
    if(errors.length) {
        console.log(errors.reduce((acc, curr) => `${acc}\n${curr}`));
        return;
    }

    // Step 2: Interact with the platform
    console.log('Getting share price for ', share_price.toString());

    // Step 3: pass platform service
    platform(csv_path, share_price);

}

export default cliInputs;