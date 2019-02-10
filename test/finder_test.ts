/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {delimiter} from 'path';
import {Finder} from '../src';

/**
 * Tests the features of the [[Finder]] class.
 */
@suite class FinderTest {

  /**
   * Tests the [[Finder]] constructor.
   */
  @test testConstructor(): void {
    // It should set the `path` property to the value of the `PATH` environment variable by default.
    const pathEnv = 'PATH' in process.env ? process.env.PATH! : '';
    let path = pathEnv.length ? pathEnv.split(delimiter) : [];
    expect(new Finder().path).to.have.ordered.members(path);

    // It should split the input path using the path separator.
    path = ['/usr/local/bin', '/usr/bin'];
    expect(new Finder({path: path.join(delimiter)}).path).to.have.ordered.members(path);

    // It should set the `extensions` property to the value of the `PATHEXT` environment variable by default.
    const pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT! : '';
    let extensions = pathExt.length ? pathExt.split(delimiter).map(item => item.toLowerCase()) : [];
    expect(new Finder().extensions).to.have.ordered.members(extensions);

    // It should split the extension list using the path separator.
    extensions = ['.EXE', '.CMD', '.BAT'];
    expect(new Finder({extensions: extensions.join(delimiter)}).extensions).to.have.ordered.members(['.exe', '.cmd', '.bat']);

    // It should set the `pathSeparator` property to the value of the `path.delimiter` constant by default.
    expect(new Finder().pathSeparator).to.equal(delimiter);

    // It should properly set the path separator.
    expect(new Finder({pathSeparator: '#'}).pathSeparator).to.equal('#');
  }

  /**
   * Tests the `Finder#find()` method.
   */
  @test async testFind(): Promise<void> {
    async function toArray(asyncIterable: AsyncIterable<string>): Promise<string[]> {
      const items = [];
      for await (const item of asyncIterable) items.push(item);
      return items;
    }

    // It should return the path of the `executable.cmd` file on Windows.
    let executables = await toArray(new Finder({path: 'test/fixtures'}).find('executable'));
    expect(executables).to.have.lengthOf(Finder.isWindows ? 1 : 0);
    if (Finder.isWindows) expect(executables[0].endsWith('\\test\\fixtures\\executable.cmd')).to.be.true;

    // It should return the path of the `executable.sh` file on POSIX.
    executables = await toArray(new Finder({path: 'test/fixtures'}).find('executable.sh'));
    expect(executables).to.have.lengthOf(Finder.isWindows ? 0 : 1);
    if (!Finder.isWindows) expect(executables[0].endsWith('/test/fixtures/executable.sh')).to.be.true;
  }

  /**
   * Tests the `Finder#isExecutable()` method.
   */
  @test async testIsExecutable(): Promise<void> {
    // It should return `false` for a non-executable file.
    expect(await new Finder().isExecutable(`${__dirname}/../AUTHORS.txt`)).to.be.false;

    // It should return `false` for a POSIX executable, when test is run on Windows.
    expect(await new Finder().isExecutable('test/fixtures/executable.sh')).to.not.equal(Finder.isWindows);

    // It should return `false` for a Windows executable, when test is run on POSIX.
    expect(await new Finder().isExecutable('test/fixtures/executable.cmd')).to.equal(Finder.isWindows);
  }
}
