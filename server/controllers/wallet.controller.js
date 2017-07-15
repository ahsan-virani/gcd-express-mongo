import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { Wallet, CoinWallet, CoinAddress } from '../models/wallet.model';
import BtcService from '../coins/service';
import WalletService from '../wallet';
import { BTC_TYPE, ETH_TYPE } from '../constants';

function load(req, res, next, id) {
  Wallet.get(id)
    .then((wallet) => {
      req.wallet = wallet; // eslint-disable-line no-param-reassign
      // console.log("wallet aa gaya: ", wallet);
      return next();
    })
    .catch(e => next(e));
}

function get(req, res, next) {
  Wallet.getByUserId(req.user._id)
    .then((wallet) => {
      return res.json(wallet);
    })
    .catch(next);

}

function sendCoinsToAddress(req, res, next) {
  const address = req.body.sendingAddress;
  const amount = req.body.amount;
  const comment = req.body.comment;
  const toComment = req.body.toComment;
  const altNode = req.body.altClient;
  const userId = req.user._id;
  const coinType = req.body.coinType;

  // validate here

  return WalletService.withdrawCoins(userId, coinType, address, amount, comment, toComment, altNode)
    .then((success) => {
      res.json({
        success
      });
    })
    .catch((error) => {
      return next(error);
    });

  // BtcService.SendToAddress(address, amount, comment, toComment, altNode)
  //   .then((txId) => {
  //     // console.log('BtcService.SendToAddress: ');
  //     // console.log('BtcService.SendToAddress: ', txId);
  //     res.json({
  //       txId,
  //     });
  //   })
  //   .then(WalletService.update)
  //   .catch((error) => {
  //     console.log('BtcService.SendToAddress failed: ', error);
  //     return next(new APIError('Withdraw Failed'));
  //   });
}

function generateAddress(req, res, next) {
  const coinType = req.body.coinType;

  WalletService.generateAddress(req.user._id, coinType)
    .then((data) => {
      res.json(data);
    })
    .catch(err => next(err));
}


function generateAccount(req, res, next) {
  const userId = 1;
  const coinType = req.body.coinType;
  const senderAccount = req.body.senderAccount;
  const receiverAccount = req.body.receiverAccount;
  const amount = req.body.amount;
  //return res.json(req.body.senderAccount);
  WalletService.sendEther(userId, coinType, senderAccount, receiverAccount, amount)
    .then((data) => {
      res.json({
        data
      });
    })
    .catch(err => next(err));
}


function createWallet(user, etherAccount) {
  const wallet = new Wallet({
    userId: user.id,
    userName: user.username,
    coins: [
      new CoinWallet({
        coinType: BTC_TYPE,
        currencyName: 'Bitcoin',
        symbol: 'BTC',
        availableBalance: 0,
        pendingDeposit: 0,
        reserved: 0,
        total: 0,
        estValue: 0,
        change: 0,
        addresses: [],
      }),
      new CoinWallet({
        coinType: ETH_TYPE,
        currencyName: 'Ethereum',
        symbol: 'ETH',
        availableBalance: 0,
        pendingDeposit: 0,
        reserved: 0,
        total: 0,
        estValue: 0,
        change: 0,
        addresses: [
          new CoinAddress({
            address: etherAccount,
          }),
        ],
      }),
    ],
  });
  return wallet.save();
}

export default { load, get, createWallet, generateAddress, sendCoinsToAddress, generateAccount };
