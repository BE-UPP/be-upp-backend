const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const options = { expiresIn: '1d' };

  const token = jwt.sign(payload, process.env.SECRET, options);

  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token){
    return res.status(401).json({auth: false, message: 'Token não foi fornecido.'});
  } else {
    jwt.verify(token, process.env.SECRET, function(err, decoded){
      if (err){
        return res.status(500).json({auth: false, message: 'Token inválido.'});
      };
      req.userId = decoded.id;
      next();
    });
  };
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
