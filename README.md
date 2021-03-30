## _two-factor-authentication-example_

The purpose is to show how 2FA works. There is only Google Authentication support without JWT or hashing password.
First step after the server start runing is register a user, by typing username, password and repeated password. If everything goes well under registry form appears successful message. Now you can try log in. After first successfully login you will see a qrcode to scan by Google Authentication app in your phone and enable a tfa authentication. Now, every next login form will contain a 3 inputs: username, password and token (you have a 30 sec to type current token from Google Authentication).
If you would like to reset a password, just fill a register form with new data.
Every restart a server clean the list of registered useres, because there are no db support.
Enjoy

## Backend

JavaScript server use dependencies:
 - body-parser
 - cors
 - express
 - qrcode
 - speakeasy

### Installation

Backend requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd backend
npm i
node app.js
```
Default port is 3000

## Frontend

Web app show only registra

### Installation

Clients side requireds [Angular CLI](https://angular.io/) v11 to run.

Install the dependencies and devDependencies and start the server.

```sh
cd frontend
npm i
node app.js
```

# TODO

 - deploy on Heroku
 - write tests
