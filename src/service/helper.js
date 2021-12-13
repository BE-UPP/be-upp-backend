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

function responseError(response, err) {
  err.code = err.code ? err.code : 400;
  err.message = err.message ? err.message : err.toString();
  response.header({'X-Robots-Tag': 'noindex'}).status(err.code).json(err.message);
}

module.exports = {
  clone: clone,
  omit: omit,
  responseError: responseError,
};
