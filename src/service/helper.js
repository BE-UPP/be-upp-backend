const omit = (obj, okey) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== okey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

module.exports = {
  omit: omit,
};
