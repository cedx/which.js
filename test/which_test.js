'use strict';

const {expect} = require('chai');
const {Finder, which} = require('../lib/index.js');

/**
 * @test {which}
 */
describe('which()', () => {
  it('should return the path of the `executable.cmd` file on Windows', async () => {
    try {
      let executable = await which('executable', {all: false, path: 'test/fixtures'});
      if (Finder.isWindows) expect(executable.endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
      else expect(true).to.not.be.ok;
    }

    catch (err) {
      if (Finder.isWindows) expect(true).to.not.be.ok;
      else expect(true).to.be.ok;
    }
  });

  it('should return all the paths of the `executable.cmd` file on Windows', async () => {
    try {
      let executables = await which('executable', {all: true, path: 'test/fixtures'});
      if (!Finder.isWindows) expect(true).to.not.be.ok;
      else {
        expect(executables).to.be.an('array').and.have.lengthOf(1);
        expect(executables[0]).to.be.a('string').and.match(/\\test\\fixtures\\executable\.cmd$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) expect(true).to.not.be.ok;
      else expect(true).to.be.ok;
    }
  });

  it('should return the path of the `executable.sh` file on POSIX', async () => {
    try {
      let executable = await which('executable.sh', {all: false, path: 'test/fixtures'});
      if (Finder.isWindows) expect(true).to.not.be.ok;
      else expect(executable.endsWith('/test/fixtures/executable.sh')).to.be.true;
    }

    catch (err) {
      if (Finder.isWindows) expect(true).to.be.ok;
      else expect(true).to.not.be.ok;
    }
  });

  it('should return all the paths of the `executable.sh` file on POSIX', async () => {
    try {
      let executables = await which('executable.sh', {all: true, path: 'test/fixtures'});
      if (Finder.isWindows) expect(true).to.not.be.ok;
      else {
        expect(executables).to.be.an('array').and.have.lengthOf(1);
        expect(executables[0]).to.be.a('string').and.match(/\/test\/fixtures\/executable\.sh$/);
      }
    }

    catch (err) {
      if (Finder.isWindows) expect(true).to.be.ok;
      else expect(true).to.not.be.ok;
    }
  });

  it('should return the value of the `onError` handler', async () => {
    let executable = await which('executable', {all: false, onError: () => 'foo', path: 'test/fixtures'});
    if (!Finder.isWindows) expect(executable).to.equal('foo');

    let executables = await which('executable.sh', {all: true, onError: () => ['foo'], path: 'test/fixtures'});
    if (Finder.isWindows) {
      expect(executables).to.be.an('array').and.have.lengthOf(1);
      expect(executables[0]).to.equal('foo');
    }
  });
});
