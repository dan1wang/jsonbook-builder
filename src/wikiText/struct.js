/* eslint-disable no-alert, no-console */
'use strict';

exports.struct = struct;

/**
 * Trim leading and ending line breaks
 *
 * "  \n  some text \n -----\n" should becomes "  some text"
 * @param {string} text
 * @return {string} a new string
 */
function trimText(text) {
  return text
      // trim leading line breaks (but not identation)
      .replace(/^\s*\n+/, '')
      // trim ending line breaks and horizontal rule
      .replace(/\s*\n[-]*\s*$/, '');
}

/**
 * Find all headings in an article text
 * @param {string} articleText
 * @return {array} headings infomation (with level, title, and position)
 */
function findHeadings(articleText) {
  const regexHeading = new RegExp('^\\s*(=+)(.*)\\1\\s*$', 'gm');
  const results = [];
  let match;
  while ((match = regexHeading.exec(articleText)) !== null) {
    results.push({
      line: match[0],
      level: match[1].length,
      title: match[2].trim(),
      pos: regexHeading.lastIndex - match[0].length,
    });
  }
  return results;
}

/**
 * Return a new array with a level 0 section, followed by
 * all headings with section text
 * @param {array} headings heading information
 * @param {string} articleText original article text
 * @return {array} all headings (with level, title, and position)
 */
function buildTextList(headings, articleText) {
  if ((headings) && (headings.length)) {
    const top = {
      level: 0,
      title: '',
      text: trimText(articleText.substring(0, headings[0].pos)),
    };
    const results = [top];
    const lastIndex = headings.length-1;
    for (let i=0; i < headings.length; i++) {
      const currH = headings[i];
      const secStart = currH.pos + currH.line.length;
      const secEnd = (i !== lastIndex) ? headings[i+1].pos: articleText.length;
      const secText = trimText(articleText.substring(secStart, secEnd));
      results.push({level: currH.level, title: currH.title, text: secText});
    }
    return results;
  } else {
    return [{level: 0, title: '', text: trimText(articleText)}];
  }
}

/**
 * Turn a flat array of text to hierarchical array
 * @param {array} flatText A flat array of text
 * @return {array}
 */
function buildTextTree(flatText) {
  if ((!flatText instanceof Array)||(flatText.length === 0 )) return null;
  const results = [Object.assign({}, flatText[0])];
  let topIndex = 0;
  let topLevel = flatText[0].level;
  let childCount = 0;
  for (let i=1; i < flatText.length; i++) {
    if (flatText[i].level > topLevel) {
      childCount++;
    } else {
      if (childCount > 0) {
        const children = flatText.slice(topIndex+1, topIndex+childCount+1);
        results[results.length-1]['subSections'] = buildTextTree(children);
      }
      childCount = 0;
      topIndex = i;
      topLevel = flatText[i].level;
      results.push(Object.assign({}, flatText[i]));
    }
  }
  if (childCount > 0) {
    const children = flatText.slice(topIndex+1, topIndex+childCount+1);
    results[results.length-1]['subSections'] = buildTextTree(children);
  }
  return results;
}


/**
 * Turn flat article text to hierarchical text
 * @param {string} aText Original article text
 * @return {array}
 */
function struct(aText) {
  return buildTextTree(buildTextList(findHeadings(aText), aText));
}
