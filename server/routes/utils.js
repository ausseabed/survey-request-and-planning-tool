const boom = require('boom');

var auth = require('../lib/auth')();

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    err.statusCode = err.output.statusCode;
    next(err);
  });
};

// Raise 401 if user is not authenticated
export function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
            return next();
        }
    }

    // Send unauthrized response if we get here
    res.status(401).send('Unauthorized');
}

// Appends user to req is authenticated, will not 401
export function authenticatedUser(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
        }
    }

    return next();
}
