import {expect} from 'chai';
import 'mocha';
import {delimiter} from 'path';
import {Finder} from '../lib';

/**
 * @test {Finder}
 */
describe('Finder', () => {
  /* tslint:disable: no-unused-expression */

  /**
   * @test {Finder#constructor}
   */
  describe('#constructor()', () => {
    it('should set the `path` property to the value of the `PATH` environment variable by default', () => {
      const pathEnv = 'PATH' in process.env ? process.env.PATH : '';
      const path = pathEnv.length ? pathEnv.split(delimiter) : [];
      expect(new Finder().path).to.have.ordered.members(path);
    });

    it('should split the input path using the path separator', () => {
      const path = ['/usr/local/bin', '/usr/bin'];
      expect(new Finder({path: path.join(delimiter)}).path).to.have.ordered.members(path);
    });

    it('should set the `extensions` property to the value of the `PATHEXT` environment variable by default', () => {
      const pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT : '';
      const extensions = pathExt.length ? pathExt.split(delimiter).map(item => item.toLowerCase()) : [];
      expect(new Finder().extensions).to.have.ordered.members(extensions);
    });

    it('should split the extension list using the path separator', () => {
      const extensions = ['.EXE', '.CMD', '.BAT'];
      expect(new Finder({extensions: extensions.join(delimiter)}).extensions).to.have.ordered.members(['.exe', '.cmd', '.bat']);
    });

    it('should set the `pathSeparator` property to the value of the `path.delimiter` constant by default', () => {
      expect(new Finder().pathSeparator).to.equal(delimiter);
    });

    it('should properly set the path separator', () => {
      expect(new Finder({pathSeparator: '#'}).pathSeparator).to.equal('#');
    });
  });

  /**
   * @test {Finder#find}
   */
  describe('#find()', () => {
    it('should return the path of the `executable.cmd` file on Windows', async () => {
      const executables = await new Finder({path: 'test/fixtures'}).find('executable');
      expect(executables).to.have.lengthOf(Finder.isWindows ? 1 : 0);
      if (Finder.isWindows) expect(executables[0].endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
    });

    it('should return the path of the `executable.sh` file on POSIX', async () => {
      const executables = await new Finder({path: 'test/fixtures'}).find('executable.sh');
      expect(executables).to.have.lengthOf(Finder.isWindows ? 0 : 1);
      if (!Finder.isWindows) expect(executables[0].endsWith('/test/fixtures/executable.sh')).to.be.true;
    });
  });

  /**
   * @test {Finder#isExecutable}
   */
  describe('#isExecutable()', () => {
    it('should return `false` for a non-executable file', async () => {
      expect(await new Finder().isExecutable(`${__dirname}/../AUTHORS.txt`)).to.be.false;
    });

    it('should return `false` for a POSIX executable, when test is run on Windows', async () => {
      expect(await new Finder().isExecutable('test/fixtures/executable.sh')).to.not.equal(Finder.isWindows);
    });

    it('should return `false` for a Windows executable, when test is run on POSIX', async () => {
      expect(await new Finder().isExecutable('test/fixtures/executable.cmd')).to.equal(Finder.isWindows);
    });
  });
});