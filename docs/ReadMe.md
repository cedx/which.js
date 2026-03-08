# Which for JS
Find the instances of an executable in the system path,
in [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript).

## Quick start
Install the latest version of **Which for JS** with [npm](https://www.npmjs.com) package manager:

```shell
npm install @cedx/which
```

For detailed instructions, see the [installation guide](Installation.md).

## Usage
This package provides the `which(command: string)` function, allowing to locate a command in the system path.  
This function takes the name of the command to locate, and returns a `ResultSet` instance.

The `ResultSet` class implements the [async iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols).  
It is therefore possible to iterate over the results using a `for await...of` loop:

```js
import {which} from "@cedx/which";
import console from "node:console";

try {
  console.log('The "foobar" command is available at these locations:');
  for await (const path of which("foobar")) console.log(`- ${path}`);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
```

The `ResultSet` class also provides two convenient properties:

- `all` : get all instances of the searched command.
- `first` : get the first instance of the searched command.

### **all**: Promise&lt;string[]&gt;
The `ResultSet.all` property returns a `Promise` that resolves with the absolute paths of all instances of an executable found in the system path.
If the executable could not be located, the promise rejects.

```js
import console from "node:console";
import {which} from "@cedx/which";

try {
  const paths = await which("foobar").all;
  console.log('The "foobar" command is available at these locations:');
  for (const path of paths) console.log(`- ${path}`);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
```

### **first**: Promise&lt;string&gt;
The `ResultSet.first` property returns a `Promise` that resolves with the absolute path of the first instance of an executable found in the system path.
If the executable could not be located, the promise rejects.

```js
import console from "node:console";
import {which} from "@cedx/which";

try {
  const path = await which("foobar").first;
  console.log(`The "foobar" command is located at: ${path}`);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
```

## Options
The behavior of the `which(command: string, options?: FinderOptions)` function can be customized using the following options.

### **extensions**: string[]
An array of strings specifying the list of executable file extensions.
On Windows, defaults to the list of extensions provided by the `PATHEXT` environment variable.

```js
which("foobar", {extensions: [".foo", ".exe", ".cmd"]});
```

> [!NOTE]
> The `extensions` option is only meaningful on the Windows platform,
> where the executability of a file is determined from its extension.

### **paths**: string[]
An array of strings specifying the system paths from which the given command will be searched.
Defaults to the list of directories provided by the `PATH` environment variable.

```js
which("foobar", {paths: ["/usr/local/bin", "/usr/bin"]});
```
