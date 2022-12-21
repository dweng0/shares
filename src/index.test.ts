import { spawn } from "child_process";

describe("CLI tests", () => {
    it("should run the CLI", () => {
        const cli = spawn("node", ["src/index.js"]);
        cli.stdin.write("");
        cli.stdin.end();
        cli.stdout.on("data", data => {
            console.debug(data.toString())
            expect(data.toString()).toContain("Quick Shares lol");
        }
        );
    });
});
