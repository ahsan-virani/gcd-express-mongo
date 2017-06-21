import oauth2orize from 'oauth2orize';
import express from 'express';
import authCtrl from '../controllers/auth.controller';
import oauth2Ctrl from '../controllers/oauth2.controller';


const router = express.Router(); // eslint-disable-line new-cap

router.route('/authorize')
  .get(authCtrl.isAuthenticated, oauth2Ctrl.authorization)
  .post(authCtrl.isAuthenticated, oauth2Ctrl.decision);

// Create endpoint handlers for oauth2 token
router.route('/token')
  .post(authCtrl.isClientAuthenticated, oauth2Ctrl.token);

export default router;
