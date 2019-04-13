/* eslint-disable no-alert, no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const sax = require('sax');

const DATA_DIR = 'data/';

function getFileStream() {
  const files = fs.readdirSync(DATA_DIR);
  for (let i = 0; i < files.length; i++) {
    const fName = files[i];
    if (fName.slice(fName.length-4).toLowerCase() === '.xml') {
      return fs.createReadStream(DATA_DIR + fName);
    }
  }
  throw new Error('Cannot find any .xml file in "data/" directory.');
}

const xParser = sax.createStream(
    true,
    {normalize: false, lowercase: false}
);

const xPath = [];
let xPathString = '';
let article = {};

xParser.on('text', (t) => {
  switch (xPathString) {
    case 'mediawiki/page/id': article['id'] = Number(t); break;
    case 'mediawiki/page/ns': article['ns'] = Number(t); break;
    case 'mediawiki/page/title': article['title'] = t; break;
    case 'mediawiki/page/revision/text': article['text'] = t; break;
    case 'mediawiki/page/revision/timestamp':
      article['timestamp'] = (new Date(t)).valueOf();
      break;
    default:
  }
});

xParser.on('opentag', (node) => {
  if (xPath.length === 0) {
    if (node.name !== 'mediawiki') {
      throw new Error('XML file is not a Wiktionary file!');
    } else {
      console.log('Starting at ' + (new Date()));
    }
  }
  xPath.push(node.name);
  xPathString = xPath.join('/');
});

xParser.on('closetag', (node) => {
  if (xPathString === 'mediawiki/page') {

    if (article.ns !== 0) {
      let logFile;
      switch (article.ns) {
        case   4: logFile = '004 Wiktionary.log'; break;
        case   6: logFile = '006 file.log'; break;
        case   8: logFile = '008 MediaWiki.log'
        case  10: logFile = '010 template.log'; break;
        case  12: logFile = '012 help.log'; break;
        case  14: logFile = '014 category.log'; break;
        case  90: logFile = '090 thread.log'; break;
        case  92: logFile = '092 summary.log'; break;
        case 100: logFile = '100 appendix.log'; break;
        case 102: logFile = '102 condordance.log'; break;
        case 104: logFile = '104 index.log'; break;
        case 106: logFile = '106 rhymes.log'; break;
        case 108: logFile = '108 transwiki.log'; break;
        case 110: logFile = '110 thesaurus.log'; break;
        case 114: logFile = '114 citation.log'; break;
        case 116: logFile = '116 sign gloss.log'; break;
        case 118: logFile = '118 reconstruction.log'; break;
        case 828: logFile = '828 module.log'; break;
        default: logFile = article.ns + '.log';
      }
      fs.appendFileSync(logFile, article.title + '\t' + article.id + '\n');
    } else {
      if (article.text.indexOf('<!--') !== -1)
        fs.appendFileSync('articles with comment tag.log', article.title + '\t' + article.id + '\n');

      if (article.text.indexOf('<pre>') !== -1)
        fs.appendFileSync('articles with pre tag.log', article.title + '\t' + article.id + '\n');

      if (article.text.indexOf('<code>') !== -1)
        fs.appendFileSync('articles with code tag.log', article.title + '\t' + article.id + '\n');
    }

    article = {};
  }
  xPath.pop(node.name);
  xPathString = xPath.join('/');
});

xParser.on('end', () => console.log('Stopping at ' + (new Date())));


// -------------------------------------------


getFileStream().pipe(xParser);
