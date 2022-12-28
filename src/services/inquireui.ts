import inquirer from "inquirer";

export interface Answers {
    csv_path: string;
    source: string;
    share_price: string;
}

/**
 * CLI UI that uses inquirer instead of Commander 
 * @returns a Promise of Answers (Options)
 */
const inputCLI = (): Promise<Answers> => {
    return inquirer.prompt([
        {
            type: "input",
            name: "csv_path",
            message: "Path to the payments CSV file"
        },
        {
            type: "list",
            choices: ["card", "bank"],
            name: "source",
            message: "The source of the payment, currently only \"card\" is supported"
        },
        {
            type: "input",
            name: "share_price",
            message: "Share price to generate share orders for e.g. \"1.30\""
        }
    ]).catch((error) => {
        if (error.isTtyError) {
            console.log('Failed to render inquirer UI');
          } else {
            console.log('Couldnt get user input');
          }
    }); 
}

export default inputCLI;
