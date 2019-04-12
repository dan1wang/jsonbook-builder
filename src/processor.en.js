/* eslint-disable no-alert, no-console, require-jsdoc */
'use strict';

const json = require('./json');
const fsUtils = require('./file');

const tmpDir = fsUtils.getTempDir();

let articleCount = 0;

exports.processor = (article) => {
  articleCount++;
  // const collection = (Math.floor(articleCount / 10000) + 1) * 10000;
  if (articleCount % 100000 === 0) {
    console.log(`checking in: ${articleCount} articles processed...`);
  }

  if ((article.text[0]) &&
      (article.text[0]['subSections']) &&
      (article.text[0]['subSections'].length)) {
    const topSection = article.text[0];
    const subSections = topSection.subSections;
    for (let i=0; i < subSections.length; i++) {
      const lang = subSections[i].title;
      const secArticle = Object.assign({}, article);
      secArticle.text = [{
        level: 0,
        title: '',
        text: topSection.text,
        subSections: [subSections[i]],
      }];
      const fPath = `${tmpDir}/${lang}/${article.title[0]}/${article.id}.json`;
      fsUtils.mkDir(fPath, () => json.save(fPath, article));
    }
  } else {
    const fPath = `${tmpDir}/__stubs/${article.id}.json`;
    fsUtils.mkDir(fPath, () => json.save(fPath, article));
  }
  // const title = fsUtils.safeFileName(article.title);
};
