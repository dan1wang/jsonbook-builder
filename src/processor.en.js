/* eslint-disable no-alert, no-console */
'use strict';

const json = require('./json');
const safeFileName = require('./file').safeFileName;
const fsUtils = require('./file');

const tmpDir = fsUtils.getTempDir();

let articleCount = 0;

exports.processor = (article) => {
  articleCount++;
  const collection = (Math.floor(articleCount / 10000) + 1) * 10000;
  if (articleCount % 100000 === 0) {
    console.log(`checking in: ${articleCount} articles processed...`);
  }

  const title = safeFileName(article.title);
  const destDir =
      (article.text.indexOf('==English==') !== -1)
      ? 'en'
      : 'xx';
  // json.save(`${destDir}/(${article.id}) ${title}.json`, article);
  const fPath = `${tmpDir}/${collection}/${destDir}/${article.id}.json`
  fsUtils.mkDir(fPath, () => json.save(fPath, article));
};

/*

function splitArticles(article) {
  const results = [];
  const copy = Object.assign({}, article);
  delete copy.text;
  
  const lines =
    article.text.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

  // Match any heading
  const reHeading = /(=+).*\1/;

}
*/
