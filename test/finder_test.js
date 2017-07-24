'use strict';

const {expect} = require('chai');
const {stat} = require('fs');
const {delimiter} = require('path');
const {Observable} = require('rxjs');
const {Finder} = require('../lib');

/**
 * @test {Finder}
 */
describe('Finder', () => {

  /**
   * @test {Finder#constructor}
   */
  describe('#constructor()', () => {
    it('should be the value of the `PATH` environment variable by default', () => {
      let pathEnv = 'PATH' in process.env ? process.env.PATH : '';
      let paths = pathEnv.length ? pathEnv.split(delimiter) : [];
      expect((new Finder).path).to.have.ordered.members(paths);
    });

    it('should split the input path using the path separator', () => {
      let paths = ['/usr/local/bin', '/usr/bin'];
      let finder = new Finder(paths.join(delimiter));
      expect(finder.path).to.have.ordered.members(paths);
    });

    it('should be the value of the `PATHEXT` environment variable by default', () => {
      let pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT : '';
      let extensions = pathExt.length ? pathExt.split(delimiter) : [];
      expect((new Finder).extensions).to.have.ordered.members(extensions);
    });

    it('should split the extension list using the path separator', () => {
      let extensions = ['.EXE', '.CMD', '.BAT'];
      let finder = new Finder('', extensions.join(delimiter));
      expect(finder.extensions).to.have.ordered.members(extensions);
    });

    it('should be the value of the `path.delimiter` constant by default', () => {
      expect((new Finder).pathSeparator).to.equal(delimiter);
    });

    it('should properly set the path separator', () => {
      let finder = new Finder('', '', '#');
      expect(finder.pathSeparator).to.equal('#');
    });
  });

  /**
   * @test {Finder#find}
   */
  describe('#find()', () => {
    it('should return the path of the `executable.cmd` file on Windows', done => {
      new Finder('test/fixtures').find('executable').toArray().subscribe(executables => {
        expect(executables).to.be.an('array').and.have.lengthOf(Finder.isWindows ? 1 : 0);
        if (Finder.isWindows) expect(executables[0]).to.contain('\\test\\fixtures\\executable.cmd');
      }, done, done);
    });

    it('should return the path of the `executable.sh` file on POSIX', done => {
      new Finder('test/fixtures').find('executable.sh').toArray().subscribe(executables => {
        expect(executables).to.be.an('array').and.have.lengthOf(Finder.isWindows ? 0 : 1);
        if (!Finder.isWindows) expect(executables[0]).to.contain('/test/fixtures/executable.sh');
      }, done, done);
    });
  });

  /**
   * @test {Finder#isExecutable}
   */
  describe('#isExecutable()', () => {
    it('should return `false` for a non-executable file', done => {
      (new Finder).isExecutable(__filename).subscribe(
        isExecutable => expect(isExecutable).to.be.false,
        done, done
      );
    });

    it('should return `false` for a POSIX executable, when test is run on Windows', done => {
      (new Finder).isExecutable('test/fixtures/executable.sh').subscribe(
        isExecutable => expect(isExecutable).to.not.equal(Finder.isWindows),
        done, done
      );
    });

    it('should return `false` for a Windows executable, when test is run on POSIX', done => {
      (new Finder).isExecutable('test/fixtures/executable.cmd').subscribe(
        isExecutable => expect(isExecutable).to.equal(Finder.isWindows),
        done, done
      );
    });
  });

  /**
   * @test {Finder#_checkFileExtension}
   */
  describe('#_checkFileExtension()', () => {
    it('should return `false` if the file has not an executable file extension', () => {
      let finder = new Finder('', ['.EXE', '.CMD', '.BAT']);
      expect(finder._checkFileExtension('')).to.be.false;
      expect(finder._checkFileExtension('exe.')).to.be.false;
      expect(finder._checkFileExtension('foo.bar')).to.be.false;
      expect(finder._checkFileExtension('/home/logger.txt')).to.be.false;
      expect(finder._checkFileExtension('C:\\Program Files\\FooBar\\FooBar.dll')).to.be.false;

      finder.extensions = ['.BAR'];
      expect(finder._checkFileExtension('foo.exe')).to.be.false;
    });

    it('should return `true` if the file has an executable file extension', () => {
      let finder = new Finder('', ['.EXE', '.CMD', '.BAT']);
      expect(finder._checkFileExtension('.exe')).to.be.true;
      expect(finder._checkFileExtension('foo.exe')).to.be.true;
      expect(finder._checkFileExtension('/home/logger.bat')).to.be.true;
      expect(finder._checkFileExtension('C:\\Program Files\\FooBar\\FooBar.cmd')).to.be.true;

      finder.extensions = ['.BAR'];
      expect(finder._checkFileExtension('foo.bar')).to.be.true;
    });
  });

  /**
   * @test {Finder#_checkFilePermissions}
   */
  (Finder.isWindows ? describe.skip : describe)('#_checkFilePermissions()', () => {
    const getStats = Observable.bindNodeCallback(stat);

    it('it should return `false` if the file is not executable at all', done => {
      getStats('test/fixtures/not_executable.sh')
        .subscribe(fileStats => expect((new Finder)._checkFilePermissions(fileStats)).to.be.false, done, done);
    });

    it('it should return `true` if the file is executable by everyone', done => {
      getStats('test/fixtures/executable.sh')
        .subscribe(fileStats => expect((new Finder)._checkFilePermissions(fileStats)).to.be.true, done, done);
    });
  });
});
