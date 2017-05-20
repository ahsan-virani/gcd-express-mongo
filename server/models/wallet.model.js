// import Promise from 'bluebird';
// import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';
// // import bcrypt from 'bcrypt';
// // import { passwordSaltFactor } from '../../config/config';
//
// /**
//  * User Schema
//  */
// const WalletSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true
//   },
//   userid: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//
// });
//
// /**
//  * Add your
//  * - pre-save hooks
//  * - validations
//  * - virtuals
//  */
//
// UserSchema.pre('save', function(next) {
//   var user = this;
//
//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();
//
//   // generate a salt
//   bcrypt.genSalt(passwordSaltFactor, function(err, salt) {
//     if (err) return next(err);
//
//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if (err) return next(err);
//
//       // override the cleartext password with the hashed one
//       user.password = hash;
//       next();
//     });
//   });
// });
//
// /**
//  * Methods
//  */
// UserSchema.methods = {
//   comparePassword(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//       if (err) return cb(err);
//       cb(null, isMatch);
//     });
//   }
// };
//
// /**
//  * Statics
//  */
// UserSchema.statics = {
//   /**
//    * Get user
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
//   get(id) {
//     return this.findById(id)
//       .exec()
//       .then((user) => {
//         if (user) {
//           return user;
//         }
//         const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
//         return Promise.reject(err);
//       });
//   },
//
//   getByUserId(userName) {
//     return this.findOne({ username: userName })
//       .exec()
//       .then((user) => {
//         if (user) {
//           return user;
//         }
//         const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
//         return Promise.reject(err);
//       });
//   },
//
//   /**
//    * List users in descending order of 'createdAt' timestamp.
//    * @param {number} skip - Number of users to be skipped.
//    * @param {number} limit - Limit number of users to be returned.
//    * @returns {Promise<User[]>}
//    */
//   list({ skip = 0, limit = 50 } = {}) {
//     return this.find()
//       .sort({ createdAt: -1 })
//       .skip(+skip)
//       .limit(+limit)
//       .exec();
//   }
// };
//
// /**
//  * @typedef User
//  */
// export default mongoose.model('User', UserSchema);
