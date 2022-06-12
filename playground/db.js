const db = require('../src/db');
const {CustomDB} = require('../src/db/custom')

async function aaa() {
  try {
    await db.put('abc', 'aaa');
    const result = await db.get('abc');
    console.log(result);
  } catch (error) {
    console.error(error)
  }
}

async function custom() {
  try {
    const user = {lockedSessionJwts: []}
    await CustomDB.put('uid', user)
    const result = await CustomDB.get('uid');
    console.log(result);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error)
  }
}

custom();
