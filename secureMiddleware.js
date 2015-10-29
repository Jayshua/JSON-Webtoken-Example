/*******************************************************
  Secure Middleware
  =================
  Provides very basic middleware for securing routes
  with JWT authentication.
*******************************************************/
var   jwt               = require("jsonwebtoken");
const HTTP_UNAUTHORIZED = 401; // Error code for client unauthorized error

/**********************************************************************/
/* Verifies a JWT and blocks access if it isn't valid                 */
/**********************************************************************/
module.exports = function(token_secret) {
    return function(req, res, next) {
        var token = req.headers.authorization;

        if (!token) {
            res.status(HTTP_UNAUTHORIZED).send({"message": "Unauthorized - No Token"});
            return;
        }

        jwt.verify(token, token_secret, function(err, result) {
            if (err) {
                res.status(HTTP_UNAUTHORIZED).send({"message": "Unauthorized - Invalid Token"});
                return;
            }

            req.token = result;
            next();
        });
    }
};
