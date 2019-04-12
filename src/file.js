/* eslint-disable no-alert, no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const sys = require('os');
const branch = require('git-branch');

const DATA_DIR = 'data/';

/**
 * Get async data stream of an .xml file
 * @param {string} fName File name
 * @return {object} Data stream
 */
function getFileStream(fName) {
  if (fName !== undefined) {
    const fPath = DATA_DIR + fName;
    if (fs.existsSync(fPath)) {
      return fs.createReadStream(fPath);
    } else {
      throw new Error(`"data/${fName}" cannot be found.`);
    }
  }

  const files = fs.readdirSync(DATA_DIR);
  for (let i = 0; i < files.length; i++) {
    const fName = files[i];
    if (fName.slice(fName.length-4).toLowerCase() === '.xml') {
      return fs.createReadStream(DATA_DIR + fName);
    }
  }
  throw new Error('Cannot find any .xml file in "data/" directory.');
}

/**
 * Sanitize filename
 * @param {string} fName Dirty file name
 * @return {string} Sanitized file name
 * Based on public-domain code by Sam Hocevar
 * https://github.com/parshap/node-sanitize-filename/blob/master/index.js
 */
function safeFileName(fName) {
  const illegalRe = /[\/\?<>\\:\*\|":]/g;
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const windowsTrailingRe = /[\. ]+$/;

  const sanitized = fName
      .replace(illegalRe, '-')
      .replace(controlRe, '')
      .replace(reservedRe, '')
      .replace(windowsReservedRe, '')
      .replace(windowsTrailingRe, '');
  return sanitized;
}

/**
 * Make sure a directory exists
 * @param {string} fPath target directory
 * @param {function} callback callback function
 */
function mkDir(fPath, callback) {
  fs.promises
      .mkdir(path.dirname(fPath), {recursive: true})
      .then( callback );
}

/**
 * Get temporary directory
 * @return {string} Directory path
 */
function getTempDir() {
  return sys.tmpdir() + '/jsonbook-' + branch.sync();
}

exports.safeFileName = safeFileName;
exports.getFileStream = getFileStream;
exports.mkDir = mkDir;
exports.getTempDir = getTempDir;
