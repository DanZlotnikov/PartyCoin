const fs = require('fs');
var crypto = require('crypto'),
  algorithm = 'aes-256-ctr';

function encrypt(data, filename, password) {
  data = JSON.stringify(data);
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');

  fs.writeFile(filename, crypted, function (err, crypted) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

function decrypt(file, password) {
  var data = fs.readFileSync(file).toString('utf8');
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(data, 'hex', 'utf8');
  dec += decipher.final('utf8');
  var jsonObj = JSON.parse(dec);
  return jsonObj;
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
