# Command line interface
From a command prompt, you can invoke the `which` executable by using
the [`npx` command](https://docs.npmjs.com/cli/commands/npx):

```shell
$ npx @cedx/which --help

Find the instances of an executable in the system path.

Usage:
  npx @cedx/which [options] <command>

Arguments:
  command        The name of the executable to find.

Options:
  -a, --all      List all executable instances found (instead of just the first one).
  -s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
  -h, --help     Display this help.
  -v, --version  Output the version number.
```

Then use it to find the instances of an executable program. For example:

```shell
npx @cedx/which --all node
# /usr/bin/node
# /usr/local/bin/node
```
