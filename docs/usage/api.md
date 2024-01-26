# Application programming interface
This package provides the `which(command: string)` function, allowing to locate a command in the system path.

This function takes the name of the command to locate, and returns a `ResultSet` with the three following methods:

- `all()` : get all instances of the searched command.
- `first()` : get the first instance of the searched command.
- `stream()` : get a stream of instances of the searched command.

### **all()**: Promise&lt;string[]&gt;
The `ResultSet.all()` method returns a `Promise` that resolves with the absolute paths of all instances of an executable found in the system path.
If the executable could not be located, the promise rejects.

```js
import console from "node:console";
import which from "@cedx/which";

try {
  const paths = await which("foobar").all();
  console.log('The "foobar" command is available at these locations:');
  for (const path of paths) console.log(`- ${path}`);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
```

### **first()**: Promise&lt;string&gt;
The `ResultSet.first()` method returns a `Promise` that resolves with the absolute path of the first instance of an executable found in the system path.
If the executable could not be located, the promise rejects.

```js
import console from "node:console";
import which from "@cedx/which";

try {
  const path = await which("foobar").first();
  console.log(`The "foobar" command is located at: ${path}`);
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
```

### **stream()**: AsyncGenerator&lt;string&gt;
The `ResultSet.stream()` method returns an asynchronous generator that yields the absolute path of the instances of an executable found in the system path.

```js
import console from "node:console";
import which from "@cedx/which";

try {
  console.log('The "foobar" command is available at these locations:');
  for await (const path of which("foobar").stream()) console.log(`- ${path}`);
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

> The `extensions` option is only meaningful on the Windows platform, where the executability of a file is determined from its extension.

### **paths**: string[]
An array of strings specifying the system paths from which the given command will be searched.
Defaults to the list of directories provided by the `PATH` environment variable.

```js
which("foobar", {paths: ["/usr/local/bin", "/usr/bin"]});
```
