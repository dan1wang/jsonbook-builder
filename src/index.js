/* eslint-disable no-alert, no-console */
'use strict';

const parseXmlFile = require('./file').parseXmlFile;
const parser = require('./parser').parser;
const processorEn = require('./processor.en').processor;

parser.processorFn = processorEn;
parseXmlFile('data', '', parser);
