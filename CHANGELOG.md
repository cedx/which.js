# Changelog
This file contains highlights of what changes on each version of the [Which for JS](https://github.com/cedx/which.js) library.

## Version 3.0.0
- Breaking change: merged the `all` and `options` parameters of the `which()` function.
- Updated the package dependencies.

## Version 2.0.2
- Fixed a bug: with the `all` parameter set to `false`, no instance was returned.

## Version 2.0.1
- Code optimization: even with the `all` parameter set to `false`, all instances of a command were searched.

## Version 2.0.0
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Added the [`#[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version 1.1.0
- Fixed a bug with the executable extensions not always uppercased.
- Updated the package dependencies.

## Version 1.0.0
- Added a command line interface.
- Added new unit tests.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
