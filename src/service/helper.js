const omit = (obj, okey) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== okey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = {
  omit: omit,
  clone: clone,
};
