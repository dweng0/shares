#!/usr/bin/env node

import { cliInputs } from './services/cliinputs';
import { platform } from './services/platform';

// runs the script
const main = async () => {
    
    // take from ui
    const { csv_path, share_price} = await cliInputs();

    // pass to platform
    platform(csv_path, share_price);
}

main();