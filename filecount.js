/* eslint-disable no-alert, no-console */
'use strict';

// code based on https://code-maven.com/list-content-of-directory-with-nodejs

const fs = require('fs');
const path = require('path');
const sys = require('os');

const fPath = sys.tmpdir() + '/jsonbook-master';

function getDirectories(source) {
  const dirs = fs.readdirSync(source)
      .map(name => path.join(source, name))
      .filter(source => fs.lstatSync(source).isDirectory())
  return dirs;
}

function countFiles(source) {
  const subdirs = getDirectories(source);
  let count = 0;
  if ((subdirs) && (subdirs.length)) {
    for (let i = 0; i < subdirs.length; i++) count+= countFiles(subdirs[i]);
  } else {
    count = fs.readdirSync(source).length;
  }
  return count;
}

const fPathLang = getDirectories(fPath);

for (let i = 0; i < fPathLang.length; i++) {
  fs.appendFileSync('filecount.tsv', fPathLang[i] + '\t' + countFiles(fPathLang[i]) + '\n');
}
