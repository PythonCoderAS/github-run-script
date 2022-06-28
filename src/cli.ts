import * as sade from "sade";
import handler from "./handler";
import addTemplates from "./template";

// eslint-disable-next-line @typescript-eslint/no-var-requires -- Needed in order to not copy over package.json and make new src directory inside of dist
const { version, description } = require("../package.json");

let cli = sade("github-run-script")
  .version(version)
  .describe(description)
  .command("execute <script>", "Execute a script on the given repositories", {
    default: true,
  })
  .option(
    "-o, --owner",
    "The owner for repositories without an explicit owner."
  )
  .option("-s, --search", "A path to search for already-cloned repositories.")
  .option("-t, --terminate", "Terminate any spawned processes on error.")
  .option("--signal", "The signal to terminate a process with.")
  .action(handler);

cli = addTemplates(cli);

export default cli;
