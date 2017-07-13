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

	// validate here

	return WalletService.withdrawCoins(userId, address, amount, comment, toComment, altNode)
		.then((success) => {
			res.json({
				success
			});
		})
		.catch((error) => {
			console.log('BtcService.SendToAddress failed: ', error);
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

	return Wallet.getAddress(req.user._id, coinType)
		.then((address) => {
			res.json({
				address,
				coinType,
			});
		})
		.catch((e) => {
			return BtcService.GetNewAddress()
				.then((address) => {
					return addAddress(req.user._id, coinType, address)
						.then((addAddr) => {
							return res.json({
								address,
								coinType,
							});
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch(error => next(error));
		});
}

function generateAccount(req, res, next) {
	const coinType = 'ETH';

	return BtcService.GetNewAddress(coinType)
		.then((address) => {
			res.json({
				address,
			});
		})
		.catch(error => next(error));
}

function addAddress(userId, coinType, address) {
	return Wallet.getByUserId(userId)
		.then((wallet) => {
			const coin = wallet.coins.find(c => c.coinType === coinType);
			const newCoinAddress = new CoinAddress({ address });
			return newCoinAddress.save()
				.then(() => {
					coin.addresses.push(newCoinAddress);
					// newCoinAddress.save()
					return wallet.save();
				});
		});
}

function createWallet(user) {
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
				currencyName: 'Etherium',
				symbol: 'ETH',
				availableBalance: 0,
				pendingDeposit: 0,
				reserved: 0,
				total: 0,
				estValue: 0,
				change: 0,
				addresses: [],
			}),
		],
	});
	return wallet.save();
}

export default { load, get, createWallet, generateAddress, sendCoinsToAddress, generateAccount };
