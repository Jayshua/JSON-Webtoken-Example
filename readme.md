# JSON Web Token Example
This is a simple example implementation of [JSON Web Token Authentication](http://jwt.io/) ([RFC 7519](https://tools.ietf.org/html/rfc7519)). JSON Web Token is a stateless login/authentication standard. Basically, that means it lets a server verify who the client is without maintaining any records of who is logged in. This fits right in with the concepts behind REST APIs and HTTP in general. Plus, it's a really interesting standard!

## How to try it
You'll need a client that can issue HTTP requests. (A browser won't work, I haven't written a client.) If you're a command line guy, [cURL](http://curl.haxx.se/) will work. If you prefer a GUI, my favorite is [PostMan](https://www.getpostman.com/).

You'll need to install the modules with `npm install`.

1. Issue a GET request to /secure to be denied access
2. Issue a POST request to /signup with this body to signup:

   ```json
   {"username":"micky","password":"mouse"}
   ```
(Note that this does not return a JWT.)

3. Issue a POST request to /token to request a JWT. (Use the same body as the /signup request.)
4. Put the JWT in an `Authorization` header and issue a GET request to /secure to see the secure content.

## Example cURL requests
```
Try to get a secure address
> curl localhost/secure
< {"message":"Unauthorized - No Token"}

Signup with the json info in body.json (file must exist in current directory)
> curl -X POST --data "@exampleRequest.json" localhost/signup
< [200 OK]

Get a JWT
> curl -X POST --data "@exampleRequest.json" localhost/token
< {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibHVjeSIsImlhdCI6MTQ0NjE3NDMyOH0.rjOiHQcw2phL8YEjfwmjqlHD04LTCsmINz6zyi6F2SY"}

Request the secure address with an access token
> curl -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibHVjeSIsImlhdCI6MTQ0NjE3NDMyOH0.rjOiHQcw2phL8YEjfwmjqlHD04LTCsmINz6zyi6F2SY" localhost/secure
< {"message":"Successful Access"}
```

## Some things to try and think about
1. Is the JWT valid after a server restart? If not, how could it be made so? If so, how could it be made invalid after a restart?
2. If a user deleted their account, how could you invalidate the JWT without keeping a record of all issued JWTs?
3. How could you make a JWT invalid after 6 hours without keeping a record of all issued JWTs?
4. Many JWT implementations were recently found to be flawed. More information on that flaw can be found at https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/
5. If you create two servers, one can verify that you have successfully logged into the other with no communication between two servers. This is essentially what oAuth tries to solve, and one of the primary reasons for the JWT Standard. How could this be accomplished? (Rest assured, the solution to this question is much simpler than the oAuth protocol.)

Some resources to help solve the questions:

- http://jwt.io/
- https://www.npmjs.com/package/jsonwebtoken

(MIT License)
