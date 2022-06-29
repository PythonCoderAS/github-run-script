import { chmod, writeFile } from "fs/promises";
import { GenerateTemplateCliFlags, Template } from "../types";
import { getOutputPath } from "../utils";

export default class CpTemplate implements Template {
  readonly name = "copy";

  readonly description =
    "A template to copy a signle source file to multiple repositories and commit the changes.";

  readonly aliases = ["cp"];

  readonly defaultFileName = "cp.sh";

  readonly arguments = [
    {
      name: "source_path",
      description: "The path that will be copied to the destination.",
    },
    {
      name: "dest_path",
      description:
        "Relative path to copy to. May omit the filename in order to use the filename of the source file.",
    },
    {
      name: "commit_message",
      description: "The commit message to use when committing the changes.",
    },
  ];

  readonly handler = async (
    source_file: string,
    dest_path: string,
    commit_message: string,
    flags: GenerateTemplateCliFlags
  ) => {
    const templateString = `#!/bin/bash
FILE="${source_file}"
RELATIVE_DEST="${dest_path}"
COMMIT_MESSAGE="${commit_message}"
git pull
cp -r $FILE "$RELATIVE_DEST"
git add "$RELATIVE_DEST"
git commit -m "$COMMIT_MESSAGE"
git push
`;
    const outputPath = await getOutputPath(this, flags);
    await writeFile(outputPath, templateString);
    if (process.platform !== "win32") {
      await chmod(outputPath, "755");
    }
    console.log(`Output log written to: ${outputPath}`);
  };
}
