/* eslint-disable no-alert, no-console */
'use strict';

const sax = require('sax');

const xParser = sax.createStream(
    true,
    {normalize: false, lowercase: false}
);

let article = {};
const xPath = [];
let xPathString = '';

xParser.on('text', (t) => {
  switch (xPathString) {
    case 'mediawiki/page/id': article['id'] = Number(t); break;
    case 'mediawiki/page/ns': article['ns'] = Number(t); break;
    case 'mediawiki/page/title': article['title'] = t; break;
    case 'mediawiki/page/revision/timestamp':
      article['timestamp'] = (new Date(t)).valueOf();
      break;
    case 'mediawiki/page/revision/text':
      article['text'] = t;
      break;
    default:
  }
});

xParser.on('opentag', (node) => {
  if (xPath.length === 0) {
    if (node.name !== 'mediawiki') {
      throw new Error('XML file is not a Wiktionary file!');
    } else {
      console.log('This might take a while, so please take a break...');
      console.log(new Date());
    }
  }
  xPath.push(node.name);
  xPathString = xPath.join('/');
});

xParser.on('closetag', (node) => {
  if (xPathString === 'mediawiki/page') {
    if (article.ns === 0) {
      if (typeof xParser.processorFn === 'function') {
        xParser.processorFn(article);
      }
    }
    article = {};
  }
  xPath.pop(node.name);
  xPathString = xPath.join('/');
});

xParser.onend = () => console.log('Coffee break is over(' + (new Date()) + ')');

xParser.onerror = (e) => console.log('Error: ' + e);

exports.parser = xParser;
