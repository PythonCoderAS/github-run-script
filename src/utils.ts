import { ChildProcess } from "child_process";
import { RepoOwner } from "./types";

export function getRepoAndOwner(
  input: string,
  defaultOwner?: string
): RepoOwner {
  let [owner, repo] = input.split("/");
  if (!repo) {
    // This means that there was no slash, so we need to do some reassignments.
    repo = owner;

    if (!defaultOwner) {
      throw new Error(
        `${input}: No owner specified and no default owner was provided.`
      );
    }

    owner = defaultOwner;
  }

  return [owner, repo];
}

export async function waitOnChildProcessToExit(process: ChildProcess) {
  return new Promise((resolve, reject) => {
    process.on("exit", resolve);
    process.on("error", reject);
  });
}
