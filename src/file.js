/* eslint-disable no-alert, no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const sys = require('os');
const branch = require('git-branch');
const bgWhite = require('chalk').bgWhite;
const PassThrough = require('stream').PassThrough;

/**
 * Get a pass-through stream processor for displaying file loading status
 * @param {string} fPath File path
 * @param {string} fName File name
 * @return {object} A PassThrough object
 */
function getFileBar(fPath, fName) {
  let startTime = 0;
  const fTotalSize = fs.statSync(fPath + fName).size;
  let fReadSize = 0;
  let lastProgress = -1;
  const fileBar = new PassThrough();
  fileBar.on('data', (data) => {
    fReadSize += data.length;
    if (startTime ===0) startTime = (new Date()).valueOf();
    const progress = Math.round(1000 * fReadSize / fTotalSize) / 1000;
    if (progress !== lastProgress) {
      lastProgress = progress;
      // draw progress bar
      const filled = Math.round(progress * 20, 0);
      const bars = bgWhite(' '.repeat(filled)) + '.'.repeat(20 - filled);
      const pct = (progress * 100).toFixed(1) + '%';
      // process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`[${bars}]: Reading "${fName}" (${pct})`);
    }
  });
  fileBar.on('end', () => {
    const elapsedTime = ((new Date()).valueOf() - startTime) / (60 * 1000);
    const h = Math.floor(elapsedTime / 60);
    const m = Math.floor(elapsedTime) % 60;
    let t;
    switch (h) {
      case 0: t = m + ' mins.'; break;
      case 1: t = h + ' hr ' + m + ' mins.'; break;
      default: t = h + ' hrs ' + m + ' mins.';
    }
    console.log('\nFinished in ' + t);
  });
  return fileBar;
}

/**
 * Get the file stream of a file
 * @param {string} fPath File path
 * @param {string} fName File name
 * @return {object} A ReadStream object
 */
function getFileStream(fPath, fName) {
  const fullFilePath = fPath + fName;
  if (fs.existsSync(fPath)) {
    const fStream = fs.createReadStream(fullFilePath);
    return fStream;
  } else {
    throw new Error(`Cannot find "${fullFilePath}".`);
  }
}

/**
 * Process an XML file.
 * If fName is empty, the first .xml file is processed
 * @param {string} fPath File path
 * @param {string} fName File name
 * @param {object} parser XML parser
 */
function parseXmlFile(fPath, fName, parser) {
  if (fPath[fPath.length-1] !== '/') fPath = fPath + '/';
  if (!fName) {
    const files = fs.readdirSync(fPath).sort();
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.slice(f.length-4).toLowerCase() === '.xml') {
        fName = f;
        break;
      }
    }
    if (!fName) {
      throw new Error(`Cannot find any XML file in "${fPath}".`);
    }
  }
  const fFileBar = getFileBar(fPath, fName);
  getFileStream(fPath, fName).pipe(fFileBar).pipe(parser);
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
exports.parseXmlFile = parseXmlFile;
exports.mkDir = mkDir;
exports.getTempDir = getTempDir;
