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
      const status = decoded.status;
      if (!status){
        return res.status(500).json({auth: false,
          message: 'Conta de usuário não ativada.'});
      }
      next();
    });
  };
};

const authorize = (roles = []) => {
  if (typeof roles === 'string'){
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token){
      return res.status(401).json({auth: false, message: 'Token não foi fornecido.'});
    } else {
      jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err){
          return res.status(500).json({auth: false, message: 'Token inválido.'});
        };
        req.userId = decoded.id;
        req.userRole = decoded.role;
        const status = decoded.status;
        if (!status){
          return res.status(500).json({auth: false,
            message: 'Conta de usuário não ativada.'});
        }
      });
    };
    if (roles.length && !roles.includes(req.userRole)){
      return res.status(401)
        .json({ message: 'Acesso não autorizado'});
    }
    next();
  };
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
  authorize: authorize,
};
