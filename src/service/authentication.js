const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const options = { expiresIn: '1d' };

  const token = jwt.sign(payload, process.env.SECRET, options);

  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  const profile = req.body.profile;

  if (!token){
    return res.status(401).json({auth: false, message: 'Token não foi fornecido.'});
  } else {
    jwt.verify(token, process.env.SECRET, function(err, decoded){
      if (err){
        return res.status(500).json({auth: false, message: 'Token inválido.'});
      };

      if ((!profile) || (profile === decoded.profile)){
        next();
      } else {
        return res.status(403).json({auth: false,
          message: 'Acesso não permitido para esse tipo de usuário.'});
      };
    });
  };
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
