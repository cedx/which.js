/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Finder, FinderError, which} from '../src';

/**
 * Tests the features of the `which()` function.
 */
@suite class WhichTest {

  /**
   * @test {which}
   */
  @test('It should return the path of the executables found')
  public async testWhich(): Promise<void> {
    let executable: string;
    let executables: string[];

    // It should return the path of the `executable.cmd` file on Windows.
    try {
      executable = await which('executable', {all: false, path: 'test/fixtures'}) as string;
      if (Finder.isWindows) expect(executable.endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;
      else expect.fail('Error not thrown');
    }

    catch (err) {
      if (Finder.isWindows) expect.fail(err.message);
      else expect(err).to.be.an.instanceof(FinderError);
    }

    // It should return all the paths of the `executable.cmd` file on Windows.
    try {
      executables = await which('executable', {all: true, path: 'test/fixtures'}) as string[];
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

    // It should return the path of the `executable.sh` file on POSIX.
    try {
      executable = await which('executable.sh', {all: false, path: 'test/fixtures'}) as string;
      if (Finder.isWindows) expect.fail('Error not thrown');
      else expect(executable.endsWith('/test/fixtures/executable.sh')).to.be.true;
    }

    catch (err) {
      if (Finder.isWindows) expect(err).to.be.an.instanceof(FinderError);
      else expect.fail(err.message);
    }

    // It should return all the paths of the `executable.sh` file on POSIX.
    try {
      executables = await which('executable.sh', {all: true, path: 'test/fixtures'}) as string[];
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

    // It should return the value of the `onError` handler.
    executable = await which('executable', {all: false, onError: () => 'foo', path: 'test/fixtures'}) as string;
    if (!Finder.isWindows) expect(executable).to.equal('foo');

    executables = await which('executable.sh', {all: true, onError: () => ['foo'], path: 'test/fixtures'}) as string[];
    if (Finder.isWindows) {
      expect(executables).to.be.an('array').and.have.lengthOf(1);
      expect(executables[0]).to.equal('foo');
    }
  }
}
