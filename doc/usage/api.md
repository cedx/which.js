path: blob/master
source: src/which.ts

# Application programming interface
This package provides a single function, `which()`, allowing to locate a command in the system path:

```ts
import {which} from '@cedx/which';

async function main(): Promise<void> {
  try {
    // `path` is the absolute path to the executable.
    const path = await which('foobar') as string;
    console.log(`The command "foobar" is located at: ${path}`);
  }

  catch (err) {
    // `err` is an instance of `FinderError`.
    console.log(`The command "${err.command}" was not found`);
  }
}
```

The function returns a [`Promise<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves with the absolute path of the first instance of the executables found. If the command could not be located, the promise rejects with a `FinderError`.

## Options
The behavior of the `which()` function can be customized using the following optional parameters.

### **all**: boolean
A value indicating whether to return all executables found, instead of just the first one.

If you pass `true` as parameter value, the function will return a `Promise<string[]>` providing all paths found, instead of a `Promise<string>`:

```ts
import {which} from '@cedx/which';

async function main(): Promise<void> {
  const paths = await which('foobar', {all: true}) as string[];
  console.log('The command "foobar" was found at these locations:');
  for (const path of paths) console.log(path);
}
```

### **extensions**: string | string[]
The executable file extensions, provided as a string or a list of file extensions. Defaults to the list of extensions provided by the `PATHEXT` environment variable.

```ts
which('foobar', {extensions: '.FOO;.EXE;.CMD'});
which('bazqux', {extensions: ['.foo', '.exe', '.cmd']});
```

!!! tip
    The `extensions` option is only meaningful on the Windows platform, where the executability of a file is determined from its extension.

### **onError**: (command: string) => any
By default, when the specified command cannot be located, a `FinderError` is thrown. You can disable this exception by providing your own error handler:

```ts
import {which} from '@cedx/which';

async function main(): Promise<void> {
  const path = await which('foobar', {onError: command => ''}) as string;
  if (!path.length) console.log('The command "foobar" was not found');
  else console.log(`The command "foobar" is located at: ${path}`);
}
```

When an `onError` handler is provided, it is called with the command as argument, and its return value is used instead. This is preferable to throwing and then immediately catching the `FinderError`.

### **path**: string | string[]
The system path, provided as a string or a list of directories. Defaults to the list of paths provided by the `PATH` environment variable.

```ts
which('foobar', {path: '/usr/local/bin:/usr/bin'});
which('bazqux', {path: ['/usr/local/bin', '/usr/bin']});
```

### **pathSeparator**: string
The character used to separate paths in the system path. Defaults to the [`path.delimiter`](https://nodejs.org/api/path.html#path_path_delimiter) constant.

```ts
which('foobar', {pathSeparator: '#'});
// For example: "/usr/local/bin#/usr/bin"
```
