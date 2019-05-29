import chai from 'chai';
import {Finder, FinderError, which} from '../lib/index.js';

/** Tests the features of the {@link which} function. */
describe('which()', () => {
  const {expect} = chai;

  it('should return the path of the `executable.cmd` file on Windows', async () => {
    try {
      const executable = /** @type {string} */ (await which('executable', {all: false, path: 'test/fixtures'}));
      if (Finder.isWindows) expect(executable.endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
      else expect.fail('Error not thrown');
    }

    catch (err) {
      if (Finder.isWindows) expect.fail(err.message);
      else expect(err).to.be.an.instanceof(FinderError);
    }
  });

  it('should return all the paths of the `executable.cmd` file on Windows', async () => {
    try {
      const executables = await which('executable', {all: true, path: 'test/fixtures'});
      if (!Finder.isWindows) expect.fail('Error not thrown');
      else {
        expect(executables).to.be.an('array').and.have.lengthOf(1);
        expect(executables[0]).to.be.a('string').and.match(/\\test\\fixtures\\executable\.cmd$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) expect.fail(err.message);
      else expect(err).to.be.an.instanceof(FinderError);
    }
  });

  it('should return the path of the `executable.sh` file on POSIX', async () => {
    try {
      const executable = /** @type {string} */ (await which('executable.sh', {all: false, path: 'test/fixtures'}));
      if (Finder.isWindows) expect.fail('Error not thrown');
      else expect(executable.endsWith('/test/fixtures/executable.sh')).to.be.true;
    }

    catch (err) {
      if (Finder.isWindows) expect(err).to.be.an.instanceof(FinderError);
      else expect.fail(err.message);
    }
  });

  it('should return all the paths of the `executable.sh` file on POSIX', async () => {
    try {
      const executables = await which('executable.sh', {all: true, path: 'test/fixtures'});
      if (Finder.isWindows) expect.fail('Error not thrown');
      else {
        expect(executables).to.be.an('array').and.have.lengthOf(1);
        expect(executables[0]).to.be.a('string').and.match(/\/test\/fixtures\/executable\.sh$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) expect(err).to.be.an.instanceof(FinderError);
      else expect.fail(err.message);
    }
  });

  it('should return the value of the `onError` handler', async () => {
    const executable = await which('executable', {all: false, onError: () => 'foo', path: 'test/fixtures'});
    if (!Finder.isWindows) expect(executable).to.equal('foo');

    const executables = await which('executable.sh', {all: true, onError: () => ['foo'], path: 'test/fixtures'});
    if (Finder.isWindows) {
      expect(executables).to.be.an('array').and.have.lengthOf(1);
      expect(executables[0]).to.equal('foo');
    }
  });
});
