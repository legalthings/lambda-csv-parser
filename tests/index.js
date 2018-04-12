"use strict";

const lambdaLocal = require('lambda-local');
const nock = require('nock');
const should = require('should');
const path = require('path');

process.env.NODE_ENV = 'tests';

describe('index', () => {
  describe('handler', () => {
    it('should return json contents by fetching csv from url', () => {
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

    it('should return csv contents by fetching json from url', () => {
      nock('http://example.com', { allowUnmocked: true })
        .get(`/input.json`)
        .reply(200, [
          { "name": "john", "email": "john@example.com" },
          { "name": "jane", "email": "jane@example.com" },
          { "name": "bob ross", "email": "bob@example.com" }
        ]);

      lambdaLocal.execute({
        event: {
          url: 'http://example.com/input.json'
        },
        lambdaPath: path.join(__dirname, '../index.js'),
        profileName: 'default',
        timeoutMs: 3000
      }).then((done) => {
        should(done).eql([
          'name,email',
          'john,john@example.com',
          'jane,jane@example.com',
          'bob ross,bob@example.com'
        ].join('\n'));
      });
    });

    it('should return json contents by converting received csv', () => {
      lambdaLocal.execute({
        event: {
          content: [
            'name,email',
            'john,john@example.com',
            'jane,jane@example.com',
            'bob ross,bob@example.com'
          ].join('\n'),
          type: 'csv'
        },
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

    it('should return csv contents by converting received json', () => {
      lambdaLocal.execute({
        event: {
          content: [
            { "name": "john", "email": "john@example.com" },
            { "name": "jane", "email": "jane@example.com" },
            { "name": "bob ross", "email": "bob@example.com" }
          ],
          type: 'json'
        },
        lambdaPath: path.join(__dirname, '../index.js'),
        profileName: 'default',
        timeoutMs: 3000
      }).then((done) => {
        should(done).eql([
          'name,email',
          'john,john@example.com',
          'jane,jane@example.com',
          'bob ross,bob@example.com'
        ].join('\n'));
      });
    });

    it('should return csv with a ; delimiter contents by converting received json', () => {
      lambdaLocal.execute({
        event: {
          content: [
            { "name": "john", "email": "john@example.com" },
            { "name": "jane", "email": "jane@example.com" },
            { "name": "bob ross", "email": "bob@example.com" }
          ],
          type: 'json',
          options: {
            delimiter: {
              field: ';',
              array: ','
            }
          }
        },
        lambdaPath: path.join(__dirname, '../index.js'),
        profileName: 'default',
        timeoutMs: 3000
      }).then((done) => {
        should(done).eql([
          'name;email',
          'john;john@example.com',
          'jane;jane@example.com',
          'bob ross;bob@example.com'
        ].join('\n'));
      });
    });
  });
});
