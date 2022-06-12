import { exec } from "child_process";
import { promisify } from "util";
import { expect, use } from "chai";
import chaiAsPromised = require("chai-as-promised");

use(chaiAsPromised);

/**
 * Returns a boolean indicating whether the given command ran successfully or not.
 * @param args
 */
async function runCommandWithArgs(args: string[]): Promise<boolean> {
  const childProcPromise = promisify(exec)(
    ["node", "dist/index.js", ...args].join(" ")
  );
  try {
    await childProcPromise;
  } catch (e: unknown) {
    return false;
  }

  return true;
}

async function runCommandWithArgsForOutput(
  args: string[]
): Promise<{ stdout: string; stderr: string }> {
  const childProcPromise = promisify(exec)(
    ["node", "dist/index.js", ...args].join(" ")
  );
  try {
    return await childProcPromise;
  } catch (e: any) {
    // Error object has stdout/stderr
    return e;
  }
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
