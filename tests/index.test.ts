import { expect, use } from "chai";
import chaiAsPromised = require("chai-as-promised");
import { runScript, runScriptOutput } from "subprocess-test-utils";

use(chaiAsPromised);

/**
 * Returns a boolean indicating whether the given command ran successfully or not.
 * @param args
 */
async function runCommandWithArgs(args: string[]): Promise<boolean> {
  return runScript("node", ["dist/index.js", ...args]);
}

async function runCommandWithArgsForOutput(
  args: string[]
): Promise<{ stdout: string; stderr: string }> {
  return runScriptOutput("node", ["dist/index.js", ...args]);
}
describe("github-run-script base tests", () => {
  it("should not run with no arguments", () =>
    expect(runCommandWithArgs([])).to.eventually.equal(false));
  it("should do nothing", () =>
    expect(runCommandWithArgs(["env"])).to.eventually.equal(true));
  it("should have the repo name", () =>
    expect(
      runCommandWithArgsForOutput(["env", "PythonCoderAS/github-run-script"])
    )
      .to.eventually.have.property("stdout")
      .which.contain("PythonCoderAS/github-run-script"));
});
