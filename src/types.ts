export interface CliFlags {
  owner?: string;
  searchPath?: string | string[];
  _: string[];
}

/**
 * A two-element tuple that contains [owner, repository].
 */
export type RepoOwner = [string, string];
