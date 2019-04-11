/* eslint-disable no-alert, no-console */
'use strict';

const fs = require('fs');

exports.save = (fName, obj) => {
  const data = JSON.stringify(obj, null, 2);
  fs.writeFileSync(fName, data);
};
