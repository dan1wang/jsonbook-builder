/* eslint-disable no-alert, no-console */
'use strict';

const fs = require('fs');
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
        case   4: logFile = '004 Wiktionary.tsv'; break;
        case   6: logFile = '006 file.tsv'; break;
        case   8: logFile = '008 MediaWiki.tsv'
        case  10: logFile = '010 template.tsv'; break;
        case  12: logFile = '012 help.tsv'; break;
        case  14: logFile = '014 category.tsv'; break;
        case  90: logFile = '090 thread.tsv'; break;
        case  92: logFile = '092 summary.tsv'; break;
        case 100: logFile = '100 appendix.tsv'; break;
        case 102: logFile = '102 condordance.tsv'; break;
        case 104: logFile = '104 index.tsv'; break;
        case 106: logFile = '106 rhymes.tsv'; break;
        case 108: logFile = '108 transwiki.tsv'; break;
        case 110: logFile = '110 thesaurus.tsv'; break;
        case 114: logFile = '114 citation.tsv'; break;
        case 116: logFile = '116 sign gloss.tsv'; break;
        case 118: logFile = '118 reconstruction.tsv'; break;
        case 828: logFile = '828 module.tsv'; break;
        default: logFile = article.ns + '.tsv';
      }
      fs.appendFileSync(logFile, article.title + '\t' + article.id + '\n');
    } else {
      if (article.text.indexOf('<!--') !== -1)
        fs.appendFileSync('articles with comment tag.tsv', article.title + '\t' + article.id + '\n');

      if (article.text.indexOf('<pre>') !== -1)
        fs.appendFileSync('articles with pre tag.tsv', article.title + '\t' + article.id + '\n');

      if (article.text.indexOf('<code>') !== -1)
        fs.appendFileSync('articles with code tag.tsv', article.title + '\t' + article.id + '\n');
    }

    article = {};
  }
  xPath.pop(node.name);
  xPathString = xPath.join('/');
});

xParser.on('end', () => console.log('Stopping at ' + (new Date())));


// -------------------------------------------


getFileStream().pipe(xParser);
