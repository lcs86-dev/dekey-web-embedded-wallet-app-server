// const assert = require("assert");
// const crypto = require("crypto");

// const key = "afjkdjlf";
// const text = "text";

// const cipher = crypto.createCipher("aes-256-cbc", key);
// let result = cipher.update(text, "utf8", "base64"); // 'HbMtmFdroLU0arLpMflQ'
// result += cipher.final("base64"); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='

// const decipher = crypto.createDecipher("aes-256-cbc", key);
// let result2 = decipher.update(result, "base64", "utf8"); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
// result2 += decipher.final("utf8"); // 암호화할문장 (여기도 base64대신 utf8)

// assert(result2 === text);

// console.log(result2);

var CryptoJS = require("crypto-js");

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(
  "my message",
  "secret key 123"
).toString();

console.log(ciphertext);

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText);
