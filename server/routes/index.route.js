import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import walletRoutes from './wallet.route';
import clientsRoutes from './clients.route';
import oauth2Routes from './oauth2.route';
import expressJwt from 'express-jwt';
import config from '../../config/config';
var passport = require('passport');

const router = express.Router(); // eslint-disable-line new-cap

router.use(passport.initialize());
// router.use(expressJwt({ secret: config.jwtSecret }).unless({ path: ['api/auth'] }));

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);
router.use('/clients', clientsRoutes);
router.use('/oauth2', oauth2Routes);
router.use('/wallet', walletRoutes);

export default router;
