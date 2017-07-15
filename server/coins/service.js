import BtcService from './btc';
import EthService from './eth';
import { BTC_TYPE, ETH_TYPE } from '../constants';

const CoinService = {
	GetInfo(coinType) {
		switch (coinType) {
			case BTC_TYPE:
				return BtcService.GetInfo();
				break;
			default:
				return BtcService.GetInfo();
		}
	},

	GetNewAddress(coinType, altNode = false) {
		switch (coinType) {
			case BTC_TYPE:
				return BtcService.GetNewAddress(altNode);
				break;
			case ETH_TYPE:
				return EthService.GetNewAccount(altNode);
				break;

			default:
				return BtcService.GetNewAddress(altNode);
		}
	},

	getBalance(accountId, coinType, altNode = false) {
		switch (coinType) {
			case ETH_TYPE:
				return EthService.getBalance(accountId);
				break;
			default:
				return BtcService.GetNewAddress(altNode);
		}
	},

	sendEther(coinType, senderAccount, receiverAccount, amount, altNode = false) {
		switch (coinType) {
			case ETH_TYPE:
				return EthService.sendTransaction(senderAccount, receiverAccount, amount);
				break;
			default:
				return BtcService.GetNewAddress(altNode);
		}
	},

	SendToAddress(coinType, address, amount, comment, toComment, altNode) {
		switch (coinType) {
			case BTC_TYPE:
				return BtcService.SendToAddress(coinType, address, amount, comment, toComment, altNode);
				break;
			default:
				return BtcService.SendToAddress(coinType, address, amount, comment, toComment, altNode);
		}

	},

	generateBlocks(coinType, numBlocks, altNode) {

		switch (coinType) {
			case BTC_TYPE:
				return BtcService.generateBlocks(numBlocks, altNode);
				break;
			default:
				return BtcService.generateBlocks(numBlocks, altNode);
		}

	},

	listReceivedByAddress(coinType, confirmations = 2, altNode = false) {
		switch (coinType) {
			case BTC_TYPE:
				return BtcService.listReceivedByAddress(confirmations, altNode);
				break;
			default:
				return BtcService.listReceivedByAddress(confirmations, altNode);
		}
	},
};

export default CoinService;
