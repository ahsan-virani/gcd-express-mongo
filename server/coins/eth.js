var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if its available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




console.log('eth client created');


const EthService = {

	GetNewAccount(altNode) {

		console.log('GetNewAccount');
		return Promise.resolve(web3.eth.version);
		// return new Promise(function(resolve, reject) {

		// var version = web3.version.api;
		// return resolve version; // "0.2.0"

		// });

	},

	getBalance(accountId) {
		return Promise.resolve(web3.eth.getBalance(accountId));
	},

	sendTransaction(senderAccount, receiverAccount, amount) {
		var finalAmount = web3.toWei(amount, "ether");
		web3.personal.unlockAccount(senderAccount, "123456")
		return Promise.resolve(web3.eth.sendTransaction({ from: senderAccount, to: receiverAccount, value: finalAmount }));
	},

};

export default EthService;
