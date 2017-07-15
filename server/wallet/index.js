import { Wallet, CoinWallet, CoinAddress } from '../models/wallet.model';
import { BTC_TYPE, ETH_TYPE } from '../constants';
import CoinService from '../coins/service';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

var cronJobInterval = setInterval(cronJob, 20000);
// updateAllBalances();

function restartCronJob() {
  clearInterval(cronJobInterval);
  updateAllBalances()
    .then(() => {
      cronJobInterval = setInterval(cronJob, 20000);
    });
}

const WalletService = {
  update() {
    restartCronJob();
  },

  withdrawCoins(userId, coinType, address, amoun, comment, toComment, altNode = false) {
    const amount = Number(amoun);

    return Wallet.getByUserId(userId)
      .then((wallet) => {
        console.log('WALLET: CHECK HERE: ', wallet);
        let coin = wallet.coins.find((c) => c.coinType === coinType);
        console.log('coin is available', coin);
        console.log('address:', address);
        console.log('amount:', amount);
        console.log('comment:', comment);
        console.log('toComment:', toComment);

        if (coin.availableBalance >= amount) {
          return CoinService.SendToAddress(coinType, address, coin.addresses[0].address, amount, comment, toComment, altNode)
            .then((txId) => {
              console.log('CoinService.SendToAddress DONE: ', txId);
              // coin.availableBalance -= amount;
              // if (isNaN(amount)) console.log('amount is not a number');
              // if (isNaN(coin.withdrawn)) console.log('coin.withdrawn is not a number');
              if (coin.coinType !== ETH_TYPE)
                coin.withdrawn += amount;
              console.log('COIN NOW: ', coin);
              return coin.save()
                .then(() => {
                  console.log('coin.save() DONE: ');
                  return wallet.save()
                    .then(() => {
                      return Promise.resolve(true);
                    });
                })
                .catch((e) => {
                  console.log('coin.save() FAILED: ', e);
                  return Promise.reject(new APIError('Withdraw Failed, failed to save transaction to DB'));
                })
              // insert transactoin in DB
              // WalletService

            })
            // .then(WalletService.update)
            .catch((error) => {
              console.log('CoinService.SendToAddress failed: BTC SERVICE CATCH', error);
              return Promise.reject(new APIError('Withdraw Failed'));
            });

        }
        const dadaBachi = new APIError('Not enough balance', httpStatus.UNAUTHORIZED, true);
        console.log('DADA BACHI!');
        console.log(dadaBachi);
        return Promise.reject(new APIError('Not enough balance', 400, true));
      })
      .catch(e => {
        return Promise.reject(new APIError('Withdraw Failed', e));
      });

    // transfer from available to reserved
    // run send service
    // move remove from reserved to withdarwn
    // Wallet.

  },

  generateAddress(userId, coinType) {
    return Wallet.getAddress(userId, coinType)
      .then((address) => {
        return Promise.resolve({
          address,
          coinType,
        });
      })
      .catch((e) => {
        return CoinService.GetNewAddress()
          .then((address) => {
            return this.addAddress(userId, coinType, address)
              .then((addAddr) => {
                return Promise.resolve({
                  address,
                  coinType,
                });
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          })
          .catch(error => Promise.reject(error));
      });
  },


  addAddress(userId, coinType, address) {
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
  },

  getBalance(userId, coinType) {

    const accountId = "0xcbb9153ae146fd691ee7d5347f4c83d1d40d0e8b";
    return CoinService.getBalance(accountId, coinType)
      .then((balance) => {
        return balance;
      })
      .catch(error => Promise.reject(error));

  },

  sendEther(userId, coinType, senderAccount, receiverAccount, amount) {

    const accountId = "0xcbb9153ae146fd691ee7d5347f4c83d1d40d0e8b";
    return CoinService.sendEther(coinType, senderAccount, receiverAccount, amount)
      .then((balance) => {
        return balance;
      })
      .catch(error => Promise.reject(error));

  },


};

function fetchBalances(coin) {
  // console.log('fetchBalances: ', coin);
  switch (coin.coinType) {
  case BTC_TYPE:
    return CoinService.listReceivedByAddress(BTC_TYPE)
      .then((list) => {
        let balance = 0;
        // console.log('coin.addresses', coin.addresses);
        coin.addresses.forEach((item) => {
          balance = list.filter(add => add.address === item.address)
            .reduce((acc, i) => {
              // console.log('i.amount', i.amount);
              return acc + i.amount;
            }, balance);
        });
        // console.log('balance: ', balance);
        return Promise.resolve(balance);
      });
    // break;
  case ETH_TYPE:
    return CoinService.getBalance(coin.addresses[0].address, ETH_TYPE);
    break;
  default:
    return Promise.reject('coin type undefined');
  }

  return Promise.reject('coin type undefined');
}

function updateAllBalancesOld() {
  console.log('updateBalances');
  return Wallet.getAll()
    .then((wallets) => {
      // console.log('Wallet.getByUserId', wallet);
      return Promise.all(wallets.map((wallet) => {
        const coin = wallet.coins.find(c => c.coinType === 'BTC');
        return fetchBalances(coin)
          .then((balance) => {
            console.log('coin:', coin);
            console.log('BALANCE log: ', balance);
            // coin.withdrawn = 0;
            coin.availableBalance = balance - coin.withdrawn;
            coin.total = coin.availableBalance;
            return coin.save()
              .then(wallet.save);
          });
      }));
      //  wallet.coins.find(coin=>coin.coinType === 'BTC');
    });
}

function updateAllBalances() {
  console.log('updateBalances');
  return Wallet.getAll()
    .then((wallets) => {
      // console.log('Wallet.getByUserId', wallet);
      return Promise.all(wallets.map((wallet) => {
        return Promise.all(wallet.coins.map((coin) => {
          return fetchBalances(coin)
            .then((balance) => {
              console.log('coin:', coin);
              console.log('BALANCE log: ', balance);
              // coin.withdrawn = 0;
              coin.availableBalance = balance - coin.withdrawn;
              coin.total = coin.availableBalance;
              return coin.save()
                .then(wallet.save);
            });
        }));

        // const coin = wallet.coins.find(c => c.coinType === 'BTC');
        // return fetchBalances(coin)
        //   .then((balance) => {
        //     console.log('coin:', coin);
        //     console.log('BALANCE log: ', balance);
        //     // coin.withdrawn = 0;
        //     coin.availableBalance = balance - coin.withdrawn;
        //     coin.total = coin.availableBalance;
        //     return coin.save()
        //       .then(wallet.save);
        //   });
      }));
      //  wallet.coins.find(coin=>coin.coinType === 'BTC');
    });
}

// function updateBalances() {
//   console.log('updateBalances');
//   return Wallet.getByUserId('5945a9f334e8fe1295646882')
//     .then((wallet) => {
//       // console.log('Wallet.getByUserId', wallet);
//       let coin = wallet.coins.find(coin => coin.coinType === 'BTC');
//       return fetchBalances(coin)
//         .then((balance) => {
//           console.log('BALANCE log: ', balance);
//           coin.availableBalance = balance - coin.withdrawn;
//           return coin.save()
//             .then(wallet.save);
//         });
//       //  wallet.coins.find(coin=>coin.coinType === 'BTC');
//     });
// }

// setInterval(updateBalances, 10000);

// var

function cronJob() {
  return CoinService.generateBlocks(BTC_TYPE, 2)
    .then(() => {
      return CoinService.generateBlocks(BTC_TYPE, 2, true);
    })
    .then(() => {
      return updateAllBalances()
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        })
    })
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
}

// function updateWalletBalances(amount) {
//   console.log('wallet update balance methodcalled', amount);
//   let coin = this.coins.find(c => c.coinType === 'BTC');
//   coin.availableBalance = amount;
//   return coin.save()
//     .then(this.save);
//   // return this.save();
// }
// setInterval(updateBalances, 10000);
//list.find((item)=>item.address) .reduce((acc, item)=>{
// 	return acc + item.amount;
// }, 0);
export default WalletService;
