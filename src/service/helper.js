const omit = (obj, okey) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== okey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

function responseError(response, err) {
  err.code = err.code ? err.code : 200;
  err.message = err.message ? err.message : err.toString();
  response.header({"X-Robots-Tag": "noindex"}).status(err.code).json(err.message);
}

module.exports = {
  omit: omit,
  responseError: responseError
};
