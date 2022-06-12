import { mkdtemp, readdir, stat, rm } from "fs/promises";
import { spawn } from "child_process";
import { CliFlags, RepoOwner } from "./types";
import { getRepoAndOwner, waitOnChildProcessToExit } from "./utils";
import ArrayStringMap from "array-string-map";
import filterAsync from "node-filter-async";
import { tmpdir } from "os";

export default async function handler(script: string, flags: CliFlags) {
  console.log(script, flags);
  const { owner: defaultOwner, _: repoNames } = flags;
  const repos: RepoOwner[] = [];
  for (const repoName of repoNames) {
    try {
      const [owner, repo] = getRepoAndOwner(repoName, defaultOwner);
      repos.push([owner, repo]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We need the `message` attribute.
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  }
  const tempDir = await mkdtemp(`${tmpdir()}/github-run-script-`);
  try {
    const directoryMapping: ArrayStringMap<RepoOwner, string> =
      new ArrayStringMap();
    const scanDirectories: Map<string, string[]> = new Map();
    if (flags.searchPath) {
      // If it's one path, it won't be in an array. This converts it into an array.
      if (typeof flags.searchPath === "string") {
        flags.searchPath = [flags.searchPath];
      }
      // What this code block does is simple. It stores in `scanDirectories`
      // a mapping of source path name to an array of directories in that directory.
      await Promise.all(
        flags.searchPath.map(async (path) => {
          scanDirectories.set(
            path,
            await filterAsync(await readdir(path), async (item) => {
              return (await stat(`${path}/${item}`)).isDirectory();
            })
          );
        })
      );
    }
    await Promise.all(
      repos.map(async ([owner, repo]) => {
        // First, we need to check if the repository exists in `scanDirectories`.
        // TODO: Handle cases where the same repo is present multiple times in
        // TODO: different directories, or if two repos with the same name but
        // TODO: different owners is provided. (Maybe we can check `.git`.)
        for (const [path, directories] of scanDirectories) {
          for (const directory of directories) {
            if (repo === directory) {
              directoryMapping.set([owner, repo], path);
              break;
            }
          }
          // If we already found a match earlier, no need to re-iterate over the other
          // directories.
          if (directoryMapping.has([owner, repo])) {
            break;
          }
        }
        // Deal wit the special case where we did not find a match. Time to clone.
        if (!directoryMapping.has([owner, repo])) {
          const destPath = `${tempDir}/${repo}`;
          console.log(`Cloning ${owner}/${repo} to ${destPath}`);
          const childProc = await spawn(
            "git",
            ["clone", `https://github.com/${owner}/${repo}.git`, destPath],
            { stdio: "inherit" }
          );
          await waitOnChildProcessToExit(childProc);
          directoryMapping.set([owner, repo], destPath);
        }
        // Time to execute the script!
        const path = directoryMapping.get([owner, repo]);
        const childProc = await spawn(script, [], {
          cwd: path,
          env: {
            ...process.env,
            REPO_OWNER: owner,
            REPO_NAME: repo,
            REPO: `${owner}/${repo}`,
            REPO_PATH: path,
          },
          stdio: "inherit",
        });
        await waitOnChildProcessToExit(childProc);
      })
    );
  } finally {
    // We need to clean up the temporary directory.
    await rm(tempDir, { recursive: true, force: true });
  }
}
