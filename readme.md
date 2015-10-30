# JSON Web Token Example
This is a simple example implementation of [JSON Web Token Authentication](http://jwt.io/) ([RFC 7519](https://tools.ietf.org/html/rfc7519)). JSON Web Token is a stateless login/authentication standard. Basically, that means it lets a server verify who the client is without maintaining any records of who is logged in. This fits right in with the concepts behind REST APIs and HTTP in general. Plus, it's a really interesting standard!

## How to try it
You'll need a client that can issue HTTP requests. (A browser won't work, I haven't written a client.) If you're a command line guy, [CURL](http://curl.haxx.se/) will work. If you prefer a GUI, my favorite is [PostMan](https://www.getpostman.com/).

You'll need to install the modules with `npm install`.

1. Issue a GET request to /secure to be denied access
2. Issue a POST request to /signup with this body to signup:

   ```json
   {"username":"micky","password":"mouse"}
   ```
(Note that this does not return a JWT.)

3. Issue a POST request to /token to request a JWT. (Use the same body as the /signup request.)
4. Put the JWT in an `Authorization` header and issue a GET request to /secure to see the secure content.

## Example CURL requests
```
Try to get a secure address
> curl localhost/secure
< {"message":"Unauthorized - No Token"}

Signup with the json in body.json (file must exist in current directory)
> curl -X POST --data "@body.json" -H "Content-Type: application/json" localhost/signup
< [no response]

Get a JWT
> curl -X POST --data "@body.json" localhost/token
< {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiamF5c2h1YSIsImlhdCI6MTQ0NjE3MzQ0N30.dI_mQTFoa1n-9TvlZPhSJUO6LIf-w-chVgykVgb1RcU"}

Request secure address with access token
> curl -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiamF5c2h1YSIsImlhdCI6MTQ0NjE3MzE1MH0.IMbZHZt_GF8w8AsuLIOwdoaLfxk1MRL-atVpmWCQs70" localhost/secure
< {"message":"Successful Access"}
```

## Some things to try and think about
1. Is the JWT valid after a server restart? If not, how could it be made so? If so, how could it be made invalid after a restart?
2. Many JWT implementations were recently found to be flawed. More information on that flaw can be found at https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/
3. If you create two servers, one can verify that you have successfully logged into the other with no communication between two servers. This is essentially what oAuth tries to solve, and one of the primary reasons for the JWT Standard. How could this be accomplished? (Rest assured, the solution to this question is much simpler than the oAuth protocol.)

Some resources to help solve #3:

- http://jwt.io/
- https://www.npmjs.com/package/jsonwebtoken

(MIT License)
