import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import walletCtrl from '../controllers/wallet.controller';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
// router.route('/login')
//   .post(validate(paramValidation.login), authCtrl.login);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
// router.route('/random-number')
//   .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);
//
// router.route('/random-shit')
//   .get((req, res, next) => {
//     res.send("jasdjasjdajsdas");
//   });

router.route('/withdraw')
	.post(authCtrl.isAuthenticatedJWT, walletCtrl.sendCoinsToAddress);

router.route('/generateAddress')
	// .get(expressJwt({ secret: config.jwtSecret }), walletCtrl.get);
	.post(authCtrl.isAuthenticatedJWT, walletCtrl.generateAddress);

router.route('/generateAccount')
	// .get(expressJwt({ secret: config.jwtSecret }), walletCtrl.get);
	.post(walletCtrl.generateAccount);

router.route('/')
	// .get(expressJwt({ secret: config.jwtSecret }), walletCtrl.get);
	.get(authCtrl.isAuthenticatedJWT, walletCtrl.get);

// route.

// router.param('walletId', walletCtrl.load);

// router.route('/')
//   .get(expressJwt({ secret: config.jwtSecret }), walletCtrl.getWallet);
// .get(walletCtrl.getWallet);

export default router;
