import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import Client from '../models/client.model';


// Create endpoint /api/client for POST
function postClients(req, res, next) {
  // Create a new instance of the Client model
  var client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  // Save the client and check for errors
  client.save().then(() => {
    res.json({ message: 'Client added to the locker!', data: client });
  }).catch(err => {
    next(err);
  });
  // client.save(function(err) {
  //   if (err)
  //     next(err);
  //   // res.send(err);
  //   else {
  //     res.json({ message: 'Client added to the locker!', data: client });
  //   }
  // });
}

// Create endpoint /api/clients for GET
function getClients(req, res, next) {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, function(err, clients) {
    if (err)
      // res.send(err);
      next(err);
    else {
      res.json(clients);
    }
  });
}

// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid username and password is provided
 // * @param req
 // * @param res
 // * @param next
 // * @returns {*}
 */
// function login(req, res, next) {
//   // Ideally you'll fetch this from the db
//   // Idea here was to show how jwt works with simplicity
//   const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
//
//   var user = User.getByUserId(req.body.username)
//     .then((user) => {
//       user.comparePassword(req.body.password, (error, isMatch) => {
//         if (error) return next(err);
//         if (isMatch == true) {
//           const token = jwt.sign({
//             username: user.username
//           }, config.jwtSecret, { expiresIn: 60 });
//
//           return res.json({
//             token,
//             username: user.username
//           });
//         } else {
//           return next(err);
//         }
//       });
//     }).catch(e => { return next(e) });
// }

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
//  * @param req
//  * @param res
//  * @returns {*}
//  */
// function getWallet(req, res) {
//   // req.user is assigned by jwt middleware if valid token is provided
//   return res.json({
//     user: req.user,
//     num: Math.random() * 100
//   });
// }

export default { postClients, getClients };
