# Which for JS
![Runtime](https://img.shields.io/badge/node-%3E%3D8.0-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/which.svg) ![License](https://img.shields.io/npm/l/@cedx/which.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/which.svg) ![Dependencies](https://david-dm.org/cedx/which.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/which.js/badge.svg) ![Build](https://travis-ci.org/cedx/which.js.svg)

Find the instances of an executable in the system path, implemented in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Requirements
The latest [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) versions.
If you plan to play with the sources, you will also need the latest [Gulp.js](http://gulpjs.com) version.

## Installing via [npm](https://www.npmjs.com)
From a command prompt, run:

```shell
$ npm install --save @cedx/which
```

## Usage
This package has an API based on [Observables](http://reactivex.io/intro.html).

It provides a single function, `which()`, allowing to locate a command in the system path:

```javascript
const {which} = require('@cedx/which');

which('foobar').subscribe(
  path => {
    // "path" is the absolute path to the executable.
    console.log(`The "foobar" command is located at: ${path}`);
  },
  error => {
    // The command was not found on the system path.
    console.log('The "foobar" command is not found.');
  }
);
```

### Options
The `which\which()` function accepts three parameters:

- `command: string`: The command to be resolved.
- `all boolean = false`: A value indicating whether to return all executables found, instead of just the first one.
- `options: object = {}`: The options to be passed to the underlying finder.

If you pass the `true` value as the second parameter, the function will return an array of all paths found, instead of only the first path found:

```javascript
which('foobar', true).subscribe(paths => {
  console.log('The "foobar" command is located at:');
  for (let path of paths) console.log(path);
});
```

You can pass an options object as the third parameter:

- `path: string|string[]`: The system path, provided as a string or an array of directories. Defaults to the `PATH` environment variable.
- `extensions: string|string[]`: The executable file extensions, provided as a string or an array of file extensions. Defaults to the `PATHEXT` environment variable.
- `pathSeparator: string`: The character used to separate paths in the system path. Defaults to the [`path.delimiter`](https://nodejs.org/api/path.html#path_path_delimiter) constant.

The `extensions` option is only meaningful on the Windows platform, where the executability of a file is determined from its extension:

```javascript
let options = {extensions: '.FOO;.EXE;.CMD'};
which('foobar', false, options).subscribe(path =>
  console.log(`The "foobar" command is located at: ${path}`);
);
```

### Promise support
If you require it, an `Observable` can be converted to a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) by using the `toPromise()` method:

```javascript
let path = await which('foobar').toPromise();
console.log(`The "foobar" command is located at: ${path}`);
```

## Command line interface
From a command prompt, install the `which` executable:

```shell
$ npm install --global @cedx/which
```

Then use it to find the instances of an executable:

```shell
$ which --help

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
$ which --all node
```

## See also
- [API reference](https://cedx.github.io/which.js)
- [Code coverage](https://coveralls.io/github/cedx/which.js)
- [Continuous integration](https://travis-ci.org/cedx/which.js)

## License
[Which for JS](https://github.com/cedx/which.js) is distributed under the Apache License, version 2.0.
