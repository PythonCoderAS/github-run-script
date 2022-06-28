import { ChildProcess } from "child_process";
import { GenerateTemplateCliFlags, RepoOwner, Template } from "./types";
import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";

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

export async function getOutputPath(
  template: Template,
  flags: GenerateTemplateCliFlags
) {
  let { outputDir, outputFile } = flags;
  outputDir =
    outputDir ?? (await mkdtemp(`${tmpdir()}/github-run-script-template-`));
  outputFile = outputFile ?? template.defaultFileName;
  return `${outputDir}/${outputFile}`;
}
