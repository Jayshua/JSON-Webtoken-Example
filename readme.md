# JSON Web Token Example
This is a simple example implementation of JSON Web Token authentication. JSON Web Token is a stateless login/authentication standard. Basically, that means it lets the server verify the client without maintaining any records of who is logged in. This fits right in with the concepts behind REST APIs and HTTP in general. Plus, it's a really interesting standard!

## How to try it
You'll need a client that can issue HTTP requests. (A browser won't work, I haven't written a client.) If you're a command line guy, [CURL](http://curl.haxx.se/) will work. If you prefer a GUI, my favorite is [PostMan](https://www.getpostman.com/).

You'll need to install the modules with `npm install`.

1. Issue a GET request to /secure to be denied access
2. Issue a POST request to /signup with the body
   ```json
   {"username":"micky","password":"mouse"}
   ```
   to signup (note that this does not return a JWT)
3. Issue a POST request to /token to request a JWT with the same body as the /signup request.
4. Put the JWT in an `Authorization` header and issue a GET request to /secure to see the secure content.

## About It
The application has three main functions:

1. handleTokenRequest - Checks the user/login and issues a JWT if they are valid.
2. handleSignup - Creates a user with the given username/password
3. secureMiddleware - A module that checks a request for a valid JWT and rejects unauthorized requests. Can be applied to any route with `app.get("/secureRoute", secureMiddleware)` (or any app.method).