import chalk    from 'chalk';
import clear    from 'clear';
import cmd      from 'commander';
import figlet   from 'figlet';

/**
* IT: Creates and returns a simple CLI 
* @returns a CLI object
* {@see https://www.npmjs.com/package/commander }
*/
export const getCLI = (): cmd.Command => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Quick Shares', { horizontalLayout: 'full' })
      )
    );
    
    cmd.program
        .description("Get share prices")
        .option('-c, --csv_path', 'Path to the payments CSV file')
        .option('-s, --source', 'The source of the payment, currently only \"card\" is supported')
        .option('-p, --share_price', 'Share price to generate share orders for e.g. \"1.30\"')
        .parse(process.argv);
    return cmd.program;
  }