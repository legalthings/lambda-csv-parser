'use strict';

const parse = require('csv-parse');
const request = require('request-promise');
const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [ new winston.transports.Console() ]
});

exports.handler = (event, context, callback) => {
  if (!event || !event.url) {
    return callback(`no 'url' property given`);
  }

  request(event.url).then((data) => {
    parse(data, { columns: true }, (err, parsed) => {
      if (err) {
        return callback(`failed to parse csv file: ${err}`);
      }
     
      callback(null, parsed);
    })
  }).catch((err) => {
    return callback(`failed to download csv file: ${err}`);
  });
};
