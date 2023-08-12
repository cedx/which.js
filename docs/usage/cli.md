# Command line interface
From a command prompt, install the `which` executable:

```shell
npm install --global @cedx/which
```

> Consider adding the [`npm install --global`](https://docs.npmjs.com/files/folders) executables directory to your system path.

Then use it to find the instances of an executable command:

```shell
$ which --help

Find the instances of an executable in the system path.

Usage:
  which [options] <command>

Arguments:
  command        The name of the executable to find.

Options:
  -a, --all      List all executable instances found (instead of just the first one).
  -s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
  -h, --help     Display this help.
  -v, --version  Output the version number.
```

For example:

```shell
which --all node
# /usr/bin/node
# /usr/local/bin/node
```
