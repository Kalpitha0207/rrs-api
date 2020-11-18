const jwt = require('jsonwebtoken');

const auth = {
  required: (req, res, next) => {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization;
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            errors: {
              code: 'token_expired',
              message: err.message,
              error: {},
            },
          });
        } else {
          {
            req.payload = decoded;
            next();
          }
        }
      })
    } else {
      return res.status(401).json({
        errors: {
          code: 'token_required',
          message: 'Token is Required',
          error: {},
        },
      });
    }
  },
  optional: (req, res, next) => {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        req.payload = decoded;
        next();
      })
    } else {
      next();
    }
  }
};

module.exports = auth;