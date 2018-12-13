var jwt = require('jsonwebtoken');
var fs = require('fs');
var resolve = require('path').resolve;

var auth = function () {
    return (function () {
        return {
            verify: function (token) {
                // Verifies if the bearer token is valid
                var cert_priv = fs.readFileSync(resolve(__dirname + './../ssh_keys/public'));
                var verified = false;
                // slice to remove "Bearer " from the token
                jwt.verify(token.slice(7), cert_priv, { algorithms: ['RS256'] }, function (err, decoded) {
                    if (decoded) {
                        verified = decoded;
                    }
                });
                return verified;
            }
        };
    }());
};

module.exports = auth;