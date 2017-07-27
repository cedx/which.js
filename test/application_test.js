'use strict';

const {expect} = require('chai');
const {delimiter, join} = require('path');
const {Application, Finder} = require('../lib');

/**
 * @test {Application}
 */
describe('Application', () => {

  /**
   * @test {Application#run}
   */
  describe('#run()', () => {
    it('should return `0` if everything went fine', done => {
      process.env.PATH = join('test', 'fixtures') + delimiter + process.env.PATH;

      let args = ['/usr/local/bin/node', __filename, '--silent', Finder.isWindows ? 'executable.cmd' : 'executable.sh'];
      (new Application).run(args).subscribe(status => expect(status).to.equal(0), done, done);
    });
  });
});
