'use strict';
const Parser = require('./lib/parser');

const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [ new winston.transports.Console() ]
});

exports.handler = async (event) => {
  if (!event || !event.url && !event.content) {
    throw(`no 'url' or 'content' property given`);
  }

  const parser = new Parser();
  return await parser.parseEvent(event);
};
