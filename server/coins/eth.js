var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if its available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




console.log('eth client created');


const EthService = {

	GetNewAccount(altNode) {

		console.log('hammad');
		return Promise.resolve(web3.version.network);
		// return new Promise(function(resolve, reject) {

		// var version = web3.version.api;
		// return resolve version; // "0.2.0"

		// });

	},

};

export default EthService;
