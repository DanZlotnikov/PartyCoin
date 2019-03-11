const Web3 = require('web3');
const web3 = new Web3('http://34.236.40.42:8545');
const parseArgs = require('minimist');
const sha256 = require('js-sha256');
const config = require('./config.json');
const Tx = require('ethereumjs-tx');
const encryption = require('./encryption.js');
const ZEROS = config.contract.zeros;

var account = encryption.decrypt('./account.json', '123456');
var abi = config.contract.abi;
var kpay = web3.eth.Contract(abi);
kpay.options.address = config.contract.address;
var defaultAccount;


main();

async function main() {
	async function getAccount() { await web3.eth.getAccounts().then(result => { defaultAccount = result[0]; }) };
	await getAccount();

	args = parseArgs(process.argv);

	if (args.balanceOf) {
		return await balanceOf(args.balanceOf);
	}

	if (args.getBalance) {
		return await getBalance(args.getBalance);
	}

	if (args.defaultAccount) {
		console.log(defaultAccount);
		return defaultAccount;
	}

	if (args.totalSupply) {
		return totalSupply();
	}
}

async function balanceOf(address) {
	address = address.toLowerCase();
	console.log("KPay balance of " + address + ":");
	var ret;
	await kpay.methods.balanceOf(address).call()
		.then((res) => {
			console.log(res);
			ret = res;
		})
		.catch(function (error) {
			console.log("An error has occured. Please check your input.");
		});

	return (parseInt(ret) / ZEROS);
}

async function getBalance(address) {
	address = address.toLowerCase();
	console.log("ETH balance of " + address + ":");
	var ret;
	await web3.eth.getBalance(address)
		.then((res) => {
			console.log(res);
			ret = res;
		}).catch(function (error) {
			console.log("An error has occured. Please check your input.");
		});
	return (parseInt(ret) / ZEROS);
}

async function totalSupply() {
	console.log("Total Supply: ");
	var ret;
	await kpay.methods.totalSupply().call()
		.then((res) => {
			console.log(res);
			ret = res;
		})
		.catch(function (error) {
			console.log("An error has occured. Please check your input.");
		});
	return ret;
}

async function unlockAccount(address) {
	var unlocked;
	var password = "123456";
	await web3.eth.personal.unlockAccount(address, password, 10000)
		.then(function (val) {
			unlocked = val;
			console.log("Account unlocked. ");
		})
		.catch(function (error) { unlocked = false });

	return unlocked;
}

async function lockAccount(address) {
	await web3.eth.personal.lockAccount(address).then(console.log("Account locked.")).catch(
		function (error) {
			console.log("An error has occured.");
		});
}

module.exports = { getBalance, totalSupply, balanceOf }