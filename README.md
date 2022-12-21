# peace-is-optional

Running:

use the following command to run it locally:

"npx ts-node src/index.ts"

Provide the following arguments:

Options:
  -c, --csv_path     Path to the payments CSV file
  -s, --source       The source of the payment, currently only "card" is supported
  -p, --share_price  Share price to generate share orders for e.g. "1.30"
  -h, --help         display help for command

  Example usage, while in the working directory
```
  npx ts-node src/index.ts -p "1232" -c path/to/thing -s card
```