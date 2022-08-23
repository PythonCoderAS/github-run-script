import { Sade } from "sade";

import templates from "./templates";
import { Template } from "./types";

function generateCLIFromTemplate(sade: Sade, template: Template): Sade {
  const argString: string = template.arguments
    ? ` ${template.arguments
        .map((arg) => (typeof arg === "string" ? { name: arg } : arg))
        .map((arg) => `<${arg.name}>`)
        .join(" ")}`
    : "";
  sade = sade.command(
    `template ${template.name}${argString}`,
    template.description,
    {
      alias: template.aliases?.map((alias) => `template ${alias}`),
    }
  );
  template.flags
    ?.map((flag) => (typeof flag === "string" ? { name: flag } : flag))
    .forEach((flag) => {
      sade = sade.option(flag.name, flag.description, flag.value);
    });
  sade = sade
    .option("--output-dir", "The directory to output the template to.")
    .option(
      "--output-file",
      "The filename to output the template to.",
      template.defaultFileName
    )
    .action(template.handler);
  return sade;
}

export default function main(sade: Sade): Sade {
  for (const template of templates) {
    sade = generateCLIFromTemplate(sade, template);
  }

  return sade;
}
