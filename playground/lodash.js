const _ = require('lodash');

const user = {
  aaa: '',
  addresses: {
    'ddd': {
      pubkey: 'llll',
      rules: {
        'ppp': {
          contractAddress: 'ppp'
        },
        'iii': {
          contractAddress: 'iii'
        },
        'qqq': {
          contractAddress: 'qqq'
        }
      }
    },
  }
}

console.dir(user, {depth: 4});

console.dir(_.omit(user.addresses['ddd'].rules, ['ppp']));

console.dir(user, {depth: 4});
