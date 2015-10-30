/***************************************************************
  Authserver
  ==========
  This is an experiment with JWT's. It provides an api
  for creating a user, signing in, requesting a JWT token
  and accessing a secure route with the JWT authorization.
***************************************************************/
var express    = require("express");      // Handles HTTP connections and routing
var bodyParser = require("body-parser");  // Parses incoming requests as JSON
var jwt        = require("jsonwebtoken"); // JSON Web Token Methods
var async      = require("async");        // Utilities for dealing with asynchronous code
var User       = require("basic-user");   // Simple user management
var createSecureMiddleware = require("./secureMiddleware");
                                          // Middleware to secure routes with a JWT


////////////////////
// Constants
////////////////////
const HTTP_OK             = 200; // Code for no error
const HTTP_CLIENT_ERR     = 400; // Error code for invalid client request
const HTTP_SERVER_ERR     = 500; // Error code for internal server error
const HTTP_UNAUTHORIZED   = 401; // Error code for client unauthorized error
const MIN_USERNAME_LENGTH = 2;   // Minimum length of a user's username
const MAX_USERNAME_LENGTH = 12;  // Maximum length of a user's username
const MIN_PASSWORD_LENGTH = 6;   // Minimum length of a user's password
const PORT                = 80;  // The port to listen for connections on
const TOKEN_SECRET        = "This is a really secret token used for JWT encryption";
                                 // Encryption key for JWT's


////////////////////
// Functions
////////////////////
/**************************************************************************/
/* Creates a JWT after verifying Username/Password                        */
/**************************************************************************/
var handleTokenRequest = function(request, response) {
    async.waterfall([
        // Check if user exists by getting him
        User.getUser.bind(User, request.body.username),

        // Verify the password
        (user, callback) => {
            user.verifyPassword(request.body.password, callback);
        },

        // Respond with JWT if valid, or error if not
        (passwordCorrect, callback) => {
            if (passwordCorrect) {
                var token = jwt.sign({
                    user: request.body.username
                }, TOKEN_SECRET);

                response.send({token});

                callback(null);
            } else {
                var error = new Error("Invalid Password");
                error.code = "INVALIDPASSWORD";
                callback(error);
            }
        }

    // Handle the errors
    ], err => {
        if (err && (err.code === "USERNOTFOUND" || err.code === "INVALIDPASSWORD")) {
            response.status(HTTP_UNAUTHORIZED).send({message: "Invalid User/Password Combination"});
        } else if (err) {
            response.status(HTTP_SERVER_ERR).send({message: err.message});
        }
    });
};

/**************************************************************************/
/* Signs a user up                                                        */
/**************************************************************************/
var handleSignup = function(request, response) {
    var errors = [];
    
    // Check if username exists
    if (typeof request.body.username === "undefined") {
        errors.push("Username not given.");
    } else {
        // Check if username is to short
        if (request.body.username.length < MIN_USERNAME_LENGTH) {
            errors.push("Username too short, it must be at least 2 characters.");
        }

        // Check if username is too long
        if (request.body.username.length > MAX_USERNAME_LENGTH) {
            errors.push("Username too long, it must be no more than 12 characters.");
        }
    }

    // Check if password exists
    if (typeof request.body.password === "undefined") {
        errors.push("Password not given.");
    } else {
        // Check if password is to short
        if (request.body.password.length <= MIN_PASSWORD_LENGTH) {
            errors.push("Password too short, it must be at least 6 characters.");
        }
    }

    // If there was an error, exit with error message
    if (errors.length > 0) {
        response.status(HTTP_CLIENT_ERR).send({message: errors.join(" ")});
        return;
    }


    // Create a user
    async.waterfall([
        // Check if user exists already
        User.exists.bind(User, request.body.username),

        // If it does exist, send an error. Otherwise create the user.
        (exists, callback) => {
            if (exists) {
                var error = new Error("User Exists");
                error.code = "USEREXISTS";
                callback(error);
            } else {
                var newUser = new User(request.body.username);
                newUser.setPassword(request.body.password, callback);
            }
        },

        // Save the new user to disk
        (user, callback) => {
            user.save(callback);
        }
    ], error => {
        if (error && error.code === "USEREXISTS") {
            response.status(HTTP_CLIENT_ERR).send({message: "User already exists."});
        } else if (error) {
            response.status(HTTP_SERVER_ERR).send({message: error.message});
        } else {
            response.status(HTTP_OK).end();
        }
    })
};


///////////////////
// Main
///////////////////
// Create the express application and secure middleware
var app = express();
var secureMiddleware = createSecureMiddleware(TOKEN_SECRET);

// Parse all requests as JSON
app.use(bodyParser.json({type: "*/*"}));

// Create secure routes
app.get("/secure", secureMiddleware);
app.get("/secure", (req, res) => {
    res.send({message: "Successful Access"});
});

// Create authentication routes
app.post("/token",  handleTokenRequest);
app.post("/signup", handleSignup);

// Create regular route
app.get("/unsecure", (req, res) => {
    res.send({message: "This is an unsecure route."});
});

// Attach server to port
app.listen(PORT, err => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Listening for connections!");
});
