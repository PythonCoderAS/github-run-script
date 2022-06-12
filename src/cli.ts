import * as sade from "sade";
import handler from "./handler";

// eslint-disable-next-line @typescript-eslint/no-var-requires -- Needed in order to not copy over package.json and make new src directory inside of dist
const { version, description } = require("../package.json");

const cli = sade("github-run-script <script>", true)
  .version(version)
  .describe(description)
  .option(
    "-o, --owner",
    "The owner for repositories without an explicit owner."
  )
  .option(
    "-s, --search-path",
    "A path to search for already-cloned repositories."
  )
  .action(handler);

export default cli;
