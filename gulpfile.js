import {deleteAsync} from "del";
import {execa} from "execa";
import gulp from "gulp";
import {env} from "node:process";
import pkg from "./package.json" with {type: "json"};

// Runs a command.
const $ = execa({preferLocal: true, stdio: "inherit"});

// Builds the project.
export function build() {
	return $`tsc --build src/tsconfig.json`;
}

// Deletes all generated files.
export function clean() {
	return deleteAsync(["lib", "var/**/*"]);
}

// Performs the static analysis of source code.
export async function lint() {
	await build();
	await $`tsc --build tsconfig.json`;
	return $`eslint --config=etc/eslint.js gulpfile.js bin example src test`;
}

// Publishes the package.
export async function publish() {
	for (const registry of ["https://registry.npmjs.org", "https://npm.pkg.github.com"]) await $`npm publish --registry=${registry}`;
	for (const action of [["tag"], ["push", "origin"]]) await $`git ${action} v${pkg.version}`;
}

// Runs the test suite.
export async function test() {
	env.NODE_ENV = "test";
	await build();
	return $`node --test --test-reporter=spec`;
}

// Watches for file changes.
export function watch() {
	return $`tsc --build src/tsconfig.json --preserveWatchOutput --sourceMap --watch`;
}

// The default task.
export default gulp.series(
	clean,
	build
);
