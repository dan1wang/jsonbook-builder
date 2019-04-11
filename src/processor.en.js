/* eslint-disable no-alert, no-console */
'use strict';

const json = require('./json');
const safeFileName = require('./file').safeFileName;
const fsUtils = require('./file');

const tmpDir = fsUtils.getTempDir();

exports.processor = (article) => {
  const title = safeFileName(article.title);
  const destDir =
      (article.text.indexOf('==English==') !== -1)
      ? 'en'
      : 'en/others';
  // json.save(`${destDir}/(${article.id}) ${title}.json`, article);
  const fPath = `${tmpDir}/${destDir}/${article.id}.json`
  fsUtils.mkDir(fPath, () => json.save(fPath, article));
};

/*


function parseArticle(article) {
  const lines =
    article.text.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

  // Match any heading
  const reHeading = /(=+).*\1/;

}

// let count = 0;
// let categories = [];
// let headings = [];
const reHeading = /(=+).*\1/;

function parsePage(page) {
  const pageContent = page.revision.text['$text'];
  const pageTitle = page.title['$text'];

  if ((pageTitle === null) || (pageTitle === undefined)) {
    // console.log(`Error: got a page with no title: ${page}`);
  }

  if (pageTitle.indexOf(':') !== -1) {
    // let category = pageTitle.slice(0, pageTitle.indexOf(':'));
    // if (!categories.includes(category)) categories.push(category);
  } else {
    console.log(pageTitle);
    if ((pageContent === null) || (pageContent === undefined)) {
      // console.log(`Error: "${pageTitle}" has no content`);
    } else {

      // console.log(page.revision.text);

      // const lines = pageContent.split(/\r?\n/);
      const lines =
        pageContent.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

      // console.log(pageTitle + '(' + lines.length + ')');
      // console.log('\n\n');
      // console.log(pageContent);
      // console.log('\n\n\n\n');

      for (let i = 0; i < lines.length -1; i++) {
        let line = lines[i].trim();
        let h = line.match(reHeading);
        if (h !== null) {
          h = h[0];
          if (!headings.includes(h)) headings.push(h);
        }
      }
    }
  }

  count++;
  // if (count > 10000) xParser.pause();
}
*/

// Etymology
// Pronunciation
// ===Noun===
// ====Synonyms====
// ====Derived terms====
