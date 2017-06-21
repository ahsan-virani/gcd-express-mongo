// Load required packages
// import mongoose from 'mongoose';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
// import bcrypt from 'bcrypt';
// import { passwordSaltFactor } from '../../config/config';

const CoinAddressSchema = new mongoose.Schema({
  address: { type: String }
});

const CoinWalletSchema = new mongoose.Schema({
  coinType: { type: String, required: true },
  currencyName: { type: String, required: true },
  symbol: { type: String, required: true },
  availableBalance: { type: Number, required: true },
  pendingDeposit: { type: Number, required: true },
  reserved: { type: Number, required: true },
  total: { type: Number, required: true },
  estValue: { type: Number, required: true },
  change: { type: Number, required: true },
  addresses: [CoinAddressSchema],
  withdrawn: { type: Number, required: true, default: 0 }
});

CoinWalletSchema.methods = {
  moveToReserved(amount) {
    return new Promise((resolve, reject) => {
      console.log('MOVE TO RESERVED!');
      try {
        if (amount < this.availableBalance) {
          this.availableBalance -= amount;
          this.reserved += amount;
          return this.save()
            .then(resolve(true));
        }
        reject({ amount, message: 'Not enough balance' });
      } catch (e) {
        return reject(e);
      }
    });
  }
}

CoinWalletSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((coin) => {
        return coin;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  testFunc(id, amount) {
    // console.log();
    console.log('COINID and AMOUNT: ', id, amount);
    return this.find()
      .exec()
      .then((coin) => {

        console.log('FETCHED coin', coin);
        coin[0].moveToReserved(amount)
          .save()
          .then(() => {
            // log
            return Promise.resolve(true);
          })
          .catch(err => {
            return Promise.reject(err);
          })
      })
      // .moveToReserved(amount)
      // // .exec()
      // .save()
      .catch((e) => {
        console.log('THIS.FIND FAILED');
        return Promise.reject(e);
      })
  }
};

const UserWalletSchema = new mongoose.Schema({

});

// Define our token schema
const WalletSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  coins: [CoinWalletSchema]
});

WalletSchema.methods = {
  updateBalances(amount) {
    console.log('wallet update balance methodcalled', amount);
    let coin = this.coins.find(c => c.coinType === 'BTC');
    coin.availableBalance = amount;
    return coin.save()
      .then(this.save);
    // return this.save();
  }

}

WalletSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((wallet) => {
        if (wallet) {
          return wallet;
        }
        const err = new APIError('No wallet for this id exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByUserId(userid) {
    return this.findOne({ userId: userid })
      .exec()
      .then((wallet) => {
        if (wallet) {
          return wallet;
        }
        const err = new APIError('No wallet for this id exists!', httpStatus.NOT_FOUND);
        // console.log();
        return Promise.reject(err);
      });
  },

  getAll() {
    return this.find()
      .exec()
      .then((wallet) => {
        if (wallet) {
          return wallet;
        }
        const err = new APIError('Error fetching all wallets!', httpStatus.NOT_FOUND);
        // console.log();
        return Promise.reject(err);
      });
  },

  getAddress(userId, coinType) {
    return this.findOne({ userId })
      .exec()
      .then((wallet) => {
        console.log('wallet.coins:', wallet.coins);
        const coin = wallet.coins.find(c => c.coinType === coinType);
        if (coin.addresses && coin.addresses.length > 0) {
          return coin.addresses[0].address;
        }
        return Promise.reject();
        // wallet.coins.findOne({ coinType })
        // 	.exec()
        // 	.then((coin) => {
        // 		if (coin.addresses && coin.addresses.length > 0) {
        // 			return coin.addresses[0];
        // 		}
        // 		return Promise.reject();
        // 	})
      });
  },

  // addAddress(userId, coinType, address) {
  // 	return this.findOne({ userId })
  // 		.exec()
  // 		.then((wallet) => {
  // 			const coin = wallet.coins.find(c => c.coinType === coinType);
  // 			const newCoinAddress = new CoinAddress({ address });
  // 			coin.addresses.push(newCoinAddress);
  // 			// newCoinAddress.save()
  // 			return this.save();
  // 			// wallet.coins.findOne({ coinType })
  // 			// 	.exec()
  // 			// 	.then((coin) => {
  // 			// 		coin.addresses.push(new CoinAddress({ address }));
  // 			// 		return this.save();
  // 			// 	});
  // 		});
  // },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

// Export the Mongoose model

const Wallet = mongoose.model('Wallet', WalletSchema);
const CoinWallet = mongoose.model('CoinWallet', CoinWalletSchema);
const CoinAddress = mongoose.model('CoinAddress', CoinAddressSchema);

export default { Wallet, CoinWallet, CoinAddress };
// export default mongoose.model('Wallet', WalletSchema);
// export mongoose.model('CoinWallet', CoinWalletSchema);
