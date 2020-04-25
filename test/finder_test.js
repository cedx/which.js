import {strict as assert} from 'assert';
import {delimiter} from 'path';
import {Finder} from '../lib/index.js';

/** Tests the features of the {@link Finder} class. */
describe('Finder', () => {
  describe('constructor', () => {
    it('should set the `path` property to the value of the `PATH` environment variable by default', () => {
      const pathEnv = process.env.PATH ?? '';
      const path = pathEnv.length ? pathEnv.split(delimiter) : [];
      assert.deepEqual(new Finder().path, path);
    });

    it('should split the input path using the path separator', () => {
      const path = ['/usr/local/bin', '/usr/bin'];
      assert.deepEqual(new Finder({path: path.join(delimiter)}).path, path);
    });

    it('should set the `extensions` property to the value of the `PATHEXT` environment variable by default', () => {
      const pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT : '';
      const extensions = pathExt.length ? pathExt.split(delimiter).map(item => item.toLowerCase()) : [];
      assert.deepEqual(new Finder().extensions, extensions);
    });

    it('should split the extension list using the path separator', () => {
      const extensions = ['.EXE', '.CMD', '.BAT'];
      assert.deepEqual(new Finder({extensions: extensions.join(delimiter)}).extensions, ['.exe', '.cmd', '.bat']);
    });

    it('should set the `pathSeparator` property to the value of the `path.delimiter` constant by default', () => {
      assert.equal(new Finder().pathSeparator, delimiter);
    });

    it('should properly set the path separator', () => {
      assert.equal(new Finder({pathSeparator: '#'}).pathSeparator, '#');
    });
  });

  describe('.find()', () => {
    async function toArray(asyncIterable) {
      const items = [];
      for await (const item of asyncIterable) items.push(item);
      return items;
    }

    it('should return the path of the `executable.cmd` file on Windows', async () => {
      const executables = await toArray(new Finder({path: 'test/fixtures'}).find('executable'));
      assert.equal(executables.length, Finder.isWindows ? 1 : 0);
      if (Finder.isWindows) assert(executables[0].endsWith(String.raw`\test\fixtures\executable.cmd`));
    });

    it('should return the path of the `executable.sh` file on POSIX', async () => {
      const executables = await toArray(new Finder({path: 'test/fixtures'}).find('executable.sh'));
      assert.equal(executables.length, Finder.isWindows ? 0 : 1);
      if (!Finder.isWindows) assert(executables[0].endsWith('/test/fixtures/executable.sh'));
    });
  });

  describe('.isExecutable()', () => {
    it('should return `false` for a non-executable file', async () => {
      assert.equal(await new Finder().isExecutable('AUTHORS.txt'), false);
    });

    it('should return `false` for a POSIX executable, when test is run on Windows', async () => {
      assert.notEqual(await new Finder().isExecutable('test/fixtures/executable.sh'), Finder.isWindows);
    });

    it('should return `false` for a Windows executable, when test is run on POSIX', async () => {
      assert.equal(await new Finder().isExecutable('test/fixtures/executable.cmd'), Finder.isWindows);
    });
  });
});
