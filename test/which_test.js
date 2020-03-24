import {strict as assert} from 'assert';
import {Finder, FinderError, which} from '../lib/index.js';

/** Tests the features of the {@link which} function. */
describe('which()', () => {
  it('should return the path of the `executable.cmd` file on Windows', async () => {
    try {
      const executable = await which('executable', {all: false, path: 'test/fixtures'});
      if (Finder.isWindows) assert(executable.endsWith('\\test\\fixtures\\executable.cmd'));
      else assert.fail('Error not thrown');
    }

    catch (err) {
      if (Finder.isWindows) assert.fail(err.message);
      else assert(err instanceof FinderError);
    }
  });

  it('should return all the paths of the `executable.cmd` file on Windows', async () => {
    try {
      const executables = await which('executable', {all: true, path: 'test/fixtures'});
      if (!Finder.isWindows) assert.fail('Error not thrown');
      else {
        assert(Array.isArray(executables));
        assert.equal(executables.length, 1);
        assert.equal(typeof executables[0], 'string');
        assert.match(executables[0], /\\test\\fixtures\\executable\.cmd$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) assert.fail(err.message);
      else assert(err instanceof FinderError);
    }
  });

  it('should return the path of the `executable.sh` file on POSIX', async () => {
    try {
      const executable = await which('executable.sh', {all: false, path: 'test/fixtures'});
      if (Finder.isWindows) assert.fail('Error not thrown');
      else assert(executable.endsWith('/test/fixtures/executable.sh'));
    }

    catch (err) {
      if (Finder.isWindows) assert(err instanceof FinderError);
      else assert.fail(err.message);
    }
  });

  it('should return all the paths of the `executable.sh` file on POSIX', async () => {
    try {
      const executables = await which('executable.sh', {all: true, path: 'test/fixtures'});
      if (Finder.isWindows) assert.fail('Error not thrown');
      else {
        assert(Array.isArray(executables));
        assert.equal(executables.length, 1);
        assert.equal(typeof executables[0], 'string');
        assert.match(executables[0], /\/test\/fixtures\/executable\.sh$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) assert(err instanceof FinderError);
      else assert.fail(err.message);
    }
  });

  it('should return the value of the `onError` handler', async () => {
    const executable = await which('executable', {all: false, onError: () => 'foo', path: 'test/fixtures'});
    if (!Finder.isWindows) assert.equal(executable, 'foo');

    const executables = await which('executable.sh', {all: true, onError: () => ['foo'], path: 'test/fixtures'});
    if (Finder.isWindows) {
      assert(Array.isArray(executables));
      assert.equal(executables.length, 1);
      assert.equal(executables[0], 'foo');
    }
  });
});
