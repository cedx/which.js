path: blob/master
source: bin/which.js

# Command line interface
From a command prompt, install the `which` executable:

```shell
npm install --global @cedx/which
```

!!! tip
    Consider adding the [`npm install --global`](https://docs.npmjs.com/files/folders) executables directory to your system path.

Then use it to find the instances of an executable command:

```shell
which --help

  Usage: which [options] <command>

  Find the instances of an executable in the system path.

  Options:

    -v, --version  output the version number
    -a, --all      list all instances of executables found (instead of just the first one)
    -s, --silent   silence the output, just return the exit code (0 if any executable is found, otherwise 1)
    -h, --help     output usage information
```

For example:

```shell
which --all node
# /usr/bin/node
```
