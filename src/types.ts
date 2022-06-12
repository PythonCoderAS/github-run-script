export interface CliFlags {
  owner?: string;
  search?: string | string[];
  _: string[];
}

/**
 * A two-element tuple that contains [owner, repository].
 */
export type RepoOwner = [string, string];
