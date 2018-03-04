'use strict';

const {expect} = require('chai');
const {stat} = require('fs');
const {delimiter} = require('path');
const {promisify} = require('util');
const {Finder} = require('../lib/index.js');

/**
 * @test {Finder}
 */
describe('Finder', () => {

  /**
   * @test {Finder#constructor}
   */
  describe('#constructor()', () => {
    it('should set the `path` property to the value of the `PATH` environment variable by default', () => {
      let pathEnv = 'PATH' in process.env ? process.env.PATH : '';
      let path = pathEnv.length ? pathEnv.split(delimiter) : [];
      expect(new Finder().path).to.have.ordered.members(path);
    });

    it('should split the input path using the path separator', () => {
      let path = ['/usr/local/bin', '/usr/bin'];
      expect(new Finder({path: path.join(delimiter)}).path).to.have.ordered.members(path);
    });

    it('should set the `extensions` property to the value of the `PATHEXT` environment variable by default', () => {
      let pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT : '';
      let extensions = pathExt.length ? pathExt.split(delimiter) : [];
      expect(new Finder().extensions).to.have.ordered.members(extensions);
    });

    it('should split the extension list using the path separator', () => {
      let extensions = ['.EXE', '.CMD', '.BAT'];
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
      let executables = await new Finder({path: 'test/fixtures'}).find('executable');
      expect(executables).to.have.lengthOf(Finder.isWindows ? 1 : 0);
      if (Finder.isWindows) expect(executables[0].endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
    });

    it('should return the path of the `executable.sh` file on POSIX', async () => {
      let executables = await new Finder({path: 'test/fixtures'}).find('executable.sh');
      expect(executables).to.have.lengthOf(Finder.isWindows ? 0 : 1);
      if (!Finder.isWindows) expect(executables[0].endsWith('/test/fixtures/executable.sh')).to.be.true;
    });
  });

  /**
   * @test {Finder#isExecutable}
   */
  describe('#isExecutable()', () => {
    it('should return `false` for a non-executable file', async () => {
      expect(await new Finder().isExecutable(__filename)).to.be.false;
    });

    it('should return `false` for a POSIX executable, when test is run on Windows', async () => {
      expect(await new Finder().isExecutable('test/fixtures/executable.sh')).to.not.equal(Finder.isWindows);
    });

    it('should return `false` for a Windows executable, when test is run on POSIX', async () => {
      expect(await new Finder().isExecutable('test/fixtures/executable.cmd')).to.equal(Finder.isWindows);
    });
  });

  /**
   * @test {Finder#_checkFileExtension}
   */
  describe('#_checkFileExtension()', () => {
    it('should return `false` if the file has not an executable file extension', () => {
      let finder = new Finder({extensions: ['.EXE', '.CMD', '.BAT']});
      expect(finder._checkFileExtension('')).to.be.false;
      expect(finder._checkFileExtension('exe.')).to.be.false;
      expect(finder._checkFileExtension('foo.bar')).to.be.false;
      expect(finder._checkFileExtension('/home/logger.txt')).to.be.false;
      expect(finder._checkFileExtension('C:\\Program Files\\FooBar\\FooBar.dll')).to.be.false;

      finder.extensions = ['.bar'];
      expect(finder._checkFileExtension('foo.exe')).to.be.false;
    });

    it('should return `true` if the file has an executable file extension', () => {
      let finder = new Finder({extensions: ['.EXE', '.CMD', '.BAT']});
      expect(finder._checkFileExtension('.exe')).to.be.true;
      expect(finder._checkFileExtension('foo.exe')).to.be.true;
      expect(finder._checkFileExtension('/home/logger.bat')).to.be.true;
      expect(finder._checkFileExtension('C:\\Program Files\\FooBar\\FooBar.cmd')).to.be.true;

      finder.extensions = ['.bar'];
      expect(finder._checkFileExtension('foo.BAR')).to.be.true;
    });
  });

  /**
   * @test {Finder#_checkFilePermissions}
   */
  describe('#_checkFilePermissions()', () => {
    const getStats = promisify(stat);
    const onPosixIt = Finder.isWindows ? it.skip : it;

    onPosixIt('should return `false` if the file is not executable at all', async () => {
      let fileStats = await getStats('test/fixtures/not_executable.sh');
      expect(new Finder()._checkFilePermissions(fileStats)).to.be.false;
    });

    onPosixIt('should return `true` if the file is executable by everyone', async () => {
      let fileStats = await getStats('test/fixtures/executable.sh');
      expect(new Finder()._checkFilePermissions(fileStats)).to.be.true;
    });
  });
});
