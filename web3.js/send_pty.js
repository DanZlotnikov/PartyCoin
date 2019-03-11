const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const web3 = new Web3('http://34.236.40.42:8545');
const encryption = require('./encryption.js');
web3.eth.defaultAccount = "0xaf2e89f4406309d73c5271ee99d0672481c47c02";

var config = require('./config.json');
var account = encryption.decrypt('./account.json', '123456');
var privateKey = account.privateKey.substring(2);

// Address MUST be given without '0x' prefix
function transferPty(to, amount) {
    const getNonce = () => {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(account.address.substring(2), (error, result) => {
                if (error) reject(error);
                resolve(web3.utils.toHex(result));
            })
        })
    }
    
    const getGasPrice = () => {
        return new Promise((resolve, reject) => {
            web3.eth.getGasPrice((error, result) => {
                if (error) reject(error);
                resolve(web3.utils.toHex(parseInt(result)));
            })
        })
    }

    const sendSignedTransaction = (rawTx) => {
        const tx = new Tx(rawTx);
        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
            console.log('Error:', err);
            console.log('Hash:', hash);
        });
    }

    Promise.all([getNonce(), getGasPrice()])
        .then(values => {
            data = createErcTxData(to, amount);
            const rawTx = {
                to: config.contract.address,
                gasLimit: web3.utils.toHex(100001),
                value: 0,
                nonce: values[0],
                gasPrice: values[1],
                data: data
            };
            console.log(rawTx);
            return (rawTx);
        })
        .then(sendSignedTransaction)
        .catch(e => console.log(e))
}

function addZerosTo64(str) {
    while (str.length < 64) {
        str = "0" + str;
    }
    return str;
}

function createErcTxData(to, amount) {
    amount = amount * config.contract.zeros;
    amount = web3.utils.toHex(amount);
    to = to.toString();
    amount = addZerosTo64(amount.toString().substring(2));
    to = addZerosTo64(to);

    data = config.contract.transferFunctionHex;
    data = data + to + amount;
    return data;
}


module.exports = { transferPty };