# Changelog

## Version [5.4.0](https://github.com/cedx/which.js/compare/v5.3.0...v5.4.0)
- Modified the package layout.
- Updated the package dependencies.

## Version [5.3.0](https://github.com/cedx/which.js/compare/v5.2.0...v5.3.0)
- Added support for [ECMAScript modules](https://nodejs.org/api/esm.html).
- Updated the package dependencies.

## Version [5.2.0](https://github.com/cedx/which.js/compare/v5.1.0...v5.2.0)
- Updated the package dependencies.
- Updated the URL of the Git repository.

## Version [5.1.0](https://github.com/cedx/which.js/compare/v5.0.0...v5.1.0)
- Updated the package dependencies.

## Version [5.0.0](https://github.com/cedx/which.js/compare/v4.2.0...v5.0.0)
- Breaking change: implemented the `Finder#find()` method using asynchronous generators.

## Version [4.2.0](https://github.com/cedx/which.js/compare/v4.1.0...v4.2.0)
- Ported the unit tests to classes with experimental decorators.
- Removed a cyclic dependency.
- Updated the package dependencies.

## Version [4.1.0](https://github.com/cedx/which.js/compare/v4.0.1...v4.1.0)
- Ported the source code to [TypeScript](https://www.typescriptlang.org).
- Replaced [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Replaced [ESLint](https://eslint.org) static analyzer by [TSLint](https://palantir.github.io/tslint).
- Updated the package dependencies.

## Version [4.0.1](https://github.com/cedx/which.js/compare/v4.0.0...v4.0.1)
- Updated the usage of the `fs` promises API.
- Updated the package dependencies.

## Version [4.0.0](https://github.com/cedx/which.js/compare/v3.2.1...v4.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Updated the package dependencies.
- Using the `fs` promises API.

## Version [3.2.1](https://github.com/cedx/which.js/compare/v3.2.0...v3.2.1)
- Fixed [issue #1](https://github.com/cedx/which.js/issues/1): the `which()` function can return duplicates.

## Version [3.2.0](https://github.com/cedx/which.js/compare/v3.1.0...v3.2.0)
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Added the `FinderError` class.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version [3.1.0](https://github.com/cedx/which.js/compare/v3.0.0...v3.1.0)
- Updated the package dependencies.

## Version [3.0.0](https://github.com/cedx/which.js/compare/v2.0.2...v3.0.0)
- Breaking change: changed the signature of the `Finder` class constructor.
- Breaking change: merged the `all` and `options` parameters of the `which()` function.
- Breaking change: removed the `Application` class.
- Added the `onError` option.
- Updated the package dependencies.

## Version [2.0.2](https://github.com/cedx/which.js/compare/v2.0.1...v2.0.2)
- Fixed a bug: with the `all` parameter set to `false`, no instance was returned.

## Version [2.0.1](https://github.com/cedx/which.js/compare/v2.0.0...v2.0.1)
- Code optimization: even with the `all` parameter set to `false`, all instances of a command were searched.

## Version [2.0.0](https://github.com/cedx/which.js/compare/v1.1.0...v2.0.0)
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Added the [`#[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version [1.1.0](https://github.com/cedx/which.js/compare/v1.0.0...v1.1.0)
- Fixed a bug with the executable extensions not always uppercased.
- Updated the package dependencies.

## Version [1.0.0](https://github.com/cedx/which.js/compare/v0.1.0...v1.0.0)
- Added a command line interface.
- Added new unit tests.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
