import Client from 'bitcoin-core';
import config from '../../config/config';

const client = new Client({
  username: 'virani',
  password: 'Axact123',
  network: 'regtest',
  port: 8400
});

const altClient = new Client({
  username: 'virani',
  password: 'Axact123',
  network: 'regtest',
  port: 8401
});


console.log('btc client created');

// export default GetInfo = () => client.getInfo()
// .then(([body, headers]) => console.log(body, headers));

function generateBlocks(numBlocks) {
  return client.generate(numBlocks)
    .then((result) => {
      console.log('client.generate done', result);
      return altClient.generate(numBlocks)
        .then((res) => {
          console.log('altClient.generate done', res);
        })
        .catch((e) => {
          console.error('generate blocks altClient.generate error', e);
        });
    })
    .catch((error) => { console.error('generate blocks client.generate error', error); });

}

// setInterval(() => { generateBlocks(1); }, 10000);

const BtcService = {
  GetInfo() {
    return client.getInfo();
  },
  GetNewAddress(altNode) {
    if (altNode === true) {
      return altClient.getNewAddress();
    }
    return client.getNewAddress();
  },

  SendToAddress(address, amount, comment, toComment, altNode) {
    console.log('send to address called SERVICE');
    console.log('address', address);
    console.log('amount', amount);
    console.log('comment', comment);
    console.log('toComment', toComment);
    console.log('altNode', altNode);
    if (altNode === true) {
      console.log('send to address called SERVICE');
      console.log('address', address);
      console.log('amount', amount);
      console.log('comment', comment);
      console.log('toComment', toComment);
      console.log('altNode', altNode);
      return altClient.sendToAddress(address, amount, comment, toComment);
    }
    return client.sendToAddress(address, amount, comment, toComment);

  },

  generateBlocks(numBlocks, altNode) {
    return client.generate(numBlocks)
      .then((result) => {
        console.log('client.generate done', result);
        if (altNode !== true) {
          return Promise.resolve(result);
        }
        return altClient.generate(numBlocks)
          .then((res) => {
            console.log('altClient.generate done', res);
          })
          .catch((e) => {
            console.error('generate blocks altClient.generate error', e);
          });
      })
      .catch((error) => { console.error('generate blocks client.generate error', error); });

  },

  listReceivedByAddress(confirmations = 2, altNode = false) {
    if (altNode === true)
      return altClient.listReceivedByAddress(confirmations);
    return client.listReceivedByAddress(confirmations);
  },
};

export default BtcService;
