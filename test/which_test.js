'use strict';

const {expect} = require('chai');
const {Finder, which} = require('../lib');

/**
 * @test {which}
 */
describe('which()', () => {
  let options = {path: 'test/fixtures'};

  it('should return the path of the `executable.cmd` file on Windows', done => {
    which('executable', false, options).subscribe(
      executable => {
        if (!Finder.isWindows) done(new Error('Error not thrown.'));
        else expect(executable.endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
      },
      err => done(Finder.isWindows ? new Error(err.message) : null),
      done
    );
  });

  it('should return all the paths of the `executable.cmd` file on Windows', done => {
    which('executable', true, options).subscribe(
      executables => {
        if (!Finder.isWindows) done(new Error('Error not thrown.'));
        else {
          expect(executables).to.be.an('array').and.have.lengthOf(1);
          expect(executables[0]).to.be.a('string').and.match(/\\test\\fixtures\\executable\.cmd$/);
        }
      },
      err => done(Finder.isWindows ? new Error(err.message) : null),
      done
    );
  });

  it('should return the path of the `executable.sh` file on POSIX', done => {
    which('executable.sh', false, options).subscribe(
      executable => {
        if (Finder.isWindows) done(new Error('Error not thrown.'));
        else expect(executable.endsWith('/test/fixtures/executable.sh')).to.be.true;
      },
      err => done(Finder.isWindows ? null : new Error(err.message)),
      done
    );
  });

  it('should return all the paths of the `executable.sh` file on POSIX', done => {
    which('executable.sh', true, options).subscribe(
      executables => {
        if (Finder.isWindows) done(new Error('Error not thrown.'));
        else {
          expect(executables).to.be.an('array').and.have.lengthOf(1);
          expect(executables[0]).to.be.a('string').and.match(/\/test\/fixtures\/executable\.sh$/);
        }
      },
      err => done(Finder.isWindows ? null : new Error(err.message)),
      done
    );
  });
});
