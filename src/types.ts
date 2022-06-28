export interface BaseCliFlags {
  _: string[];
}

export interface CliFlags extends BaseCliFlags {
  owner?: string;
  search?: string | string[];
  terminate?: string | boolean;
  signal?: string;
}

/**
 * A two-element tuple that contains [owner, repository].
 */
export type RepoOwner = [string, string];

export interface GenerateTemplateCliFlags extends BaseCliFlags {
  outputDir?: string;
  outputFile?: string;
}

export interface Template {
  name: string;
  description?: string;
  aliases?: string[];

  defaultFileName: string;

  arguments?: (string | { name: string; description?: string })[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flags?: (string | { name: string; description?: string; value?: any })[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => any;
}

export type TemplateJSON = { [name: string]: Template };
