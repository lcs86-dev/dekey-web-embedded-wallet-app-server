const db = require('./index');

class CustomDB {
  static async get(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (err, data) => {
        if (err) reject(err);
        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (err) {
          reject(err)
        }
      });
    })
  }

  static async put(key, data) {
    return new Promise((resolve, reject) => {
      try {
        const jsonStr = JSON.stringify(data);
        db.put(key, jsonStr, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        });
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = CustomDB