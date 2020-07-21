# Simple example server for OAuth2 consumer with JWT access tokens

A simple NodeJS OAuth2 consumer with JWT access tokens made with Passport.js.

This is a trivial example, and not made for production use. It is made to show how an OAuth access token
can contain basic user data without needing further resource calls. It also demonstrates the usage of the server using the JWT token for further resource requests from the OAuth server.

See [https://oauth.net/2/jwt-access-tokens/](https://oauth.net/2/jwt-access-tokens/)

## Requirements

- nodejs
- an OAuth2 server
- The RSA public key from your OAuth2 provider, or the secret for decrypting the JWT

## Installation

* Checkout the project with git
* Run `npm install` at the project root

## Config

* Copy `.env.sample` to `.env` and fill it in with your OAuth2 configuration variables
* Copy `jwt-client-secret.sample` to `jwt-client-secret` and enter your JWT secret or RSA public key here

## Running the project

* Start the server listening on port `3000` by running `npm start`
* Visit `localhost:3000` to login and debug

