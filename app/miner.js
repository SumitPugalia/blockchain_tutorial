const Transaction = require('./transaction');
const Wallet = require('./index');

class Miner {
	constructor(blockchain, transactionPool, wallet, p2pServer) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	mine() {
		const validTransactions = this.transactionPool.validTransactions();
		validTransactions.push(
			Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
		);
		// include a reward for the miner
		const block = this.blockchain.addBlock(validTransactions);
		this.p2pServer.syncChains();
		this.transactionPool.clear();
		this.p2pServer.broadcastClearTransactions();

		return block;

		// create a block consisting of the valid transactions
		// synchronize chains in the peer-to-peer server
		// clear the transaction pool
		// broadcast to every miner to clear their transaction pools
	}
}

module.exports = Miner;