/* eslint-disable no-alert, no-console */
'use strict';

const getFileStream = require('./file').getFileStream;
const parser = require('./parser').parser;
const processorEn = require('./processor.en').processor;

parser.processorFn = processorEn;
getFileStream('enwiktionary-latest-pages-articles.xml').pipe(parser);
