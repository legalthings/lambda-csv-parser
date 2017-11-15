"use strict";

const lambdaLocal = require('lambda-local');
const nock = require('nock');
const should = require('should');

process.env.NODE_ENV = 'tests';

describe('index', () => {
  describe('handler', () => {
    it('should return parsed csv contents by fetching csv from url', () => {
      nock('http://example.com', { allowUnmocked: true })
        .get(`/input.csv`)
        .reply(200, [
          'name,email',
          'john,john@example.com',
          'jane,jane@example.com',
          'bob ross,bob@example.com'
        ].join('\n'));

      lambdaLocal.execute({
        event: { url: 'http://example.com/input.csv' },
        lambdaPath: path.join(__dirname, '../index.js'),
        profileName: 'default',
        timeoutMs: 3000
      }).then((done) => {
        should(done).deepEqual([
          { "name": "john", "email": "john@example.com" },
          { "name": "jane", "email": "jane@example.com" },
          { "name": "bob ross", "email": "bob@example.com" }
        ]);
      });
    });
  });
});
