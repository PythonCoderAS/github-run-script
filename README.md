# github-run-script

Run a script on multiple repositories, cloning them if needed.

**NOTE:** The script _has to_ be an **absolute path**, otherwise it will fail.

```
  Description
    Run a script on multiple repositories, cloning them if needed.

  Usage
    $ github-run-script <script> [options]

  Options
    -o, --owner          The owner for repositories without an explicit owner.
    -s, --search-path    A path to search for already-cloned repositories.
    -t, --terminate      Terminate any spawned processes on error.
    -s, --signal         The signal to terminate a process with.
    -v, --version        Displays current version
    -h, --help           Displays this message
```

## Environment variables

The script gets run with additional environment variables.

| Environment Variable Name | Description                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `REPO_OWNER`              | The owner of the repository                                                                         |
| `REPO_NAME`               | The name of the repository                                                                          |
| `REPO`                    | The value of "`REPO_OWNER`/`REPO_NAME`"                                                             |
| `REPO_PATH`               | The path to the repository on the filesystem. The same path as the working directory of the script. |
