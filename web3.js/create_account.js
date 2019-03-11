const keythereum = require('keythereum');
const utils = require('ethereumjs-util');
const encryption = require('./encryption.js');
const fs = require('fs');

const params = {keyBytes: 32, ivBytes: 16};
const dk = keythereum.create(params);
const private = utils.bufferToHex(dk.privateKey);
const public = utils.bufferToHex(utils.privateToPublic(dk.privateKey));
const address = utils.bufferToHex(utils.privateToAddress(dk.privateKey));

var account = {
    "privateKey": private,
    "publicKey": public,
    "address": address
}

encryption.encrypt(account, './account.json', '123456');

fs.writeFile("address.txt", account.address, function (err, crypted) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
  