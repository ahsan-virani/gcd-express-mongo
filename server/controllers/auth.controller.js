import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import Client from '../models/client.model';
// import expressJwt from 'express-jwt';

import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy } from 'passport-http-bearer';
import PassportLocal from 'passport-local';
var LocalStrategy = PassportLocal.Strategy;
import Token from '../models/token.model';

import passportJwt from 'passport-jwt';
var JwtStrategy = passportJwt.Strategy,
  ExtractJwt = passportJwt.ExtractJwt;

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwtSecret,
  issuer: config.jwtIssuer
}

passport.use(new JwtStrategy(jwtOpts, function(jwt_payload, done) {
  User.findOne({ username: jwt_payload.username }, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username })
      .then(user => {
        if (!user) { return callback(null, false); }

        user.comparePassword(password, function(err, isMatch) {
          if (err) { return callback(err); }

          // Password did not match
          if (!isMatch) { return callback(null, false); }

          // Success
          return callback(null, user);
        });

      })
      .catch(err => {
        return callback(err);
      });
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return callback(err); }
    //
    //   // No user found with that username
    //   if (!user) { return callback(null, false); }
    //
    //   // Make sure the password is correct
    //   user.comparePassword(password, function(err, isMatch) {
    //     if (err) { return callback(err); }
    //
    //     // Password did not match
    //     if (!isMatch) { return callback(null, false); }
    //
    //     // Success
    //     return callback(null, user);
    //   });
    // });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username })
      .then(client => {
        // No client found with that id or bad password
        if (!client || client.secret !== password) { return callback(null, false); }

        // Success
        return callback(null, client);
      })
      .catch(err => {
        return callback(err);
      });
    // Client.findOne({ id: username }, function(err, client) {
    //   if (err) { return callback(err); }
    //
    //   // No client found with that id or bad password
    //   if (!client || client.secret !== password) { return callback(null, false); }
    //
    //   // Success
    //   return callback(null, client);
    // });
  }
));

passport.use(new Strategy(
  function(accessToken, callback) {
    Token.findOne({ value: accessToken })
      .then(token => {
        if (!token) { return callback(null, false); }
        User.findOne({ _id: token.userId })
          .then(user => {
            if (!user) { return callback(null, false); }
            callback(null, user, { scope: '*' });
          })
          .catch(err => {
            return callback(err);
          });

      })
      .catch(err => {
        return callback(err);
      });

    // Token.findOne({value: accessToken }, function (err, token) {
    //   if (err) { return callback(err); }
    //
    //   // No token found
    //   if (!token) { return callback(null, false); }
    //
    //   User.findOne({ _id: token.userId }, function (err, user) {
    //     if (err) { return callback(err); }
    //
    //     // No user found
    //     if (!user) { return callback(null, false); }
    //
    //     // Simple example with no scope
    //     callback(null, user, { scope: '*' });
    //   });
    // });
  }
));

passport.use(new LocalStrategy(
  function(username, password, callback) {
    User.findOne({ username: username })
      .then(user => {
        if (!user) { return callback(null, false); }
        user.comparePassword(password, function(err, isMatch) {
          if (err) { return callback(err); }

          // Password did not match
          if (!isMatch) { return callback(null, false); }

          // Success
          return callback(null, user);
        });
      })
      .catch(err => {
        return callback(err);
      });

    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return callback(err); }
    //
    //   // No user found with that username
    //   if (!user) { return callback(null, false); }
    //
    //   // Make sure the password is correct
    //   user.verifyPassword(password, function(err, isMatch) {
    //     if (err) { return callback(err); }
    //
    //     // Password did not match
    //     if (!isMatch) { return callback(null, false); }
    //
    //     // Success
    //     return callback(null, user);
    //   });
    // });
  }
));

const isBearerAuthenticated = passport.authenticate('bearer', { session: false });
const isAuthenticated = passport.authenticate(['local'], { session: false });
const isClientAuthenticated = passport.authenticate('client-basic', { session: false });

const isAuthenticatedJWT = passport.authenticate('jwt', { session: false });

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);

  var user = User.getByUserId(req.body.username)
    .then((user) => {
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (error) return next(err);
        if (isMatch == true) {
          const token = jwt.sign({
            username: user.username,
            iss: config.jwtIssuer
          }, config.jwtSecret, { expiresIn: 1000000 });

          return res.json({
            token,
            username: user.username
          });
        } else {
          return next(err);
        }
      });
    }).catch(e => { return next(e) });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

// const jwtAuthenticated = expressJwt({ secret: config.jwtSecret });

export default { login, getRandomNumber, isAuthenticated, isClientAuthenticated, isBearerAuthenticated, isAuthenticatedJWT };
